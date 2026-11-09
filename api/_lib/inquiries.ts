import { createHash, randomUUID } from 'node:crypto';
import { validateTurnstile } from './antispam.js';
import { Redis } from '@upstash/redis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export class DeliveryError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export function inquiryStore() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new DeliveryError(503, 'Übertragung momentan nicht verfügbar.');
  return new Redis({ url, token });
}
export const hash = (value: string) => createHash('sha256').update(value).digest('hex');
export function deliveryError(res: VercelResponse, error: unknown) {
  const known = error instanceof DeliveryError;
  console.error('Website-Anfrage fehlgeschlagen', known ? error.status : 'upstream');
  return res.status(known ? error.status : 502).json({ error: known ? error.message : 'Übertragung momentan nicht möglich. Bitte versuchen Sie es später erneut.', });
}

export async function inquiryGuard(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); res.status(405).json({ error: 'Nur POST erlaubt' }); return false; }
  if (String(req.headers['content-type']).split(';')[0] !== 'application/json') { res.status(415).json({ error: 'JSON erforderlich' }); return false; }
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) { res.status(400).json({ error: 'Ungültige Anfrage' }); return false; }
  if (Buffer.byteLength(JSON.stringify(req.body)) > 64000) { res.status(413).json({ error: 'Anfrage zu groß' }); return false; }
  if (req.headers.origin) {
    const host = String(req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].trim();
    if (req.headers.origin !== `https://${host}`) { res.status(403).json({ error: 'Herkunft nicht erlaubt' }); return false; }
  }
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(req.body.requestId || ''))) {
    res.status(400).json({ error: 'Bitte laden Sie das Formular neu.' }); return false;
  }
  try {
    const store = inquiryStore();
    const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
    const count = await store.eval("local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],900) end; return n", ['lf:website:rate:' + hash(ip)], []);
    if (Number(count) > 20) { res.setHeader('Retry-After', '900'); res.status(429).json({ error: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.' }); return false; }
    const verification = await validateTurnstile(req);
    if (verification !== 'ok') {
      res.status(verification === 'invalid' ? 400 : 503).json({ error: verification === 'invalid'
        ? 'Sicherheitsprüfung fehlgeschlagen. Bitte versuchen Sie es erneut.'
        : 'Sicherheitsprüfung momentan nicht verfügbar. Bitte versuchen Sie es später erneut.' });
      return false;
    }
    // Atomarer Zähler für neue Entwürfe; ein Retry derselben ID verbraucht keinen weiteren Platz.
    const unique = await store.eval(
      "if redis.call('SISMEMBER',KEYS[1],ARGV[1])==1 then return redis.call('SCARD',KEYS[1]) end; local n=redis.call('SCARD',KEYS[1]); if n>=5 then return 6 end; redis.call('SADD',KEYS[1],ARGV[1]); if n==0 then redis.call('EXPIRE',KEYS[1],900) end; return n+1",
      ['lf:website:new-rate:v1:' + hash(ip)], [String(req.body.requestId)],
    );
    if (Number(unique) > 5) {
      res.setHeader('Retry-After', '900');
      res.status(429).json({ error: 'Zu viele neue Anfragen. Bitte versuchen Sie es in 15 Minuten erneut.' });
      return false;
    }
    return true;
  } catch (error) { deliveryError(res, error); return false; }
}

// Never expire an uncertain write: a timeout may mean HubSpot committed it.
// Store only fingerprints/IDs, no inquiry text or email addresses.
export async function deliverOnce<T extends { dealId: string }>(id: string, fingerprint: string, create: (beforeWrite: () => Promise<void>) => Promise<T>) {
  const store = inquiryStore();
  const key = 'lf:website:request:v1:' + id;
  const lock = key + ':lock', owner = randomUUID();
  if (!await store.set(lock, owner, { nx: true, ex: 120 })) throw new DeliveryError(409, 'Diese Anfrage wird bereits verarbeitet. Bitte einen Moment warten.');
  try {
    const previous = await store.get<{ fingerprint: string; phase: string; result?: T }>(key);
    if (previous && previous.fingerprint !== fingerprint) throw new DeliveryError(409, 'Die Anfrage wurde bereits mit anderen Angaben gesendet. Bitte starten Sie eine neue Anfrage.');
    if (previous?.result) return { ...previous.result, duplicate: true };
    if (previous?.phase === 'writing') throw new DeliveryError(409, 'Der Eingang dieser Anfrage muss geprüft werden. Bitte nennen Sie uns die Anfrage-ID: ' + id);
    const result = await create(async () => {
      // NX is the final atomic fence, even if a slow worker outlives its lock.
      if (!await store.set(key, { fingerprint, phase: 'writing' }, { nx: true })) throw new DeliveryError(409, 'Diese Anfrage wird bereits geprüft.');
    });
    await store.set(key, { fingerprint, phase: 'done', result });
    return { ...result, duplicate: false };
  } catch (error) {
    const state = await store.get<{ phase: string }>(key).catch(() => null);
    if (state?.phase === 'writing' && !(error instanceof DeliveryError)) {
      console.error('Website-Anfrage benötigt Abgleich mit HubSpot', id);
      throw new DeliveryError(409, 'Der Eingang dieser Anfrage muss geprüft werden. Bitte nennen Sie uns die Anfrage-ID: ' + id);
    }
    throw error;
  } finally {
    await store.eval("if redis.call('GET',KEYS[1])==ARGV[1] then return redis.call('DEL',KEYS[1]) end; return 0", [lock], [owner]).catch(() => {});
  }
}
