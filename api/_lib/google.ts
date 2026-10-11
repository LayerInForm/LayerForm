import { db } from './intern.js';

/** Zugriff auf Gmail (nur lesen) mit dem bei der Verbindung gespeicherten Refresh-Token. */
export class GmailError extends Error { constructor(public code: string, msg: string) { super(msg); } }
const REFRESH_KEY = 'lf:google:refresh';
const ACCESS_KEY = 'lf:google:access';

export const googleConfigured = () => !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
export async function saveRefreshToken(t: string) { await db()!.set(REFRESH_KEY, t); await db()!.del(ACCESS_KEY); }
let memToken: { t: string; exp: number } | null = null; // Zwischenspeicher, wenn keine Datenbank eingerichtet ist

async function accessToken(): Promise<string> {
  if (!googleConfigured()) throw new GmailError('not_configured', 'Google-Zugangsdaten fehlen');
  const r = db(); // optional: ohne Datenbank kommt der Refresh-Token aus GOOGLE_REFRESH_TOKEN
  if (!r && memToken && memToken.exp > Date.now()) return memToken.t;
  const cached = r ? await r.get<string>(ACCESS_KEY) : null; if (cached) return cached;
  const refresh = process.env.GOOGLE_REFRESH_TOKEN || (r ? await r.get<string>(REFRESH_KEY) : null);
  if (!refresh) throw new GmailError('google_not_connected', 'Gmail nicht verbunden');
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: process.env.GOOGLE_CLIENT_ID!, client_secret: process.env.GOOGLE_CLIENT_SECRET!, refresh_token: refresh, grant_type: 'refresh_token' }),
  });
  const j = await res.json() as { access_token?: string; expires_in?: number; error?: string; error_description?: string };
  if (!res.ok || !j.access_token) {
    console.error('google token', res.status, j);
    throw new GmailError(j.error === 'invalid_grant' ? 'needs_reauth' : 'google_auth_error', `Google-Anmeldung fehlgeschlagen: ${j.error || res.status}${j.error_description ? ' – ' + j.error_description : ''}`);
  }
  const ttl = Math.max(60, (j.expires_in || 3600) - 120);
  if (r) await r.set(ACCESS_KEY, j.access_token, { ex: ttl }); else memToken = { t: j.access_token, exp: Date.now() + ttl * 1000 };
  return j.access_token;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
async function g<T>(path: string, attempt = 0): Promise<T> {
  const res = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/${path}`, { headers: { Authorization: `Bearer ${await accessToken()}` } });
  if (res.status === 401) { memToken = null; await db()?.del(ACCESS_KEY); throw new GmailError('needs_reauth', 'Zugriff abgelaufen'); }
  if (res.status === 429 || res.status === 403) {
    const body = await res.clone().text();
    if (res.status === 429 || /quota|rate ?limit/i.test(body)) {
      // Google-Kontingent pro Minute erreicht: kurz warten und erneut versuchen
      if (attempt < 3) { await sleep(2000 * (attempt + 1)); return g<T>(path, attempt + 1); }
      throw new GmailError('rate_limited', 'Google-Kontingent kurzzeitig erschöpft');
    }
  }
  if (!res.ok) {
    let detail = '';
    try { const e = await res.json() as { error?: { message?: string; status?: string } }; detail = e.error?.message || e.error?.status || ''; } catch {}
    console.error('gmail api', res.status, detail);
    throw new GmailError('upstream_error', `Gmail meldet Fehler ${res.status}${detail ? ': ' + detail.slice(0, 220) : ''}`);
  }
  return res.json() as Promise<T>;
}

type Header = { name: string; value: string };
type Part = { mimeType?: string; filename?: string; body?: { data?: string; attachmentId?: string; size?: number }; parts?: Part[]; headers?: Header[] };
type Msg = { id: string; threadId: string; snippet?: string; labelIds?: string[]; internalDate?: string; payload?: Part };
const hdr = (m: Msg, n: string) => m.payload?.headers?.find((h) => h.name.toLowerCase() === n.toLowerCase())?.value || '';
const emails = (v: string) => (v.match(/[\w.+-]+@[\w-]+\.[\w.-]+/g) || []);
const viewUrl = (id: string) => `https://mail.google.com/mail/u/0/#all/${id}`;
const decode = (d?: string) => (d ? Buffer.from(d, 'base64url').toString('utf8') : '');
type FileRef = { filename: string; attachmentId: string; mimeType: string; size: number };
function textOf(p?: Part): { plain: string; html: string; files: FileRef[] } {
  const out = { plain: '', html: '', files: [] as FileRef[] };
  const walk = (x?: Part) => {
    if (!x) return;
    if (x.filename) {
      const size = x.body?.size || 0;
      // kleine eingebettete Bilder (Logos in Signaturen) überspringen
      const inline = /^image\//.test(x.mimeType || '') && size < 25000;
      if (x.body?.attachmentId && !inline) out.files.push({ filename: x.filename, attachmentId: x.body.attachmentId, mimeType: x.mimeType || 'application/octet-stream', size });
    }
    else if (x.mimeType === 'text/plain' && !out.plain) out.plain = decode(x.body?.data);
    else if (x.mimeType === 'text/html' && !out.html) out.html = decode(x.body?.data);
    x.parts?.forEach(walk);
  };
  walk(p);
  return out;
}
const baseMsg = (m: Msg) => ({
  id: m.id, threadId: m.threadId, snippet: m.snippet || '', subject: hdr(m, 'Subject'),
  sender: emails(hdr(m, 'From'))[0] || '', toRecipients: emails(hdr(m, 'To')),
  senderName: hdr(m, 'From').replace(/<[^>]*>/, '').replace(/["']/g, '').trim(),
  date: m.internalDate ? new Date(Number(m.internalDate)).toISOString() : '', labelIds: m.labelIds || [], viewUrl: viewUrl(m.threadId),
});

async function pool<T, R>(items: T[], n: number, fn: (x: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length); let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k]); } }));
  return out;
}

