import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';
import { createHmac } from 'node:crypto';

// Speicherung einer pseudonymisierten Consent-Entscheidung, nicht von Kundendaten.
// POST /api/consent -> Upstash Redis (400 Tage). Kein Tracking-Endpunkt.
const TTL_SECONDS = 400 * 24 * 60 * 60;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Nur POST erlaubt' });
  }
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].trim().toLowerCase();
  const origin = String(req.headers.origin || '');
  try {
    const url = new URL(origin);
    if (url.protocol !== 'https:' || url.host.toLowerCase() !== host) throw new Error('invalid origin');
  } catch {
    return res.status(403).json({ error: 'Herkunft nicht erlaubt' });
  }
  if (String(req.headers['content-type'] || '').split(';')[0].trim().toLowerCase() !== 'application/json')
    return res.status(415).json({ error: 'JSON erforderlich' });
  if (Number(req.headers['content-length'] || 0) > 2048)
    return res.status(413).json({ error: 'Anfrage zu groß' });
  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body) || JSON.stringify(body).length > 2048)
    return res.status(400).json({ error: 'Ungültige Anfrage' });
  const { receiptId, previousReceiptId, analytics, hubspot, action, version } = body as Record<string, unknown>;
  if (typeof receiptId !== 'string' || !UUID.test(receiptId) ||
      (previousReceiptId !== null && previousReceiptId !== undefined &&
        (typeof previousReceiptId !== 'string' || !UUID.test(previousReceiptId))) ||
      typeof analytics !== 'boolean' || typeof hubspot !== 'boolean' ||
      version !== 3 || !['initial', 'update'].includes(String(action))) {
    return res.status(400).json({ error: 'Ungültige Consent-Angaben' });
  }
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return res.status(503).json({ error: 'Speicherung nicht verfügbar' });
  try {
    const redis = new Redis({ url, token });
    // Nur ein kurzer pseudonymer IP-HMAC zur Missbrauchsbegrenzung (10 Minuten).
    // Das eigentliche Consent-Protokoll enthält keine IP.
    const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '')
      .split(',')[0].trim();
    const bucket = Math.floor(Date.now() / 600000);
    const rateKey = 'lf:consent:rate:' + createHmac('sha256', token)
      .update(ip + ':' + bucket).digest('hex');
    const count = await redis.incr(rateKey);
    if (count === 1) await redis.expire(rateKey, 600);
    if (count > 30) return res.status(429).json({ error: 'Zu viele Versuche' });

    const timestamp = Date.now();
    const record = {
      receiptId,
      previousReceiptId: typeof previousReceiptId === 'string' ? previousReceiptId : null,
      analytics,
      hubspot,
      action,
      version,
      timestamp,
      source: 'layer-form.de/consent-v3'
    };
    const key = 'lf:consent:receipt:' + receiptId;
    // Identische ID kann nicht nachträglich überschrieben werden.
    const saved = await redis.set(key, record, { nx: true, ex: TTL_SECONDS });
    if (saved !== 'OK') return res.status(409).json({ error: 'Nachweis bereits vorhanden' });
    return res.status(201).json({ receiptId, timestamp });
  } catch (error) {
    console.error('Consent-Speicherung fehlgeschlagen', error instanceof Error ? error.name : 'unknown');
    return res.status(503).json({ error: 'Speicherung nicht verfügbar' });
  }
}
