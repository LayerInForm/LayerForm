import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db, fail, requireAuth } from '../_lib/intern.js';

/**
 * Einfacher Dokumentspeicher für Kunden, Kalkulationsverlauf und Einstellungen.
 * Dokumente liegen als JSON unter "lf:doc:<pfad>", jede Sammlung hat eine Liste ihrer IDs unter "lf:col:<sammlung>".
 */
const COLLECTIONS = new Set(['kunden', 'posteingang', 'kalkverlauf', 'meta']);
const okPath = (p: string, kind: 'doc' | 'col') => {
  const parts = p.split('/');
  if (kind === 'col') return parts.length === 1 && COLLECTIONS.has(parts[0]);
  return parts.length === 2 && COLLECTIONS.has(parts[0]) && /^[\w.-]{1,120}$/.test(parts[1]);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return fail(res, 405, 'method', 'Nur POST');
  if (!requireAuth(req, res)) return;
  const r = db();
  if (!r) return fail(res, 503, 'db_not_configured', 'Datenbank nicht eingerichtet');
  res.setHeader('Cache-Control', 'no-store');
  const { op, path, data } = (req.body || {}) as { op?: string; path?: string; data?: Record<string, unknown> };
  const p = String(path || '');
  try {
    if (op === 'list') {
      if (!okPath(p, 'col')) return fail(res, 400, 'bad_request', 'Ungültige Sammlung');
      const ids = (await r.smembers(`lf:col:${p}`)) as string[];
      if (!ids.length) return res.json({ docs: [] });
      const vals = await r.mget<(Record<string, unknown> | null)[]>(...ids.map((id) => `lf:doc:${p}/${id}`));
      return res.json({ docs: ids.map((id, i) => ({ id, data: vals[i] })).filter((d) => d.data) });
    }
    if (!okPath(p, 'doc')) return fail(res, 400, 'bad_request', 'Ungültiger Pfad');
    const [col, id] = p.split('/');
    const key = `lf:doc:${p}`;
    if (op === 'get') return res.json({ data: (await r.get(key)) ?? null });
    if (op === 'set') {
      if (!data || typeof data !== 'object') return fail(res, 400, 'bad_request', 'Daten fehlen');
      if (JSON.stringify(data).length > 400_000) return fail(res, 413, 'too_large', 'Zu groß');
      await r.set(key, data); await r.sadd(`lf:col:${col}`, id);
      return res.json({ ok: true });
    }
    if (op === 'update') {
      const cur = (await r.get<Record<string, unknown>>(key));
      if (!cur) return fail(res, 404, 'not_found', 'Dokument fehlt');
      await r.set(key, { ...cur, ...(data || {}) });
      return res.json({ ok: true });
    }
    if (op === 'delete') { await r.del(key); await r.srem(`lf:col:${col}`, id); return res.json({ ok: true }); }
    return fail(res, 400, 'bad_request', 'Unbekannte Aktion');
  } catch (e) {
    console.error('db', e);
    return fail(res, 500, 'server_unavailable', 'Datenbankfehler');
  }
}
