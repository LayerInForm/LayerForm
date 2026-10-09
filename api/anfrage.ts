import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

/**
 * Nimmt Anfragen aus dem Preisrechner entgegen und schickt sie als E-Mail an LayerForm.
 * Umgebungsvariablen:
 *   RESEND_API_KEY      API-Schlüssel von resend.com (Pflicht)
 *   ANFRAGE_EMPFAENGER  Empfänger, Standard: auftrag@layer-form.de
 *   ANFRAGE_ABSENDER    Absender, Standard: LayerForm <rechner@layer-form.de>
 *                       (die Domain muss bei Resend bestätigt sein)
 *   ANFRAGE_BESTAETIGUNG "aus" schaltet die automatische Eingangsbestätigung an den Kunden ab
 */
const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const clip = (s: unknown, n = 300) => String(s ?? '').trim().slice(0, n);

interface FileRef { name: string; url: string; size: number }
interface Plate { plate: number; items: { name: string; qty: number }[] }

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Nur POST erlaubt' });
  const key = process.env.RESEND_API_KEY;
  if (!key) return res.status(503).json({ error: 'E-Mail-Versand ist noch nicht eingerichtet' });

  const b = (req.body ?? {}) as Record<string, unknown>;
  if (b.website) return res.status(200).json({ ok: true }); // Spamschutz: verstecktes Feld ausgefüllt

  const name = clip(b.name, 120), email = clip(b.email, 200), street = clip(b.street, 200), zip = clip(b.zip, 20), city = clip(b.city, 120);
  const comment = clip(b.comment, 4000);
  if (!name || !street || !zip || !city || !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'Pflichtfelder fehlen' });

  const files = (Array.isArray(b.files) ? b.files : []).slice(0, 30)
    .filter((f: FileRef) => typeof f?.url === 'string' && /^https:\/\/[\w-]+\.public\.blob\.vercel-storage\.com\//.test(f.url)) as FileRef[];
  const plates = (Array.isArray(b.plates) ? b.plates : []).slice(0, 50) as Plate[];

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

  const row = (k: string, v: string) => `<tr><td style="padding:4px 16px 4px 0;color:#667;vertical-align:top">${k}</td><td style="padding:4px 0">${v}</td></tr>`;
  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#111;max-width:640px">
    <h2 style="margin:0 0 4px">Neue Anfrage über den Preisrechner</h2>
    <p style="margin:0 0 20px;color:#667">Richtpreis laut Rechner: <b style="color:#111">${esc(estimate)}</b></p>
    <h3 style="margin:16px 0 6px">Kunde</h3>
    <table>${row('Name', esc(name))}${row('E-Mail', `<a href="mailto:${esc(email)}">${esc(email)}</a>`)}${row('Adresse', `${esc(street)}<br>${esc(zip)} ${esc(city)}`)}</table>
    <h3 style="margin:16px 0 6px">Einstellungen</h3>
    <table>${row('Material', esc(material))}${row('Qualität', esc(quality))}${row('Infill', `${esc(infill)} %`)}</table>
    <h3 style="margin:16px 0 6px">Platten</h3>
    <table>${plates.map((p) => row(`Platte ${p.plate}`, p.items.map((i) => `${Number(i.qty) || 1} × ${esc(clip(i.name, 200))}`).join('<br>'))).join('')}</table>
    <h3 style="margin:16px 0 6px">Kommentar</h3>
    <p style="margin:0;white-space:pre-wrap">${esc(comment) || '–'}</p>
    <h3 style="margin:16px 0 6px">Dateien</h3>
    <ul style="margin:0;padding-left:18px">${files.map((f) => `<li><a href="${esc(f.url)}">${esc(f.name)}</a> (${mb(f.size)})</li>`).join('')}</ul>
  </div>`;

  // Kleine Dateien zusätzlich direkt anhängen (gesamt bis ca. 20 MB), große bleiben als Download-Link in der Mail
  let total = 0;
  const attachments = files.filter((f) => (total += f.size) <= 20 * 1024 * 1024).map((f) => ({ filename: f.name, path: f.url }));

  try {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      from: process.env.ANFRAGE_ABSENDER || 'LayerForm <rechner@layer-form.de>',
      to: process.env.ANFRAGE_EMPFAENGER || 'auftrag@layer-form.de',
      replyTo: email,
      subject: `Druckanfrage von ${name} (${material}, Richtpreis ${estimate})`,
      text,
      html,
      attachments,
    });
    if (error) throw new Error(error.message);

    // Eingangsbestätigung an den Kunden (Fehler hier blockieren die Anfrage nicht)
    if (process.env.ANFRAGE_BESTAETIGUNG !== 'aus') {
      const teile = plates.flatMap((p) => p.items).map((i) => `${Number(i.qty) || 1} × ${clip(i.name, 200)}`);
      const ctext = [
        `Hallo ${name},`, '',
        'vielen Dank für Ihre Anfrage bei LayerForm. Sie ist bei uns angekommen.', '',
        'Ihre Angaben:',
        `Material: ${material}`, `Qualität: ${quality}`, `Infill: ${infill} %`,
        `Teile: ${teile.join(', ') || '–'}`,
        `Richtpreis: ${estimate} (unverbindlich)`, '',
        'Wir prüfen Ihre Dateien und schicken Ihnen den finalen Preis inklusive Versand per E-Mail.',
        'Bei Fragen antworten Sie einfach auf diese Nachricht oder schreiben uns per WhatsApp: +49 176 85922649', '',
        'Viele Grüße',
        'LayerForm',
        'www.layer-form.de',
      ].join('\n');
      const chtml = `
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#111;max-width:560px;line-height:1.5">
        <p>Hallo ${esc(name)},</p>
        <p>vielen Dank für Ihre Anfrage bei LayerForm. Sie ist bei uns angekommen.</p>
        <table style="margin:12px 0">${row('Material', esc(material))}${row('Qualität', esc(quality))}${row('Infill', `${esc(infill)} %`)}${row('Teile', teile.map(esc).join('<br>') || '–')}${row('Richtpreis', `${esc(estimate)} <span style="color:#667">(unverbindlich)</span>`)}</table>
        <p>Wir prüfen Ihre Dateien und schicken Ihnen den finalen Preis inklusive Versand per E-Mail.</p>
        <p>Bei Fragen antworten Sie einfach auf diese Nachricht oder schreiben uns per WhatsApp: <a href="https://wa.me/4917685922649">+49 176 85922649</a></p>
        <p>Viele Grüße<br>LayerForm<br><a href="https://www.layer-form.de">www.layer-form.de</a></p>
      </div>`;
      try {
        await resend.emails.send({
          from: process.env.ANFRAGE_ABSENDER || 'LayerForm <rechner@layer-form.de>',
          to: email,
          replyTo: process.env.ANFRAGE_EMPFAENGER || 'auftrag@layer-form.de',
          subject: 'Ihre Anfrage bei LayerForm',
          text: ctext,
          html: chtml,
        });
      } catch (e) {
        console.error('Bestätigung fehlgeschlagen', e);
      }
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Versand fehlgeschlagen', e);
    return res.status(502).json({ error: 'Versand fehlgeschlagen' });
  }
}
