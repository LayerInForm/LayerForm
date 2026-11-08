import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { Redis } from '@upstash/redis';
import { createHash } from 'node:crypto';
import { hubspotAktiv, legeLeadAn, type Lead } from './_lib/hubspot.js';

/**
 * Anfrageformular → direkt als Karte in HubSpot („LayerForm Aufträge“ → „Neue Anfrage“).
 * Fällt HubSpot aus, geht die Anfrage als Ersatz per E-Mail an auftrag@layer-form.de (dort greift der Workspace-Flow).
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

  const via = b.via === 'whatsapp' ? 'whatsapp' : 'email';
  const name = clip(b.name, 120), email = clip(b.email, 200), phone = clip(b.phone, 60), company = clip(b.company, 160);
  const message = clip(b.message, 5000), text = clip(b.text, 6000), subject = clip(b.subject, 160) || 'Anfrage';
  const topics = (Array.isArray(b.topics) ? b.topics : []).map((t) => clip(t, 40)).slice(0, 7);
  const kundentyp = b.type === 'unternehmen' ? 'unternehmen' : 'privat';
  if (!name || message.length < 10) return res.status(400).json({ error: 'Pflichtfelder fehlen' });
  if (email && !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'E-Mail ungültig' });
  if (via === 'email' && !email) return res.status(400).json({ error: 'E-Mail fehlt' });

  // Duplikatsicherung vor jeder externen Schreiboperation: identische Anfragen
  // innerhalb einer Stunde nur einmal bearbeiten (auch bei mehreren Serverinstanzen).
  const redisUrl = process.env.KV_REST_API_URL;
  const redisToken = process.env.KV_REST_API_TOKEN;
  if (!redisUrl || !redisToken) {
    console.error('Anfrage: Redis-Duplikatsicherung nicht konfiguriert');
    return res.status(503).json({ error: 'Anfrage momentan nicht verfügbar. Bitte schreiben Sie an auftrag@layer-form.de.' });
  }
  const redis = new Redis({ url: redisUrl, token: redisToken });

  // IP-basierte Begrenzung gegen automatisierte Massenanfragen.
  // Keine Kundendaten in Redis-Schlüsseln speichern; nur einen Hash der IP.
  const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').split(',')[0].trim();
  const rateKey = 'lf:anfrage:rate:v1:' + createHash('sha256').update(ip).digest('hex');
  try {
    const attempts = await redis.incr(rateKey);
    if (attempts === 1) await redis.expire(rateKey, 900);
    if (attempts > 20) {
      res.setHeader('Retry-After', '900');
      return res.status(429).json({ error: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut oder schreiben Sie an auftrag@layer-form.de.' });
    }
  } catch (error) {
    // Redis-Ausfall wird anschließend durch die zwingende Duplikatsicherung behandelt.
    console.error('Anfrage: Ratenbegrenzung fehlgeschlagen', error);
  }

  const signature = JSON.stringify({
    name: name.toLowerCase(), email: email.toLowerCase(), phone: phone.replace(/\s+/g, ''),
    message: message.trim(), type: kundentyp, company: company.toLowerCase(),
    quantity: clip(b.quantity, 20), topics, via,
  });
  const dedupeKey = 'lf:anfrage:v2:' + createHash('sha256').update(signature).digest('hex');
  try {
    const existing = await redis.get<string>(dedupeKey);
    if (existing === 'sent') return res.status(200).json({ ok: true, duplicate: true });
    if (existing) return res.status(409).json({ error: 'Diese Anfrage wird bereits verarbeitet. Bitte einen Moment warten.' });
    const acquired = await redis.set(dedupeKey, 'processing', { nx: true, ex: 120 });
    if (acquired !== 'OK') return res.status(409).json({ error: 'Diese Anfrage wird bereits verarbeitet. Bitte einen Moment warten.' });
  } catch (e) {
    console.error('Redis-Duplikatsicherung fehlgeschlagen', e);
    return res.status(503).json({ error: 'Anfrage momentan nicht verfügbar. Bitte schreiben Sie an auftrag@layer-form.de.' });
  }

  let delivered = false;
  try {
  // 1. Direkt in HubSpot
  let inHubspot = false;
  if (hubspotAktiv()) {
    try {
      const nachname = clip(b.nachname, 80) || name.split(/\s+/).slice(1).join(' ') || name;
      await legeLeadAn({
        titel: `${topics[0] ?? 'Anfrage'} – ${kundentyp === 'unternehmen' && company ? company : nachname}`,
        name, vorname: clip(b.vorname, 80), nachname, email, telefon: phone, firma: company,
        strasse: clip(b.street, 200), plz: clip(b.zip, 20), ort: clip(b.city, 120),
        kundentyp,
        kanal: via === 'whatsapp' ? 'whatsapp' : 'website',
        leistungen: topics.length ? topics.map((t) => LEISTUNG[t] ?? '3d_druck') : ['3d_druck'],
        stueckzahl: clip(b.quantity, 20),
        anforderungen: [topics.length ? `Thema: ${topics.join(', ')}` : '', b.quantity ? `Stückzahl: ${clip(b.quantity, 20)}` : '',
          b.deadline ? `Wunschtermin: ${clip(b.deadline, 80)}` : '',
          b.filament ? `Filament: ${clip(b.filament, 30)}` : '', b.farbe ? `Farbe: ${clip(b.farbe, 60)}` : '', via === 'whatsapp' ? 'Kunde hat WhatsApp gewählt' : ''].filter(Boolean).join(' | '),
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
    if (!resend) throw new Error('Weder HubSpot noch E-Mail-Versand verfügbar');
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
      throw new Error('Ersatzversand fehlgeschlagen');
    }
  }

  delivered = true;
  // 3. Eingangsbestätigung an den Kunden (nur bei E-Mail; Fehler blockieren nichts)
  if (resend && via === 'email' && process.env.ANFRAGE_BESTAETIGUNG !== 'aus') {
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
      console.error('Bestätigung fehlgeschlagen', e);
    }
  }
  await redis.set(dedupeKey, 'sent', { ex: 3600 }).catch((e) => console.error('Anfrage-Status konnte nicht gespeichert werden', e));
  return res.status(200).json({ ok: true, destination: inHubspot ? 'hubspot' : 'email' });
  } catch (e) {
    console.error('Anfrage nicht zustellbar', e);
    if (!delivered) await redis.del(dedupeKey).catch(() => {});
    return res.status(502).json({ error: 'Die Anfrage konnte nicht zugestellt werden. Bitte schreiben Sie direkt an auftrag@layer-form.de.' });
  }
}
