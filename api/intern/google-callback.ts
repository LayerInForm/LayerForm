import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db, origin, verifyToken } from '../_lib/intern.js';
import { saveRefreshToken } from '../_lib/google.js';

/** Rücksprung von Google: speichert den Refresh-Token in der Datenbank und führt zurück zu /intern. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!verifyToken(String(req.query.state || ''))) return res.status(401).send('Sitzung abgelaufen. Bitte unter /intern neu anmelden und erneut verbinden.');
  if (req.query.error) return res.redirect(302, '/intern?gmail=abgebrochen');
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code: String(req.query.code || ''), client_id: process.env.GOOGLE_CLIENT_ID!, client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: `${origin(req)}/api/intern/google-callback`, grant_type: 'authorization_code',
    }),
  });
  const j = await r.json() as { refresh_token?: string; error?: string };
  if (!r.ok || !j.refresh_token) return res.status(400).send('Google hat keine dauerhafte Freigabe geliefert. Bitte unter /intern erneut „Gmail verbinden“ wählen.');
  if (db()) { await saveRefreshToken(j.refresh_token); return res.redirect(302, '/intern?gmail=ok'); }
  // Ohne Datenbank: Token einmalig anzeigen, er wird als Umgebungsvariable in Vercel eingetragen
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  const esc = (t: string) => t.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
  return res.status(200).send(`<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Gmail verbunden</title>
<style>body{font-family:system-ui,sans-serif;background:#040B1D;color:#E8F1F7;max-width:640px;margin:0 auto;padding:32px 20px;line-height:1.5}code,textarea{width:100%;font:14px ui-monospace,monospace;background:#0A1731;color:#E8F1F7;border:1px solid #1d3360;border-radius:12px;padding:12px;box-sizing:border-box}a{color:#00E5FF}ol li{margin:6px 0}</style></head>
<body><h1>Gmail ist verbunden</h1><p>Damit der Zugriff dauerhaft funktioniert, trag diesen Schlüssel einmalig in Vercel ein:</p>
<ol><li>Vercel → Projekt <b>layerform</b> → Settings → Environment Variables</li><li>Name: <b>GOOGLE_REFRESH_TOKEN</b>, Wert: der Text unten</li><li>Speichern und unter Deployments <b>Redeploy</b> wählen</li></ol>
<textarea rows="4" readonly onclick="this.select()">${esc(j.refresh_token)}</textarea>
<p>Der Schlüssel erlaubt nur das Lesen deines Postfachs. Teile ihn mit niemandem und schließ diese Seite danach.</p><p><a href="/intern">Zurück zum internen Bereich</a></p></body></html>`);
}
