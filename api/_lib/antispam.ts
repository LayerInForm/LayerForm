import type { VercelRequest } from '@vercel/node';

export async function validateTurnstile(req: VercelRequest): Promise<'ok' | 'invalid' | 'unavailable'> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return 'unavailable';
  const token = req.body?.turnstileToken;
  if (typeof token !== 'string' || !token || token.length > 2048) return 'invalid';
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return 'unavailable';
    const result = await response.json();
    const hosts = ['layer-form.de', 'www.layer-form.de', process.env.VERCEL_URL].filter(Boolean);
    return result.success === true && result.action === 'website_inquiry' && hosts.includes(result.hostname) ? 'ok' : 'invalid';
  } catch { return 'unavailable'; }
}
