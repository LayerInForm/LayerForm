import React, { useEffect } from 'react';

/** Interne Umgebung „LayerForm intern“ (Kunden + Kalkulator) in claude.ai, Passwort wird dort abgefragt */
export const INTERN_URL = 'https://claude.ai/artifact/JWYdqf83h6Qsye1q5ox7BN';

export default function InternRedirect() {
  useEffect(() => {
    const robots = document.createElement('meta');
    robots.name = 'robots'; robots.content = 'noindex, nofollow';
    document.head.appendChild(robots);
    document.title = 'LayerForm intern';
    const t = setTimeout(() => window.location.replace(INTERN_URL), 150);
    return () => { clearTimeout(t); robots.remove(); };
  }, []);

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-5 px-6 text-center">
      <img src="/logo-icon.png" alt="" width={56} height={56} className="h-14 w-14" />
      <p className="text-lg text-fg-muted">LayerForm intern wird geöffnet …</p>
      <a href={INTERN_URL} className="btn-primary">Weiter</a>
    </div>
  );
}
