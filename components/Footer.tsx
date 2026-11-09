import React from 'react';
import type { View } from '../App';
import { BrandLogo } from './Navbar';
import { ETSY_URL } from './links';
import { SOCIALS } from './social';

interface FooterProps {
  setView: (view: View) => void;
}

const LINKS: { label: string; view: View }[] = [
  { label: 'Anfrage', view: 'inquiry' },
  { label: 'Impressum', view: 'impressum' },
  { label: 'AGB', view: 'agb' },
  { label: 'Datenschutz', view: 'datenschutz' },
  { label: 'Widerruf', view: 'widerruf' },
];

export const Footer: React.FC<FooterProps> = ({ setView }) => (
  <footer className="border-t border-white/[.07] bg-surface pb-[env(safe-area-inset-bottom)]">
    <div className="mx-auto max-w-7xl border-b border-white/10 px-5 pb-12 pt-20 md:px-8 md:pb-16 md:pt-24">
      <p className="text-xs font-semibold uppercase tracking-[.2em] text-cyan">Sie haben eine Idee?</p>
      <button onClick={() => setView('inquiry')} className="group mt-5 flex w-full items-end justify-between gap-4 text-left">
        <span className="text-[clamp(2.9rem,8vw,7.5rem)] font-semibold leading-[.95] tracking-[-.07em] text-fg transition-colors group-hover:text-cyan">Machen wir was draus.</span>
        <span aria-hidden="true" className="mb-2 text-4xl text-cyan transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 md:text-6xl">↗</span>
      </button>
    </div>
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-5">
        <BrandLogo size="sm" />
        <span className="text-sm text-fg-subtle">© {new Date().getFullYear()} LayerForm, Bargteheide</span>
      </div>
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
        <div className="flex gap-2">
          {SOCIALS.map(({ name, href, Icon }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`LayerForm auf ${name}`}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-fg-muted transition-colors hover:border-white/30 hover:text-cyan"
            >
              <Icon size={19} />
            </a>
          ))}
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-fg-muted" aria-label="Footer">
          <a href={ETSY_URL} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-fg">
            Etsy-Shop
          </a>
          {LINKS.map((l) => (
            <button key={l.view} onClick={() => setView(l.view)} className="transition-colors hover:text-fg">
              {l.label}
            </button>
          ))}
          <button type="button" onClick={() => window.dispatchEvent(new Event('layerform:open-consent'))} className="transition-colors hover:text-fg">Cookie-Einstellungen</button>
        </nav>
      </div>
    </div>
  </footer>
);
