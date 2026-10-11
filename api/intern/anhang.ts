import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyToken } from '../_lib/intern.js';
import { GmailError, getAttachment } from '../_lib/google.js';

/** Öffnet einen E-Mail-Anhang aus der Kundenübersicht. Anmeldung über ?t=… (Links können keinen Header setzen). */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!verifyToken(String(req.query.t || ''))) return res.status(401).send('Bitte unter layer-form.de/intern anmelden.');
  const name = String(req.query.n || 'anhang').replace(/[^\w.\- äöüÄÖÜß]+/g, '_').slice(0, 120);
  const type = String(req.query.ty || 'application/octet-stream').replace(/[^\w.+\-/]/g, '');
  try {
    const buf = await getAttachment(String(req.query.m || ''), String(req.query.a || ''));
    if (buf.length > 4_400_000) return res.status(413).send('Der Anhang ist zu groß für die Vorschau. Bitte direkt in Gmail öffnen.');
    res.setHeader('Content-Type', type || 'application/octet-stream');
    res.setHeader('Content-Disposition', `${/^(image\/|application\/pdf)/.test(type) ? 'inline' : 'attachment'}; filename*=UTF-8''${encodeURIComponent(name)}`);
    res.setHeader('Cache-Control', 'private, no-store');
    res.setHeader('X-Robots-Tag', 'noindex');
    return res.status(200).send(buf);
  } catch (e) {
    if (e instanceof GmailError && e.code === 'needs_reauth') return res.status(409).send('Gmail-Verbindung abgelaufen. Bitte im internen Bereich neu verbinden.');
    console.error('anhang', e);
    return res.status(502).send('Der Anhang konnte nicht geladen werden. Bitte direkt in Gmail öffnen.');
  }
}
