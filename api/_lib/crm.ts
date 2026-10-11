import { db } from './intern.js';

/**
 * Schreibt neue Anfragen direkt in die Kundenübersicht (layer-form.de/intern).
 * Bekannte Kunden (gleiche E-Mail oder Telefonnummer) werden ergänzt statt doppelt angelegt.
 * Ist der letzte Auftrag eines Kunden schon abgeschlossen, entsteht eine neue Karte für den neuen Auftrag.
 */
export interface Lead {
  name?: string; email?: string; telefon?: string; firma?: string; adresse?: string;
  kanal: string; anliegen?: string; betrag?: number | null; notiz?: string;
  dateien?: { name: string; url: string }[];
  quelle: string; // kurzer Text für den Verlauf, z. B. „Anfrage über den Preisrechner“
}
type Doc = Record<string, unknown> & { email?: string; telefon?: string; status?: string; verlauf?: string[]; dateien?: { name: string; url: string }[] };
const DONE = new Set(['abgeschlossen', 'abgesagt']);
const digits = (t?: string) => String(t || '').replace(/\D/g, '').slice(-9);
const today = () => new Date().toLocaleDateString('de-DE', { timeZone: 'Europe/Berlin' });

export async function addLead(l: Lead): Promise<'neu' | 'aktualisiert' | null> {
  const r = db();
  if (!r) return null;
  const now = new Date().toISOString();
  const ids = (await r.smembers('lf:col:kunden')) as string[];
  const docs = ids.length ? await r.mget<(Doc | null)[]>(...ids.map((id) => `lf:doc:kunden/${id}`)) : [];
  const email = String(l.email || '').trim().toLowerCase();
  const tel = digits(l.telefon);
  let matchIdx = -1;
  docs.forEach((d, i) => {
    if (!d || DONE.has(String(d.status))) return;
    if ((email && String(d.email || '').toLowerCase() === email) || (tel.length >= 6 && digits(d.telefon as string) === tel)) matchIdx = i;
  });
  const line = `${today()}: ${l.quelle}`;
  if (matchIdx >= 0) {
    const d = docs[matchIdx]!;
    const patch: Doc = {
      ...d, neu: true, letzteAktivitaet: now,
      verlauf: [...(d.verlauf || []), line].slice(-20),
      dateien: [...(d.dateien || []), ...(l.dateien || [])].slice(-30),
    };
    for (const k of ['name', 'email', 'telefon', 'firma', 'adresse', 'anliegen'] as const) if (!d[k] && l[k]) patch[k] = l[k];
    if (l.notiz) patch.notiz = [d.notiz, `${today()}: ${l.notiz}`].filter(Boolean).join('\n\n').slice(-4000);
    if (typeof l.betrag === 'number' && !d.betrag) patch.betrag = l.betrag;
    await r.set(`lf:doc:kunden/${ids[matchIdx]}`, patch);
    return 'aktualisiert';
  }
  const id = 'k' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const doc: Doc = {
    name: l.name || '', email: l.email || '', telefon: l.telefon || '', firma: l.firma || '', adresse: l.adresse || '',
    kanal: l.kanal, anliegen: (l.anliegen || '').slice(0, 80), status: 'austausch', statusSeit: now,
    betrag: typeof l.betrag === 'number' ? l.betrag : null, rechnungsnr: '',
    notiz: (l.notiz || '').slice(0, 4000), dateien: (l.dateien || []).slice(0, 30),
    letzteAktivitaet: now, gmailUrl: '', verlauf: [line], neu: true,
  };
  await r.set(`lf:doc:kunden/${id}`, doc);
  await r.sadd('lf:col:kunden', id);
  return 'neu';
}

/** Einfache Bremse gegen Missbrauch öffentlicher Formulare: höchstens n Anfragen pro Stunde und IP */
export async function rateLimit(ip: string, n = 15): Promise<boolean> {
  const r = db(); if (!r) return true;
  const key = `lf:rl:${ip}`;
  const c = await r.incr(key);
  if (c === 1) await r.expire(key, 3600);
  return c <= n;
}
