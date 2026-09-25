import React, { useEffect, useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { ETSY_URL } from './links';
import type { View } from '../App';

interface NavbarProps {
  currentView: View;
  setView: (view: View) => void;
}

/** Würfel-Icon aus dem Logo. Datei liegt unter public/logo-icon.png */
export const LOGO_ICON_SRC = '/logo-icon.png';

/** Logo: Würfel + zweifarbiger Schriftzug wie im Original ("Layer" cyan, "Form" hell/dunkel) */
export const BrandLogo: React.FC<{ dark?: boolean; size?: 'sm' | 'md' }> = ({ dark = true, size = 'md' }) => (
  <span className="flex items-center gap-2.5">
    <img src={LOGO_ICON_SRC} alt="" className={size === 'md' ? 'h-9 w-9' : 'h-7 w-7'} />
    <span className={`font-bold tracking-[-0.02em] ${size === 'md' ? 'text-xl' : 'text-lg'}`}>
      <span className={dark ? 'text-cyan' : 'text-cyan-mid'}>Layer</span>
      <span className={dark ? 'text-white' : 'text-ink'}>Form</span>
    </span>
  </span>
);

type NavItem = { label: string; anchor?: string; view?: View; href?: string };

const NAV_ITEMS: NavItem[] = [
  { label: 'Projekte', anchor: 'projekte' },
  { label: 'Leistungen', anchor: 'leistungen' },
  { label: 'Etsy-Shop', href: ETSY_URL },
  { label: 'Kontakt', anchor: 'kontakt' },
];

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const go = (item: NavItem) => {
    setOpen(false);
    if (item.view) return setView(item.view);
    if (!item.anchor) return;
    if (currentView === 'home') scrollTo(item.anchor);
    else {
      setView('home');
      setTimeout(() => scrollTo(item.anchor!), 80);
    }
  };

  const isActive = (item: NavItem) => item.view === currentView;

  // Über dem dunklen Hero transparent, sonst als schwebende dunkle Leiste
  const solid = scrolled || currentView !== 'home' || open;

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 md:px-6 md:pt-4">
      <div
        className={`mx-auto max-w-6xl rounded-[1.75rem] border transition-all duration-300 ${
          open
            ? 'border-white/10 bg-navy/[.97] shadow-[0_12px_40px_-12px_rgba(4,17,43,.55)] backdrop-blur-xl'
            : solid
            ? 'border-white/10 bg-navy/85 shadow-[0_12px_40px_-12px_rgba(4,17,43,.55)] backdrop-blur-xl'
            : 'border-transparent bg-transparent'
        }`}
      >
        <nav className="flex h-16 items-center justify-between pl-4 pr-2 md:pl-5" aria-label="Hauptnavigation">
          <button onClick={() => setView('home')} aria-label="LayerForm – Startseite">
            <BrandLogo />
          </button>

          <div className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) =>
              item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded-full px-4 py-2 text-[15px] font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {item.label} <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              ) : (
                <button
                  key={item.label}
                  onClick={() => go(item)}
                  className={`rounded-full px-4 py-2 text-[15px] font-medium transition-colors hover:bg-white/10 hover:text-white ${
                    isActive(item) ? 'bg-white/10 text-white' : 'text-white/70'
                  }`}
                >
                  {item.label}
                </button>
              )
            )}
            <button onClick={() => setView('inquiry')} className="btn-primary ml-2 !py-2.5 !px-5 text-[15px]">
              Projekt anfragen
            </button>
          </div>

          <button
            className="mr-1 rounded-full p-2.5 text-white hover:bg-white/10 md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {open && (
          <div className="px-3 pb-3 md:hidden">
            {NAV_ITEMS.map((item) =>
              item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center gap-1.5 rounded-2xl px-4 py-3.5 text-lg font-medium text-white hover:bg-white/10"
                >
                  {item.label} <ArrowUpRight size={17} aria-hidden="true" />
                </a>
              ) : (
                <button
                  key={item.label}
                  onClick={() => go(item)}
                  className="block w-full rounded-2xl px-4 py-3.5 text-left text-lg font-medium text-white hover:bg-white/10"
                >
                  {item.label}
                </button>
              )
            )}
            <button onClick={() => { setOpen(false); setView('inquiry'); }} className="btn-primary mt-2 w-full">
              Projekt anfragen
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
