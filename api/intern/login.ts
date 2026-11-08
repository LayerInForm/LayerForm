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
  const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
  const key = 'lf:intern:login:fail:' + createHash('sha256').update(ip).digest('hex');
  if (redis) {
    try {
      const failures = Number(await redis.get(key) || 0);
      if (failures >= 10) {
        res.setHeader('Retry-After', '900');
        return fail(res, 429, 'rate_limited', 'Zu viele Anmeldeversuche. Bitte später erneut versuchen.');
      }
    } catch (error) {
      console.error('Login-Schutz: Redis-Abfrage fehlgeschlagen', error);
    }
  }

  if (!passwordMatches(pw)) {
    if (redis) {
      try {
        const count = await redis.incr(key);
        if (count === 1) await redis.expire(key, 900);
      } catch (error) {
        console.error('Login-Schutz: Redis-Zähler fehlgeschlagen', error);
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 800));
    return fail(res, 401, 'wrong_password', 'Falsches Passwort');
  }

  if (redis) await redis.del(key).catch((error) => console.error('Login-Schutz: Zähler konnte nicht gelöscht werden', error));
  return res.status(200).json({ token: makeToken() });
}
