import React, { useEffect } from 'react';

/** Alte Adressen #intern, #kalk und #kalkulation führen zu layer-form.de/intern */
export const INTERN_URL = '/intern';

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
