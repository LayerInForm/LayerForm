import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fail, requireAuth } from '../_lib/intern';
import { GmailError, getThread, listLabels, searchThreads } from '../_lib/google';

/** Liest Gmail für die Kundenübersicht (nur lesen). Gleiche Antwortform wie vorher in claude.ai. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return fail(res, 405, 'method', 'Nur POST');
  if (!requireAuth(req, res)) return;
  res.setHeader('Cache-Control', 'no-store');
  const { tool, input } = (req.body || {}) as { tool?: string; input?: Record<string, unknown> };
  try {
    if (tool === 'search_threads') return res.json(await searchThreads((input || {}) as { query?: string }));
    if (tool === 'get_thread') return res.json(await getThread((input || {}) as { threadId: string }));
    if (tool === 'list_labels') return res.json(await listLabels());
    return fail(res, 400, 'bad_request', 'Unbekanntes Werkzeug');
  } catch (e) {
    if (e instanceof GmailError) {
      const status = e.code === 'google_not_connected' || e.code === 'needs_reauth' ? 409 : e.code === 'rate_limited' ? 429 : e.code.endsWith('not_configured') ? 503 : 502;
      return fail(res, status, e.code, e.message);
    }
    console.error('gmail', e);
    return fail(res, 500, 'server_unavailable', 'Gmail nicht erreichbar');
  }
}
