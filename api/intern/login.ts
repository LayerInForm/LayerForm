import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fail, makeToken, passwordMatches } from '../_lib/intern';

/** Anmeldung für layer-form.de/intern. Gibt eine Sitzung für 12 Stunden zurück, die nur im Browser-Speicher der Seite liegt. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return fail(res, 405, 'method', 'Nur POST');
  if (!process.env.INTERN_PASSWORT) return fail(res, 503, 'not_configured', 'Kein Passwort eingerichtet');
  const pw = String((req.body as { passwort?: string })?.passwort || '');
  if (!passwordMatches(pw)) {
    await new Promise((r) => setTimeout(r, 800)); // bremst Rateversuche
    return fail(res, 401, 'wrong_password', 'Falsches Passwort');
  }
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ token: makeToken() });
}
