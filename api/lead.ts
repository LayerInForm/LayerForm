import type { VercelRequest, VercelResponse } from '@vercel/node';
import { addLead, rateLimit } from './_lib/crm.js';

/** Öffentliches Anfrageformular der Website: legt die Anfrage zusätzlich in der Kundenübersicht an */
const clip = (s: unknown, n = 300) => String(s ?? '').trim().slice(0, n);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Nur POST erlaubt' });
  const b = (req.body ?? {}) as Record<string, unknown>;
  if (b.website) return res.status(200).json({ ok: true }); // Spamschutz
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unbekannt';
  try { if (!(await rateLimit(ip))) return res.status(429).json({ error: 'Zu viele Anfragen' }); } catch { /* weiter */ }

  const name = clip(b.name, 120);
  const message = clip(b.message, 4000);
  if (!name || message.length < 5) return res.status(400).json({ error: 'Angaben fehlen' });
  const street = clip(b.street, 200), zip = clip(b.zip, 20), city = clip(b.city, 120);
  const adresse = [street, [zip, city].filter(Boolean).join(' ')].filter(Boolean).join(', ');
  const topics = (Array.isArray(b.topics) ? b.topics : []).map((t) => clip(t, 40)).filter(Boolean).slice(0, 8);
  const extra = [
    b.quantity ? `Stückzahl: ${clip(b.quantity, 40)}` : '',
    b.deadline ? `Wunschtermin: ${clip(b.deadline, 60)}` : '',
    b.type === 'unternehmen' ? 'Kunde: Unternehmen' : 'Kunde: Privat',
    b.via ? `Gesendet per ${b.via === 'whatsapp' ? 'WhatsApp' : 'E-Mail'}` : '',
  ].filter(Boolean).join(' · ');
  try {
    const r = await addLead({
      name, email: clip(b.email, 200), telefon: clip(b.phone, 40), firma: clip(b.company, 120), adresse,
      kanal: 'Website', anliegen: topics.join(', ') || message.split('\n')[0].slice(0, 80),
      notiz: [message, extra].filter(Boolean).join('\n'), quelle: 'Anfrage über das Formular der Website',
    });
    return res.status(200).json({ ok: true, gespeichert: !!r });
  } catch (e) {
    console.error('lead', e);
    return res.status(200).json({ ok: true, gespeichert: false });
  }
}
