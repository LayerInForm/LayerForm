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
];

export const Footer: React.FC<FooterProps> = ({ setView }) => (
  <footer className="border-t border-line bg-white">
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-5">
        <BrandLogo dark={false} size="sm" />
        <span className="text-sm text-muted">© {new Date().getFullYear()} LayerForm, Bargteheide</span>
      </div>
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-8">
      <div className="flex gap-2">
        {SOCIALS.map(({ name, href, Icon }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`LayerForm auf ${name}`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-mid hover:text-cyan-mid"
          >
            <Icon size={18} />
          </a>
        ))}
      </div>
      <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted" aria-label="Footer">
        <a href={ETSY_URL} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-ink">
          Etsy-Shop
        </a>
        {LINKS.map((l) => (
          <button key={l.view} onClick={() => setView(l.view)} className="transition-colors hover:text-ink">
            {l.label}
          </button>
        ))}
      </nav>
      </div>
    </div>
  </footer>
);
