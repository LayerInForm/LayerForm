import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Star } from '@phosphor-icons/react';
import { EASE_OUT } from './effects';
import { formatRating, REVIEW_COUNT } from './Reviews';

interface HeroProps {
  onInquiryClick: () => void;
  onCalculatorClick?: () => void; // fehlt, wenn der Preisrechner ausgeschaltet ist
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.08 + i * 0.08, duration: 0.5, ease: EASE_OUT } }),
};

export const Hero: React.FC<HeroProps> = ({ onInquiryClick, onCalculatorClick }) => {
  const reduce = useReducedMotion();
  const from = reduce ? false : 'hidden';

  return (
    <section className="relative overflow-hidden border-b border-ink/[.07]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_15%,rgba(166,107,255,.14),transparent_55%)]" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-5 pb-14 pt-28 md:px-8 md:pb-20 md:pt-36">
        <motion.div variants={item} initial={from} animate="show" custom={0} className="mb-7 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[.18em] text-fg">
          <span className="h-2 w-2 rounded-full bg-cyan shadow-[0_0_14px_rgba(166,107,255,.3)]" aria-hidden="true" />
          3D-Druckstudio &amp; digitale Lösungen
          <span className="text-fg-subtle">/ Bargteheide</span>
        </motion.div>
        <div className="grid items-end gap-9 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.6fr)] lg:gap-16">
          <motion.h1 variants={item} initial={from} animate="show" custom={1} className="max-w-[13ch] text-[clamp(3.25rem,8.4vw,7.5rem)] font-semibold leading-[.98] tracking-[-.055em]">
            Ideen werden <span className="text-fg underline decoration-cyan decoration-[.09em] underline-offset-[.12em]">greifbar.</span>
          </motion.h1>
          <motion.div variants={item} initial={from} animate="show" custom={2} className="pb-2">
            <p className="max-w-[38ch] text-lg leading-relaxed text-fg-muted md:text-xl">
              Von der ersten Skizze bis zum fertigen Bauteil. Wir konstruieren, drucken und automatisieren – für Unternehmen und Privatkunden.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button onClick={onInquiryClick} className="btn-primary">Projekt starten <span aria-hidden="true">↗</span></button>
              {onCalculatorClick && <button onClick={onCalculatorClick} className="btn-ghost">Preis berechnen</button>}
            </div>
            <p className="mt-6 flex items-center gap-2 text-sm text-fg-muted">
              <span className="flex text-fg" aria-hidden="true">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} weight="fill" />)}</span>
              <span>{formatRating()} bei Google · {REVIEW_COUNT} Bewertungen</span>
            </p>
          </motion.div>
        </div>

        <div className="mt-14 grid gap-4 md:mt-16 md:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] md:gap-5">
          <motion.div initial={reduce ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, ease: EASE_OUT }} className="group relative min-h-[300px] overflow-hidden rounded-[1.75rem] bg-surface sm:min-h-[400px] md:min-h-[480px]">
            <img src="/projects/designlampe.webp" alt="3D-gedruckte Designleuchte mit Wellenstruktur" width={1200} height={900} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-transparent" aria-hidden="true" />
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 border-t border-ink/15 bg-bg/95 p-6 sm:p-9">
              <div><p className="text-xs font-semibold uppercase tracking-[.16em] text-fg">01 / Design &amp; Fertigung</p><h2 className="mt-2 text-2xl font-semibold sm:text-4xl">Schicht für Schicht.<br />Einzigartig.</h2></div>
              <button onClick={onInquiryClick} aria-label="Ähnliches Projekt anfragen" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-ink/30 bg-bg/50 text-2xl text-fg backdrop-blur-md transition-colors hover:bg-cyan hover:text-ink">↗</button>
            </div>
          </motion.div>
          <div className="grid grid-rows-[minmax(0,1fr)_auto] gap-4 md:gap-5">
            <div className="group relative min-h-[260px] overflow-hidden rounded-[1.75rem] bg-surface sm:min-h-[330px]">
              <img src="/projects/stativ-adapter.webp" alt="3D-gedruckter Stativadapter für Messtechnik" width={1200} height={900} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-transparent" aria-hidden="true" />
              <div className="absolute inset-x-0 bottom-0 border-t border-ink/15 bg-bg/95 p-6 sm:p-8"><p className="text-xs font-semibold uppercase tracking-[.16em] text-fg">02 / Technische Bauteile</p><h2 className="mt-2 text-2xl font-semibold">Präzise. Passgenau.</h2></div>
            </div>
            <div className="grid grid-cols-3 gap-3 rounded-[1.75rem] border border-ink/10 bg-blue px-4 py-6 sm:px-6">
              {[
                ['CAD', 'Konstruktion'],
                ['3D', 'Druck & Serie'],
                ['DE', 'Versand'],
              ].map(([head, sub]) => (
                <div key={head} className="min-w-0 border-r border-ink/10 last:border-r-0 last:pr-0">
                  <span className="block text-2xl font-semibold tracking-tight text-fg sm:text-3xl">{head}</span>
                  <span className="mt-1 block text-xs text-fg sm:text-sm">{sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-5 text-xs font-semibold uppercase tracking-[.13em] text-fg-muted">
          <span>Einzelstücke · Prototypen · Kleinserien</span>
          <a href="#projekte" className="transition-colors hover:text-fg">Arbeiten entdecken ↓</a>
        </div>
      </div>
      <Marquee />
    </section>
  );
};

/* ---------- Laufband: was alles gedruckt werden kann ---------- */

const ITEMS = [
  'Funktionsteile', 'Ersatzteile', 'Prototypen', 'Gehäuse', 'Halterungen', 'Firmenlogos',
  'Giveaways mit Logo', 'Werbeartikel', 'Messe-Giveaways', 'Event-Deko', 'Wohndeko', 'Geschenke', 'Einzelanfertigungen', 'Serienproduktion',
];

const Marquee: React.FC = () => (
  <div className="marquee relative border-y border-ink/[.07] py-5" aria-label="Was wir drucken">
    <div className="marquee-track flex w-max items-center">
      {[0, 1].map((copy) => (
        <ul key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
          {ITEMS.map((t) => (
            <li key={t} className="flex items-center whitespace-nowrap text-lg font-medium text-fg-muted md:text-xl">
              <span className="mx-7 inline-block h-2 w-2 rotate-45 bg-cyan/80" aria-hidden="true" />
              {t}
            </li>
          ))}
        </ul>
      ))}
    </div>
  </div>
);
