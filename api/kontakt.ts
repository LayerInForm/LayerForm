import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { hubspotAktiv, legeLeadAn, type Lead } from './_lib/hubspot.js';

/**
 * Anfrageformular → direkt als Karte in HubSpot („LayerForm Aufträge“ → „Neue Anfrage“).
 * Fällt HubSpot aus, geht die Anfrage als Ersatz per E-Mail an auftrag@layer-form.de (dort greift der Workspace-Flow).
 * Umgebungsvariablen: HUBSPOT_TOKEN, RESEND_API_KEY, ANFRAGE_EMPFAENGER, ANFRAGE_ABSENDER, ANFRAGE_BESTAETIGUNG
 */
const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const clip = (s: unknown, n = 300) => String(s ?? '').trim().slice(0, n);

const LEISTUNG: Record<string, Lead['leistungen'][number]> = {
  'Giveaways': 'werbeartikel', 'CAD-Konstruktion': 'cad',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Nur POST erlaubt' });
  const b = (req.body ?? {}) as Record<string, unknown>;
  if (b.website) return res.status(200).json({ ok: true }); // Spamschutz

  const via = b.via === 'whatsapp' ? 'whatsapp' : 'email';
  const name = clip(b.name, 120), email = clip(b.email, 200), phone = clip(b.phone, 60), company = clip(b.company, 160);
  const message = clip(b.message, 5000), text = clip(b.text, 6000), subject = clip(b.subject, 160) || 'Anfrage';
  const topics = (Array.isArray(b.topics) ? b.topics : []).map((t) => clip(t, 40)).slice(0, 7);
  const kundentyp = b.type === 'unternehmen' ? 'unternehmen' : 'privat';
  if (!name || message.length < 10) return res.status(400).json({ error: 'Pflichtfelder fehlen' });
  if (email && !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'E-Mail ungültig' });
  if (via === 'email' && !email) return res.status(400).json({ error: 'E-Mail fehlt' });

  // 1. Direkt in HubSpot
  let inHubspot = false;
  if (hubspotAktiv()) {
    try {
      const nachname = name.split(/\s+/).slice(1).join(' ') || name;
      await legeLeadAn({
        titel: `${topics[0] ?? 'Anfrage'} – ${kundentyp === 'unternehmen' && company ? company : nachname}`,
        name, email, telefon: phone, firma: company,
        strasse: clip(b.street, 200), plz: clip(b.zip, 20), ort: clip(b.city, 120),
        kundentyp,
        kanal: via === 'whatsapp' ? 'whatsapp' : 'website',
        leistungen: topics.length ? topics.map((t) => LEISTUNG[t] ?? '3d_druck') : ['3d_druck'],
        stueckzahl: clip(b.quantity, 20),
        anforderungen: [topics.length ? `Thema: ${topics.join(', ')}` : '', b.quantity ? `Stückzahl: ${clip(b.quantity, 20)}` : '',
          b.deadline ? `Wunschtermin: ${clip(b.deadline, 80)}` : '', via === 'whatsapp' ? 'Kunde hat WhatsApp gewählt' : ''].filter(Boolean).join(' | '),
        beschreibung: message.slice(0, 2000),
        volltext: text || message,
      });
      inHubspot = true;
    } catch (e) {
      console.error('HubSpot fehlgeschlagen – Ersatz per E-Mail', e);
    }
  }

  const key = process.env.RESEND_API_KEY;
  const from = process.env.ANFRAGE_ABSENDER || 'LayerForm <rechner@layer-form.de>';
  const to = process.env.ANFRAGE_EMPFAENGER || 'auftrag@layer-form.de';
  const resend = key ? new Resend(key) : null;

  // 2. Ersatzweg, falls HubSpot nicht erreichbar war
  if (!inHubspot) {
    if (!resend) return res.status(503).json({ error: 'Übertragung ist noch nicht eingerichtet' });
    try {
      const body = `${text || message}\n\n—\nGesendet über das Anfrageformular auf layer-form.de${via === 'whatsapp' ? ' (Kunde hat WhatsApp gewählt)' : ''}.`;
      const { error } = await resend.emails.send({
        from, to, ...(email ? { replyTo: email } : {}),
        subject: via === 'whatsapp' ? `${subject} (per WhatsApp)` : subject,
        text: body,
        html: `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#111;max-width:640px;white-space:pre-wrap">${esc(body)}</div>`,
      });
      if (error) throw new Error(error.message);
    } catch (e) {
      console.error('Versand fehlgeschlagen', e);
      return res.status(502).json({ error: 'Versand fehlgeschlagen' });
    }
  }

  // 3. Eingangsbestätigung an den Kunden (nur bei E-Mail; Fehler blockieren nichts)
  if (resend && via === 'email' && process.env.ANFRAGE_BESTAETIGUNG !== 'aus') {
    const ctext = [
      `Hallo ${name.split(' ')[0]},`, '',
      'vielen Dank für Ihre Anfrage bei LayerForm. Sie ist bei uns angekommen, wir melden uns in der Regel innerhalb eines Werktags mit Preis und Lieferzeit.', '',
      'Fotos, Skizzen oder Dateien (STL, STEP, 3MF) können Sie einfach als Antwort auf diese E-Mail schicken.', '',
      'Ihre Anfrage:', text || message, '',
      'Viele Grüße', 'Benjamin Ridel', 'LayerForm · www.layer-form.de · WhatsApp +49 176 85922649',
    ].join('\n');
    try {
      await resend.emails.send({
        from, to: email, replyTo: to, subject: `Re: ${subject}`, text: ctext,
        html: `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#111;max-width:560px;line-height:1.5;white-space:pre-wrap">${esc(ctext)}</div>`,
      });
    } catch (e) {
      console.error('Bestätigung fehlgeschlagen', e);
    }
  }
  return res.status(200).json({ ok: true });
}
