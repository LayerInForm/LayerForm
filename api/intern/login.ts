import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHash } from 'node:crypto';
import { db, fail, makeToken, passwordMatches } from '../_lib/intern.js';

/**
 * Anmeldung für layer-form.de/intern. Gibt eine Sitzung für 12 Stunden zurück.
 * Begrenzung fehlgeschlagener Versuche über Redis, sofern die Datenbank konfiguriert ist.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return fail(res, 405, 'method', 'Nur POST');
  if (!process.env.INTERN_PASSWORT) return fail(res, 503, 'not_configured', 'Kein Passwort eingerichtet');

  const pw = (req.body as { passwort?: unknown } | undefined)?.passwort;
  if (typeof pw !== 'string' || pw.length > 1024) return fail(res, 400, 'invalid_input', 'Ungültige Eingabe');

  // Nur echte Browser-Anfragen von derselben Origin akzeptieren.
  const requestOrigin = req.headers.origin;
  if (requestOrigin) {
    const host = String(req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].trim();
    const expected = `https://${host}`;
    if (requestOrigin !== expected) return fail(res, 403, 'origin', 'Anfrage nicht erlaubt');
  }

  const redis = db();
  if (!redis) return fail(res, 503, 'rate_limit_unavailable', 'Anmeldung vorübergehend nicht verfügbar');

  const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
  const key = 'lf:intern:login:fail:' + createHash('sha256').update(ip).digest('hex');
  let attempts: number;
  try {
    // Atomar vor der Passwortprüfung zählen, damit parallele Versuche die Sperre nicht umgehen.
    attempts = await redis.incr(key);
    if (attempts === 1) await redis.expire(key, 900);
  } catch (error) {
    console.error('Login-Schutz: Redis nicht erreichbar', error);
    return fail(res, 503, 'rate_limit_unavailable', 'Anmeldung vorübergehend nicht verfügbar');
  }
  if (attempts > 10) {
    res.setHeader('Retry-After', '900');
    return fail(res, 429, 'rate_limited', 'Zu viele Anmeldeversuche. Bitte später erneut versuchen.');
  }

  if (!passwordMatches(pw)) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return fail(res, 401, 'wrong_password', 'Falsches Passwort');
  }

  try {
    await redis.del(key);
  } catch (error) {
    console.error('Login-Schutz: Zähler konnte nicht gelöscht werden', error);
  }
  return res.status(200).json({ token: makeToken() });
}