export async function searchThreads(input: { query?: string; pageSize?: number; pageToken?: string; known?: Record<string, string> }) {
  const q = new URLSearchParams({ maxResults: String(Math.min(50, input.pageSize || 20)) });
  if (input.query) q.set('q', input.query);
  if (input.pageToken) q.set('pageToken', input.pageToken);
  const list = await g<{ threads?: { id: string; historyId?: string }[]; nextPageToken?: string }>(`threads?${q}`);
  const known = input.known || {};
  // Nur neue oder veränderte Unterhaltungen im Detail laden, langsam und nacheinander (Google-Kontingent)
  const threads = await pool(list.threads || [], 3, async (t) => {
    if (t.historyId && known[t.id] === t.historyId) return { id: t.id, historyId: t.historyId, unchanged: true, messages: [] };
    const full = await g<{ id: string; historyId?: string; messages: Msg[] }>(`threads/${t.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Date`);
    return { id: full.id, historyId: full.historyId || t.historyId, viewUrl: viewUrl(full.id), messageCount: full.messages.length, messages: full.messages.map(baseMsg) };
  });
  return { threads, nextPageToken: list.nextPageToken };
}

export async function getThread(input: { threadId: string }) {
  if (!/^[\w-]+$/.test(input.threadId || '')) throw new GmailError('bad_request', 'Ungültige ID');
  const full = await g<{ id: string; messages: Msg[] }>(`threads/${input.threadId}?format=full`);
  return {
    id: full.id, viewUrl: viewUrl(full.id),
    messages: full.messages.map((m) => {
      const t = textOf(m.payload);
      const body = t.plain || t.html.replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ');
      return { ...baseMsg(m), plaintextBody: body.slice(0, 20000), attachments: t.files.map((f) => ({ ...f, messageId: m.id })) };
    }),
  };
}

export async function listLabels() {
  const r = await g<{ labels?: { id: string; name: string; type?: string }[] }>('labels');
  return { labels: (r.labels || []).map((l) => ({ labelId: l.id, name: l.name, labelType: l.type })) };
}

/** Lädt einen Anhang (für die Anzeige in der Kundenübersicht). Vercel erlaubt Antworten bis ca. 4,5 MB. */
export async function getAttachment(messageId: string, attachmentId: string): Promise<Buffer> {
  if (!/^[\w-]+$/.test(messageId) || !/^[\w-]+$/.test(attachmentId)) throw new GmailError('bad_request', 'Ungültige ID');
  const r = await g<{ data?: string; size?: number }>(`messages/${messageId}/attachments/${attachmentId}`);
  return Buffer.from(r.data || '', 'base64url');
}
