import type { VercelRequest } from '@vercel/node';

export async function validateTurnstile(req: VercelRequest): Promise<'ok' | 'invalid' | 'unavailable'> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) { console.warn('Turnstile: missing-secret'); return 'unavailable'; }
  const token = req.body?.turnstileToken;
  if (typeof token !== 'string' || !token || token.length > 2048) return 'invalid';
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token }),
      signal: AbortSignal.timeout(10000),
    });
    const result = await response.json().catch(() => ({}));
    const allowed = ['missing-input-secret', 'invalid-input-secret', 'missing-input-response', 'invalid-input-response', 'bad-request', 'timeout-or-duplicate', 'internal-error'];
    const codes = Array.isArray(result['error-codes']) ? result['error-codes'].filter((code: unknown) => typeof code === 'string' && allowed.includes(code)) : [];
    if (!response.ok) { console.warn('Turnstile: verification-http', response.status, codes.join(',')); return 'unavailable'; }
    if (result.success !== true) {
      console.warn('Turnstile: verification-rejected', codes.join(',') || 'unknown');
      return 'invalid';
    }
    const hosts = ['layer-form.de', 'www.layer-form.de', process.env.VERCEL_URL].filter(Boolean);
    if (result.action !== 'website_inquiry' || !hosts.includes(result.hostname)) {
      console.warn('Turnstile: action-or-host-mismatch'); return 'invalid';
    }
    return 'ok';
  } catch { console.warn('Turnstile: verification-unavailable'); return 'unavailable'; }
}
