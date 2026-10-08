import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Star } from '@phosphor-icons/react';
import { EASE_OUT } from './effects';
import { formatRating, REVIEW_COUNT } from './Reviews';

interface HeroProps {
  onInquiryClick: () => void;
  onCalculatorClick: () => void;
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.08 + i * 0.08, duration: 0.7, ease: EASE_OUT } }),
};

/** Foto, das beim Laden Schicht für Schicht "gedruckt" wird. */
const PrintedPhoto: React.FC<{ src: string; alt: string; className?: string; priority?: boolean }> = ({
  src, alt, className = '', priority,
}) => (
  <div className={`relative overflow-hidden rounded-panel bg-surface ${className}`}>
    <div className="layer-lines absolute inset-0" aria-hidden="true" />
    <img
      src={src}
      alt={alt}
      width={1200}
      height={900}
      fetchPriority={priority ? 'high' : undefined}
      className="print-in absolute inset-0 h-full w-full object-cover"
    />
    <span className="nozzle absolute inset-x-0 h-px bg-cyan shadow-[0_0_0_1px_rgba(0,229,255,.25)]" aria-hidden="true" />
    <div className="pointer-events-none absolute inset-0 rounded-panel shadow-[inset_0_0_0_1px_rgba(255,255,255,.08)]" aria-hidden="true" />
  </div>
);

export const Hero: React.FC<HeroProps> = ({ onInquiryClick, onCalculatorClick }) => {
  const reduce = useReducedMotion();
  const from = reduce ? false : 'hidden';

  return (
    <section className="relative overflow-hidden">
      {/* Tiefes Blau aus dem Würfel als Lichtquelle oben rechts */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(55% 60% at 80% 20%, rgba(8,36,111,.75), transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative mx-auto grid min-h-[100dvh] max-w-7xl items-center gap-12 px-5 pb-16 pt-28 md:px-8 lg:grid-cols-12 lg:gap-10 lg:pb-20 lg:pt-24">
        <div className="lg:col-span-7">
          <motion.p
            variants={item} initial={from} animate="show" custom={0}
            className="flex items-center gap-2.5 text-sm text-fg-muted"
          >
            <span className="flex gap-0.5 text-cyan" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} weight="fill" />)}
            </span>
            <span><span className="font-semibold text-fg">{formatRating()}</span> bei Google, {REVIEW_COUNT} Bewertungen</span>
          </motion.p>

          <motion.h1
            variants={item} initial={from} animate="show" custom={1}
            className="mt-6 text-[clamp(2.75rem,5.2vw,4.5rem)] font-semibold leading-[1.02] [text-wrap:wrap]"
          >
            Ihre Idee.<br />
            <span className="sm:whitespace-nowrap">Gedruckt &amp; <span className="text-cyan">geliefert.</span></span>
          </motion.h1>

          <motion.p
            variants={item} initial={from} animate="show" custom={2}
            className="mt-6 max-w-[34rem] text-lg leading-relaxed text-fg-muted md:text-xl"
          >
            3D-Druck und CAD-Konstruktion für Unternehmen und Privatkunden. Vom Ersatzteil bis zur Serie, in ganz Deutschland.
          </motion.p>

          <motion.div
            variants={item} initial={from} animate="show" custom={3}
            className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4"
          >
            <button onClick={onInquiryClick} className="btn-primary">Projekt anfragen</button>
            <button onClick={onCalculatorClick} className="btn-ghost">Preis für Ihre Datei berechnen</button>
          </motion.div>
        </div>

        {/* Bildkomposition: großes Foto, kleines Foto überlappt */}
        <div className="relative lg:col-span-5">
          <div className="relative ml-auto w-full max-w-[34rem] pb-10 pl-10 sm:pl-16 lg:max-w-none lg:pl-12">
            <PrintedPhoto
              src="/projects/designlampe.webp"
              alt="Gedruckte Leuchte mit Wellenstruktur, violett beleuchtet"
              className="aspect-[4/5] w-full"
              priority
            />
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.0, duration: 0.7, ease: EASE_OUT }}
              className="absolute bottom-0 left-0 w-[46%] rounded-panel bg-bg p-1.5"
            >
              <img
                src="/projects/stativ-adapter.webp"
                alt="Gedruckter Stativ-Adapter für Messtechnik"
                width={1200}
                height={900}
                loading="lazy"
                className="aspect-square w-full rounded-[1.2rem] object-cover"
              />
            </motion.div>
          </div>
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
  <div className="marquee relative border-y border-white/[.07] py-5" aria-label="Was wir drucken">
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
