import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { inquiryGuard, deliveryError } from './_lib/inquiries.js';
import { hubspotAktiv, legeLeadAn, materialWert } from './_lib/hubspot.js';

/**
 * Preisrechner → ausschließlich HubSpot. Resend bestätigt nur dem Kunden.
 * Umgebungsvariablen:
 *   RESEND_API_KEY      API-Schlüssel von resend.com (optional)
 *   ANFRAGE_EMPFAENGER  Antwortadresse für Kundenbestätigungen, Standard: auftrag@layer-form.de
 *   ANFRAGE_ABSENDER    Absender, Standard: LayerForm <rechner@layer-form.de>
 *                       (die Domain muss bei Resend bestätigt sein)
 *   ANFRAGE_BESTAETIGUNG "aus" schaltet die automatische Eingangsbestätigung an den Kunden ab
 */
const clip = (s: unknown, n = 300) => String(s ?? '').trim().slice(0, n);

interface FileRef { name: string; url: string; size: number }
interface Plate { plate: number; items: { name: string; qty: number }[] }

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Nur POST erlaubt' });
  if (!await inquiryGuard(req, res)) return;
  const key = process.env.RESEND_API_KEY;

  const b = (req.body ?? {}) as Record<string, unknown>;
  if (b.website) return res.status(200).json({ ok: true }); // Spamschutz: verstecktes Feld ausgefüllt

  const name = clip(b.name, 120), email = clip(b.email, 200), street = clip(b.street, 200), zip = clip(b.zip, 20), city = clip(b.city, 120);
  const comment = clip(b.comment, 4000);
  if (!name || !street || !zip || !city || !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'Pflichtfelder fehlen' });

  const files = (Array.isArray(b.files) ? b.files : []).slice(0, 30)
    .filter((f: FileRef) => typeof f?.url === 'string' && /^https:\/\/[\w-]+\.public\.blob\.vercel-storage\.com\//.test(f.url)).map((f) => ({ name: clip(f.name, 200), url: clip(f.url, 2000), size: Math.max(0, Number(f.size) || 0) }));
  const plates: Plate[] = (Array.isArray(b.plates) ? b.plates : []).slice(0, 50).map((p) => ({
    plate: Number(p?.plate) || 1,
    items: (Array.isArray(p?.items) ? p.items : []).slice(0, 100).map((i: Record<string, unknown>) => ({ name: clip(i?.name, 200), qty: Math.max(1, Math.min(100000, Number(i?.qty) || 1)) })),
  }));

  const material = clip(b.material, 40), quality = clip(b.quality, 60), infill = clip(b.infill, 10), estimate = clip(b.estimate, 60);
  const mb = (n: number) => `${(n / 1024 / 1024).toFixed(1).replace('.', ',')} MB`;

  const platesText = plates.map((p) => `Platte ${p.plate}: ${p.items.map((i) => `${Number(i.qty) || 1} × ${clip(i.name, 200)}`).join(', ')}`).join('\n');
  const text = [
    `Neue Anfrage über den Preisrechner`, '',
    `KUNDE`, name, email, street, `${zip} ${city}`, '',
    `EINSTELLUNGEN`, `Material: ${material}`, `Qualität: ${quality}`, `Infill: ${infill} %`, '',
    `PLATTEN`, platesText || '–', '',
    `Richtpreis laut Rechner: ${estimate}`, '',
    `KOMMENTAR`, comment || '–', '',
    `DATEIEN`, ...files.map((f) => `${f.name} (${mb(f.size)}): ${f.url}`),
  ].join('\n');

  if (text.length + files.reduce((n, f) => n + f.url.length + f.name.length, 0) > 50000) return res.status(413).json({ error: 'Zu viele Angaben. Bitte teilen Sie die Anfrage auf.' });

  // 1. Direkt in HubSpot (mit allen Dateien)
  if (!hubspotAktiv()) return res.status(503).json({ error: 'Übertragung ist noch nicht eingerichtet' });
  let duplicate = false;
  try {
      const nachname = name.split(/\s+/).slice(1).join(' ') || name;
      const stueck = plates.flatMap((p) => p.items).reduce((n, i) => n + (Number(i.qty) || 1), 0);
      const result = await legeLeadAn({
        requestId: String(b.requestId), source: "anfrage",
        titel: `Preisrechner ${material} – ${nachname}`,
        name, email, strasse: street, plz: zip, ort: city,
        kundentyp: 'privat', kanal: 'website', leistungen: ['3d_druck'],
        material: materialWert(material), stueckzahl: stueck ? String(stueck) : '',
        anforderungen: [`Material: ${material}`, `Qualität: ${quality}`, `Infill: ${infill} %`, `Richtpreis Rechner: ${estimate}`].join(' | '),
        beschreibung: `Anfrage über den Preisrechner. ${platesText.replace(/\n/g, '; ')}${comment ? ` – Kommentar: ${comment.slice(0, 800)}` : ''}`,
        volltext: text,
        dateien: files.map((f) => ({ name: f.name, url: f.url })),
      });
      duplicate = result.duplicate;
  } catch (error) { return deliveryError(res, error); }
  if (!key || duplicate) return res.status(200).json({ ok: true, destination: 'hubspot', duplicate });
  try {
    const resend = new Resend(key);
    // Eingangsbestätigung an den Kunden (Fehler hier blockieren die Anfrage nicht)
    if (process.env.ANFRAGE_BESTAETIGUNG !== 'aus') {
      const ctext = 'Vielen Dank für Ihre Anfrage. Hiermit bestätigen wir den Eingang Ihrer Anfrage.';
      const chtml = '<p>Vielen Dank für Ihre Anfrage. Hiermit bestätigen wir den Eingang Ihrer Anfrage.</p>';
      try {
        const confirmation = await resend.emails.send({
          from: process.env.ANFRAGE_ABSENDER || 'LayerForm <rechner@layer-form.de>',
          to: email,
          replyTo: process.env.ANFRAGE_EMPFAENGER || 'auftrag@layer-form.de',
          subject: 'Bestätigung Ihrer Anfrage',
          text: ctext,
          html: chtml,
        });
        if (confirmation.error) console.error('Bestätigung fehlgeschlagen');
      } catch (e) {
        console.error('Bestätigung fehlgeschlagen');
      }
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Bestätigung fehlgeschlagen');
    return res.status(200).json({ ok: true, destination: 'hubspot' });
  }
}
