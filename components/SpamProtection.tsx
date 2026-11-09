import React, { useEffect, useRef } from 'react';

type TurnstileAPI = {
  render(container: HTMLElement, options: Record<string, unknown>): string;
  remove(id: string): void;
};
declare global { interface Window { turnstile?: TurnstileAPI } }
let loading: Promise<void> | undefined;
function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (loading) return loading;
  loading = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    const timer = window.setTimeout(() => { script.remove(); loading = undefined; reject(new Error('Sicherheitsprüfung nicht erreichbar. Bitte erneut versuchen.')); }, 15000);
    script.onload = () => { window.clearTimeout(timer); if (window.turnstile) resolve(); else { loading = undefined; script.remove(); reject(new Error('Sicherheitsprüfung konnte nicht geladen werden.')); } };
    script.onerror = () => { window.clearTimeout(timer); loading = undefined; script.remove(); reject(new Error('Sicherheitsprüfung nicht erreichbar. Bitte erneut versuchen.')); };
    document.head.appendChild(script);
  });
  return loading;
}

export function useSpamProtection() {
  const container = useRef<HTMLDivElement>(null);
  const cancel = useRef<(() => void) | undefined>(undefined);
  useEffect(() => () => cancel.current?.(), []);
  const verify = async (): Promise<string> => {
    const sitekey = (import.meta as ImportMeta & { env: Record<string, string | undefined> }).env.VITE_TURNSTILE_SITE_KEY;
    if (!sitekey) throw new Error('Sicherheitsprüfung ist noch nicht eingerichtet. Bitte kontaktieren Sie uns direkt.');
    await loadTurnstile();
    if (!container.current || !window.turnstile) throw new Error('Bitte öffnen Sie das Formular erneut.');
    const api = window.turnstile;
    let widget: string | undefined;
    let timer: number | undefined;
    try {
      return await new Promise<string>((resolve, reject) => {
        const fail = () => reject(new Error('Sicherheitsprüfung fehlgeschlagen. Bitte erneut versuchen.'));
        cancel.current = fail;
        timer = window.setTimeout(fail, 90000);
        widget = api.render(container.current!, {
          sitekey, action: 'website_inquiry', theme: 'auto', size: 'compact',
          callback: (token: string) => resolve(token),
          'error-callback': fail, 'expired-callback': fail, 'timeout-callback': fail,
          retry: 'never', 'response-field': false,
        });
      });
    } finally {
      window.clearTimeout(timer);
      cancel.current = undefined;
      if (widget !== undefined) api.remove(widget);
    }
  };
  return { verify, challenge: <div ref={container} aria-label="Spamschutz" aria-live="polite" /> };
}
