import { dealTitel } from './deal-title.js';
import { deliverOnce, hash } from './inquiries.js';
/**
 * Direkte HubSpot-Anbindung der Website.
 * Legt Kontakt + Deal in der Pipeline „LayerForm Aufträge“ → „Neue Anfrage“ an,
 * hängt eine Notiz mit allen Angaben und die hochgeladenen Dateien an.
 * Umgebungsvariable: HUBSPOT_TOKEN (HubSpot-Service-Schlüssel mit Kontakten, Deals, Dateien)
 */
const API = 'https://api.hubapi.com';
const PIPELINE = 'default';
const STAGE_NEU = '6212936899';
const OWNER_ID = '100897636';
const PORTAL_ID = '149524579';

export const hubspotAktiv = () => Boolean(process.env.HUBSPOT_TOKEN);

async function hs(method: string, path: string, body?: unknown) {
  const res = await fetch(API + path, {
    method,
    headers: { Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(15000),
  });
  const text = await res.text();
  if (!res.ok) throw Object.assign(new Error(`HubSpot ${res.status}`), { status: res.status });
  return text ? JSON.parse(text) : {};
}

const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

async function sucheKontakt(email?: string): Promise<string | null> {
  if (!email) throw new Error('Email required');
  try {
    const contact = await hs('GET', '/crm/v3/objects/contacts/' + encodeURIComponent(email.trim().toLowerCase()) + '?idProperty=email');
    return contact.id;
  } catch (error) {
    if ((error as { status?: number }).status === 404) return null;
    throw error;
  }
}

async function anzahlDeals(kontaktId: string): Promise<number> {
  const r = await hs('POST', '/crm/v3/objects/deals/search', {
    filterGroups: [{ filters: [{ propertyName: 'associations.contact', operator: 'EQ', value: kontaktId }] }], limit: 1, properties: ['dealname'],
  });
  return r.total || 0;
}

async function ladeDateiHoch(url: string, name: string): Promise<string | null> {
  try {
    const quelle = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(15000) });
    if (!quelle.ok) return null;
    const form = new FormData();
    form.append('file', new Blob([await quelle.arrayBuffer()]), name);
    form.append('folderPath', '/LayerForm Anfragen');
    form.append('options', JSON.stringify({ access: 'PRIVATE', overwrite: false, duplicateValidationStrategy: 'NONE' }));
    const res = await fetch(`${API}/files/v3/files`, { method: 'POST', headers: { Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}` }, body: form, signal: AbortSignal.timeout(15000) });
    if (!res.ok) { console.warn('Upload', res.status); return null; }
    return (await res.json()).id;
  } catch (e) {
    console.warn('Upload-Fehler');
    return null;
  }
}

export interface Lead {
  requestId: string;
  source: "kontakt" | "anfrage";
  titel: string;
  name: string;
  email?: string;
  telefon?: string;
  firma?: string;
  strasse?: string; plz?: string; ort?: string;
  kundentyp: 'privat' | 'unternehmen';
  kanal: 'website' | 'whatsapp';
  leistungen: ('3d_druck' | 'cad' | 'werbeartikel' | 'beratung')[];
  material?: string;            // HubSpot-Werte, mit ; getrennt
  vorname?: string;
  nachname?: string;
  stueckzahl?: string;
  anforderungen?: string;
  beschreibung: string;         // Kurzbeschreibung für die Karte
  volltext: string;             // komplette Anfrage für die Notiz
  dateien?: { name: string; url: string }[];
}

const LINK = /https?:\/\/[^\s<>"')\]]+/gi;

export async function legeLeadAn(l: Lead) {
  // Server-normalized content binds the ID; a genuinely new inquiry gets a new UUID.
  return deliverOnce(l.source + ':' + l.requestId, hash(JSON.stringify(l)), async (beforeWrite) => {

    const [vn, ...rn] = l.name.trim().split(/\s+/);
    const vorname = l.vorname?.trim() || vn;
    const rest = l.nachname?.trim() ? [l.nachname.trim()] : rn;
    let kontaktId = await sucheKontakt(l.email);
    if (!kontaktId) {
      const props: Record<string, string> = {
        firstname: vorname || '', lastname: rest.join(' '), email: (l.email || '').toLowerCase(), phone: l.telefon || '',
        company: l.firma || '', address: l.strasse || '', zip: l.plz || '', city: l.ort || '', hubspot_owner_id: OWNER_ID,
      };
      Object.keys(props).forEach((k) => { if (!props[k]) delete props[k]; });
      try {
        kontaktId = (await hs('POST', '/crm/v3/objects/contacts', { properties: props })).id as string;
      } catch (error) {
        if ((error as { status?: number }).status !== 409) throw error;
        kontaktId = await sucheKontakt(l.email);
        if (!kontaktId) throw error;
      }
    }
    const frueher = await anzahlDeals(kontaktId);

    const dateien = (l.dateien || []).slice(0, 20);
    const ids = (await Promise.all(dateien.map((d) => ladeDateiHoch(d.url, d.name)))).filter(Boolean) as string[];
    const links = Array.from(new Set(l.volltext.match(LINK) || [])).filter((u) => !/layer-form\.de|vercel-storage\.com/i.test(u));

    const props: Record<string, string> = {
      dealname: dealTitel(l.source, l.titel, l.material),
      pipeline: PIPELINE,
      dealstage: STAGE_NEU,
      hubspot_owner_id: OWNER_ID,
      description: `Website-Anfrage-ID: ${l.requestId}\n` + (frueher ? `STAMMKUNDE – bisher ${frueher} Auftrag/Anfrage(n).\n` : '') + l.volltext + '\n' + dateien.map(d => d.name + ': ' + d.url).join('\n'),
      lf_kanal: l.kanal,
      lf_kundentyp: l.kundentyp,
      lf_leistung: Array.from(new Set(l.leistungen)).join(';'),
      lf_material: l.material || 'offen',
      lf_stueckzahl: (l.stueckzahl || '').replace(/\D/g, ''),
      lf_anforderungen: l.anforderungen || '',
      lf_links: links.join('\n'),
      lf_anhaenge: dateien.map((d) => d.name).join('\n'),
      lf_stammkunde: frueher ? 'true' : 'false',
    };
    Object.keys(props).forEach((k) => { if (!props[k]) delete props[k]; });

    await beforeWrite();
    const deal = await hs('POST', '/crm/v3/objects/deals', {
      properties: props,
      associations: [{ to: { id: kontaktId }, types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 3 }] }],
  });

  const notiz: Record<string, string> = {
    hs_timestamp: new Date().toISOString(),
    hs_note_body: `<b>Anfrage über layer-form.de</b><br><br>${esc(l.volltext).replace(/\n/g, '<br>')}` +
      (dateien.length && ids.length < dateien.length ? `<br><br>⚠️ ${dateien.length - ids.length} Datei(en) konnten nicht übernommen werden.` : ''),
    hubspot_owner_id: OWNER_ID,
  };
  if (ids.length) notiz.hs_attachment_ids = ids.join(';');
  try {
    await hs('POST', '/crm/v3/objects/notes', {
    properties: notiz,
    associations: [
      { to: { id: deal.id }, types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 214 }] },
      { to: { id: kontaktId }, types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 202 }] },
    ],
    });
  } catch (e) {
    // Deal ist bereits angelegt! Kein erneuter Versand / Zweitanlage auslösen.
    console.error('HubSpot-Notiz fehlgeschlagen; Anfrage vollständig in Deal gespeichert', deal.id);
  }

  return { dealId: deal.id, url: `https://app-eu1.hubspot.com/contacts/${PORTAL_ID}/record/0-3/${deal.id}` };
  });
}

/** HubSpot-Materialwerte aus einem Freitext (z. B. "PETG HF") */
export function materialWert(text?: string): string {
  const t = String(text || '').toLowerCase();
  const m = ['pla', 'petg', 'asa', 'abs', 'tpu'].filter((x) => new RegExp(`\\b${x}`).test(t));
  return m.join(';') || 'offen';
}
