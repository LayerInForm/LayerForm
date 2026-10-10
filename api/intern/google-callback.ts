import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db, origin, verifyToken } from '../_lib/intern';
import { saveRefreshToken } from '../_lib/google';

/** Rücksprung von Google: speichert den Refresh-Token in der Datenbank und führt zurück zu /intern. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!verifyToken(String(req.query.state || ''))) return res.status(401).send('Sitzung abgelaufen. Bitte unter /intern neu anmelden und erneut verbinden.');
  if (req.query.error) return res.redirect(302, '/intern?gmail=abgebrochen');
  if (!db()) return res.status(503).send('Datenbank ist nicht eingerichtet.');
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code: String(req.query.code || ''), client_id: process.env.GOOGLE_CLIENT_ID!, client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: `${origin(req)}/api/intern/google-callback`, grant_type: 'authorization_code',
    }),
  });
  const j = await r.json() as { refresh_token?: string; error?: string };
  if (!r.ok || !j.refresh_token) return res.status(400).send('Google hat keine dauerhafte Freigabe geliefert. Bitte unter /intern erneut „Gmail verbinden“ wählen.');
  await saveRefreshToken(j.refresh_token);
  res.redirect(302, '/intern?gmail=ok');
}
