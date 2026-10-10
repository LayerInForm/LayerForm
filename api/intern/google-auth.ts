import type { VercelRequest, VercelResponse } from '@vercel/node';
import { origin, verifyToken } from '../_lib/intern';
import { googleConfigured } from '../_lib/google';

/** Startet die einmalige Verbindung mit Gmail (Google-Anmeldung, nur Lesezugriff). */
export default function handler(req: VercelRequest, res: VercelResponse) {
  const t = String(req.query.t || '');
  if (!verifyToken(t)) return res.status(401).send('Bitte zuerst unter /intern anmelden.');
  if (!googleConfigured()) return res.status(503).send('GOOGLE_CLIENT_ID und GOOGLE_CLIENT_SECRET fehlen in Vercel.');
  const q = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!, redirect_uri: `${origin(req)}/api/intern/google-callback`,
    response_type: 'code', scope: 'https://www.googleapis.com/auth/gmail.readonly',
    access_type: 'offline', prompt: 'consent', include_granted_scopes: 'true', state: t,
  });
  res.redirect(302, `https://accounts.google.com/o/oauth2/v2/auth?${q}`);
}
