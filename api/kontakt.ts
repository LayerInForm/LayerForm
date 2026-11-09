import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { inquiryGuard, deliveryError } from './_lib/inquiries.js';
import { hubspotAktiv, legeLeadAn, type Lead } from './_lib/hubspot.js';

/**
 * Anfrageformular → direkt als Karte in HubSpot („LayerForm Aufträge“ → „Neue Anfrage“).
 * Ausschließlich HubSpot; keine Anfrage-E-Mail und kein E-Mail-Fallback.
 * Umgebungsvariablen: HUBSPOT_TOKEN, RESEND_API_KEY, ANFRAGE_EMPFAENGER, ANFRAGE_ABSENDER, ANFRAGE_BESTAETIGUNG
 */
const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const clip = (s: unknown, n = 300) => String(s ?? '').trim().slice(0, n);

const LEISTUNG: Record<string, Lead['leistungen'][number]> = {
  'Giveaways': 'werbeartikel', 'CAD-Konstruktion': 'cad', 'Automatisierung': 'beratung', 'IT-Service': 'beratung',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Nur POST erlaubt' });
  }
  // Browser dürfen das Formular nur von der eigenen Website absenden.
  // Anfragen ohne Origin bleiben für kompatible Server-Clients erlaubt.
  const requestOrigin = req.headers.origin;
  if (requestOrigin) {
    const host = String(req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].trim().toLowerCase();
    let originHost = '';
    try {
      const parsed = new URL(String(requestOrigin));
      if (parsed.protocol !== 'https:') return res.status(403).json({ error: 'Herkunft nicht erlaubt' });
      originHost = parsed.host.toLowerCase();
    } catch {
      return res.status(403).json({ error: 'Herkunft nicht erlaubt' });
    }
    if (!host || originHost !== host) return res.status(403).json({ error: 'Herkunft nicht erlaubt' });
  }
  const contentType = String(req.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
  if (contentType !== 'application/json') return res.status(415).json({ error: 'JSON erforderlich' });
  const contentLength = Number(req.headers['content-length'] || 0);
  if (contentLength > 24_000) return res.status(413).json({ error: 'Anfrage zu groß' });
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({ error: 'Ungültige Anfrage' });
  }
  const b = req.body as Record<string, unknown>;
  if (JSON.stringify(b).length > 24_000) return res.status(413).json({ error: 'Anfrage zu groß' });
  // WhatsApp wird nur im Browser geöffnet, niemals als zugestellte Anfrage verbucht.
  if (b.via !== 'email') return res.status(400).json({ error: 'Ungültiger Versandweg' });
  if (b.website) return res.status(200).json({ ok: true }); // Spamschutz

  const via = 'email';
  const name = clip(b.name, 120), email = clip(b.email, 200), phone = clip(b.phone, 60), company = clip(b.company, 160);
  const message = clip(b.message, 5000), text = clip(b.text, 6000), subject = clip(b.subject, 160) || 'Anfrage';
  const topics = (Array.isArray(b.topics) ? b.topics : []).map((t) => clip(t, 40)).slice(0, 7);
  const kundentyp = b.type === 'unternehmen' ? 'unternehmen' : 'privat';
  if (!name || message.length < 10) return res.status(400).json({ error: 'Pflichtfelder fehlen' });
  if (email && !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'E-Mail ungültig' });
  if (via === 'email' && !email) return res.status(400).json({ error: 'E-Mail fehlt' });

  if (!await inquiryGuard(req, res)) return;
  if (!hubspotAktiv()) return res.status(503).json({ error: 'Übertragung ist noch nicht eingerichtet' });
  try {
      const nachname = clip(b.nachname, 80) || name.split(/\s+/).slice(1).join(' ') || name;
      const result = await legeLeadAn({
        requestId: String(b.requestId), source: "kontakt",
        titel: `${topics[0] ?? 'Anfrage'} – ${kundentyp === 'unternehmen' && company ? company : nachname}`,
        name, vorname: clip(b.vorname, 80), nachname, email, telefon: phone, firma: company,
        strasse: clip(b.street, 200), plz: clip(b.zip, 20), ort: clip(b.city, 120),
        kundentyp,
        kanal: 'website',
        leistungen: topics.length ? topics.map((t) => LEISTUNG[t] ?? '3d_druck') : ['3d_druck'],
        stueckzahl: clip(b.quantity, 20),
        anforderungen: [topics.length ? `Thema: ${topics.join(', ')}` : '', b.quantity ? `Stückzahl: ${clip(b.quantity, 20)}` : '',
          b.deadline ? `Wunschtermin: ${clip(b.deadline, 80)}` : '',
          b.filament ? `Filament: ${clip(b.filament, 30)}` : '', b.farbe ? `Farbe: ${clip(b.farbe, 60)}` : ''].filter(Boolean).join(' | '),
        beschreibung: message.slice(0, 2000),
        volltext: text || message,
      });

  const key = process.env.RESEND_API_KEY;
  const from = process.env.ANFRAGE_ABSENDER || 'LayerForm <rechner@layer-form.de>';
  const to = process.env.ANFRAGE_EMPFAENGER || 'auftrag@layer-form.de';
  const resend = key ? new Resend(key) : null;
  // 3. Eingangsbestätigung an den Kunden (nur bei E-Mail; Fehler blockieren nichts)
  if (!result.duplicate && resend && process.env.ANFRAGE_BESTAETIGUNG !== 'aus') {
    const ctext = [
      `Hallo ${clip(b.vorname, 80) || name.split(' ')[0]},`, '',
      'vielen Dank für Ihre Anfrage bei LayerForm. Sie ist bei uns angekommen, wir melden uns in der Regel innerhalb eines Werktags mit Preis und Lieferzeit.', '',
      'Fotos, Skizzen oder Dateien (STL, STEP, 3MF) können Sie einfach als Antwort auf diese E-Mail schicken.', '',
      'Ihre Anfrage:', text || message, '',
      'Viele Grüße', 'Benjamin Ridel', 'LayerForm · www.layer-form.de · WhatsApp +49 176 85922649',
    ].join('\n');
    try {
      const confirmation = await resend.emails.send({
        from, to: email, replyTo: to, subject: `Re: ${subject}`, text: ctext,
        html: `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#111;max-width:560px;line-height:1.5;white-space:pre-wrap">${esc(ctext)}</div>`,
      });
      if (confirmation.error) throw new Error(confirmation.error.message);
    } catch (e) {
      console.error('Bestätigung fehlgeschlagen');
    }
  }

  return res.status(200).json({ ok: true, destination: 'hubspot', duplicate: result.duplicate });
  } catch (error) { return deliveryError(res, error); }
}
