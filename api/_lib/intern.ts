import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

/**
 * Gemeinsame Hilfen für den internen Bereich (layer-form.de/intern).
 * Umgebungsvariablen:
 *   INTERN_PASSWORT        Passwort für die Anmeldung (Pflicht)
 *   SESSION_SECRET         optional, Schlüssel für Sitzungen (sonst aus dem Passwort abgeleitet)
 *   KV_REST_API_URL / KV_REST_API_TOKEN  (oder UPSTASH_REDIS_REST_URL / _TOKEN) – Datenbank
 *   GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET – Gmail-Anbindung
 */
export const fail = (res: VercelResponse, status: number, code: string, error: string) => res.status(status).json({ code, error });

const secret = () => {
  const pw = process.env.INTERN_PASSWORT || '';
  return process.env.SESSION_SECRET || createHash('sha256').update('layerform-intern:' + pw).digest('hex');
};
const b64 = (s: string) => Buffer.from(s).toString('base64url');
const sign = (payload: string) => createHmac('sha256', secret()).update(payload).digest('base64url');

export function makeToken(hours = 12) {
  const payload = b64(JSON.stringify({ exp: Date.now() + hours * 3600_000 }));
  return `${payload}.${sign(payload)}`;
}
export function verifyToken(token: string | undefined | null): boolean {
  if (!token || !process.env.INTERN_PASSWORT) return false;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;
  const want = Buffer.from(sign(payload)), got = Buffer.from(sig);
  if (want.length !== got.length || !timingSafeEqual(want, got)) return false;
  try { return JSON.parse(Buffer.from(payload, 'base64url').toString()).exp > Date.now(); } catch { return false; }
}
export function requireAuth(req: VercelRequest, res: VercelResponse): boolean {
  const h = String(req.headers.authorization || '');
  if (!verifyToken(h.startsWith('Bearer ') ? h.slice(7) : '')) { fail(res, 401, 'unauthorized', 'Nicht angemeldet'); return false; }
  return true;
}
export function passwordMatches(input: string) {
  const pw = process.env.INTERN_PASSWORT || '';
  const a = createHash('sha256').update(input).digest(), b = createHash('sha256').update(pw).digest();
  return pw.length > 0 && timingSafeEqual(a, b);
}

let redis: Redis | null = null;
export function db(): Redis | null {
  if (redis) return redis;
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  redis = new Redis({ url, token });
  return redis;
}
export const origin = (req: VercelRequest) => {
  const proto = String(req.headers['x-forwarded-proto'] || 'https').split(',')[0];
  return `${proto}://${req.headers['x-forwarded-host'] || req.headers.host}`;
};
