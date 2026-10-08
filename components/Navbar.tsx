import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import { ArrowUpRight, List, X } from '@phosphor-icons/react';
import { ETSY_URL } from './links';
import { EASE_OUT } from './effects';
import type { View } from '../App';

interface NavbarProps {
  currentView: View;
  setView: (view: View) => void;
}

/** Würfel-Icon aus dem Logo. Datei liegt unter public/logo-icon.png */
export const LOGO_ICON_SRC = '/logo-icon.png';

/** Logo: Würfel + zweifarbiger Schriftzug ("Layer" cyan, "Form" hell) */
export const BrandLogo: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'md' }) => (
  <span className="flex items-center gap-2.5">
    <img src={LOGO_ICON_SRC} alt="" width={36} height={36} className={size === 'md' ? 'h-9 w-9' : 'h-7 w-7'} />
    <span className={`font-bold tracking-[-0.03em] ${size === 'md' ? 'text-xl' : 'text-lg'}`}>
      <span className="text-cyan">Layer</span>
      <span className="text-fg">Form</span>
    </span>
  </span>
);

type NavItem = { label: string; anchor?: string; href?: string; view?: View };

const NAV_ITEMS: NavItem[] = [
  { label: 'Projekte', anchor: 'projekte' },
  { label: 'Leistungen', anchor: 'leistungen' },
  { label: 'Preisrechner', view: 'rechner' },
  { label: 'Etsy-Shop', href: ETSY_URL },
  { label: 'Kontakt', anchor: 'kontakt' },
];

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24));

  // Aktiven Abschnitt markieren
  useEffect(() => {
    if (currentView !== 'home') { setActive(null); return; }
    const ids = NAV_ITEMS.filter((i) => i.anchor).map((i) => i.anchor!);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [currentView]);

  // Menü mit Escape schließen
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });

  const go = (item: NavItem) => {
    setOpen(false);
    if (item.view) { setView(item.view); return; }
    if (!item.anchor) return;
    if (currentView === 'home') scrollTo(item.anchor);
    else {
      setView('home');
      setTimeout(() => scrollTo(item.anchor!), 80);
    }
  };

  const solid = scrolled || currentView !== 'home' || open;

  return (
    <header className="fixed inset-x-0 top-0 z-nav px-3 pt-[max(.75rem,env(safe-area-inset-top))] md:px-6">
      <div
        className={`mx-auto max-w-7xl rounded-panel border transition-[background-color,border-color] duration-300 ${
          solid
            ? 'border-white/[.08] bg-bg/80 shadow-[inset_0_1px_0_rgba(255,255,255,.06)] backdrop-blur-xl'
            : 'border-transparent bg-transparent'
        } ${open ? 'bg-bg/[.97]' : ''}`}
      >
        <nav className="flex h-16 items-center justify-between pl-4 pr-2 md:pl-5" aria-label="Hauptnavigation">
          <button onClick={() => { setOpen(false); setView('home'); }} aria-label="LayerForm, zur Startseite">
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
                  className="flex items-center gap-1 rounded-full px-4 py-2 text-[15px] font-medium text-fg-muted transition-colors hover:text-fg"
                >
                  {item.label} <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
                </a>
              ) : (
                <button
                  key={item.label}
                  onClick={() => go(item)}
                  aria-current={active === item.anchor || (item.view && item.view === currentView) ? 'true' : undefined}
                  className={`relative rounded-full px-4 py-2 text-[15px] font-medium transition-colors hover:text-fg ${
                    active === item.anchor || (item.view && item.view === currentView) ? 'text-fg' : 'text-fg-muted'
                  }`}
                >
                  {(active === item.anchor || (item.view && item.view === currentView)) && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-white/[.07]"
                      transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 36 }}
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </button>
              )
            )}
            <button onClick={() => setView('inquiry')} className="btn-primary ml-2 !px-5 !py-2.5">
              Projekt anfragen
            </button>
          </div>

          <button
            className="mr-1 rounded-full p-2.5 text-fg transition-colors hover:bg-white/10 md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
          >
            {open ? <X size={22} /> : <List size={22} />}
          </button>
        </nav>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id="mobile-menu"
              initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: EASE_OUT }}
              className="overflow-hidden md:hidden"
            >
              <div className="px-3 pb-3">
                {NAV_ITEMS.map((item) =>
                  item.href ? (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setOpen(false)}
                      className="flex w-full items-center gap-1.5 rounded-2xl px-4 py-3.5 text-lg font-medium text-fg active:bg-white/10"
                    >
                      {item.label} <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
                    </a>
                  ) : (
                    <button
                      key={item.label}
                      onClick={() => go(item)}
                      className="block w-full rounded-2xl px-4 py-3.5 text-left text-lg font-medium text-fg active:bg-white/10"
                    >
                      {item.label}
                    </button>
                  )
                )}
                <button onClick={() => { setOpen(false); setView('inquiry'); }} className="btn-primary mt-2 w-full">
                  Projekt anfragen
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
