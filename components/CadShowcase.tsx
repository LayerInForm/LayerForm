import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { EASE_OUT, Reveal } from './effects';

interface CadShowcaseProps {
  onInquiry: (topic?: string) => void;
}

const STEPS = [
  {
    key: 'innen',
    label: 'Konstruktion innen',
    text: 'Verstärkungsrippen, Schraublaschen und Aufnahmen, passgenau nach Maß konstruiert.',
    image: '/projects/cad-innen.webp',
    caption: 'CAD-Modell, Innenansicht',
  },
  {
    key: 'aussen',
    label: 'Konstruktion außen',
    text: 'Auf Wunsch mit eigenem Motiv, hier ein Herz als Aussparung.',
    image: '/projects/cad-aussen.webp',
    caption: 'CAD-Modell, Außenansicht',
  },
  {
    key: 'fertig',
    label: 'Gedrucktes Teil',
    text: 'Aus dem Modell wird ein stabiles, einsatzfertiges Bauteil.',
    image: '/projects/eckteil-gedruckt.webp',
    caption: 'Fertiger Druck',
  },
];

const DURATION = 5;

export const CadShowcase: React.FC<CadShowcaseProps> = ({ onInquiry }) => {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const reduce = useReducedMotion();

  // Wechselt automatisch, bis jemand selbst klickt
  useEffect(() => {
    if (!auto || reduce) return;
    const t = setInterval(() => setActive((a) => (a + 1) % STEPS.length), DURATION * 1000);
    return () => clearInterval(t);
  }, [auto, reduce]);

  const step = STEPS[active];

  return (
    <section className="relative border-y border-white/[.07] bg-navy">
      <div className="layer-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-24 md:px-8 md:py-32 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-5">
          <h2 className="text-4xl font-semibold leading-[1.05] md:text-5xl">Vom CAD-Modell zum fertigen Teil</h2>
          <p className="mt-5 max-w-[44ch] text-lg leading-relaxed text-fg-muted">
            Keine Datei? Kein Problem. Wir konstruieren Ihr Teil selbst und drucken es direkt im Anschluss.
          </p>

          <div className="mt-10" role="tablist" aria-label="Ansichten">
            {STEPS.map((s, i) => {
              const on = i === active;
              return (
                <button
                  key={s.key}
                  role="tab"
                  aria-selected={on}
                  onClick={() => { setActive(i); setAuto(false); }}
                  className="group relative block w-full py-4 pl-6 text-left"
                >
                  {/* Leiste links, füllt sich beim automatischen Wechsel */}
                  <span className="absolute inset-y-0 left-0 w-[2px] rounded-full bg-white/10" aria-hidden="true" />
                  {on && (
                    <motion.span
                      key={`bar-${active}-${auto}`}
                      className="absolute inset-y-0 left-0 w-[2px] origin-top rounded-full bg-cyan"
                      initial={auto && !reduce ? { scaleY: 0 } : false}
                      animate={{ scaleY: 1 }}
                      transition={auto && !reduce ? { duration: DURATION, ease: 'linear' } : { duration: 0 }}
                      aria-hidden="true"
                    />
                  )}
                  <span className={`block text-lg font-semibold transition-colors ${on ? 'text-fg' : 'text-fg-subtle group-hover:text-fg-muted'}`}>
                    {s.label}
                  </span>
                  <span className={`mt-1 block max-w-[42ch] leading-snug transition-colors ${on ? 'text-fg-muted' : 'text-fg-subtle'}`}>
                    {s.text}
                  </span>
                </button>
              );
            })}
          </div>

          <button onClick={() => onInquiry('Anfrage: CAD-Konstruktion')} className="btn-primary mt-10">
            Konstruktion anfragen
          </button>
        </Reveal>

        <Reveal delay={0.08} className="lg:col-span-7">
          <figure>
            <div className="relative aspect-[4/3] overflow-hidden rounded-panel bg-white shadow-[0_40px_80px_-40px_rgba(0,0,0,.6)]">
              <AnimatePresence initial={false}>
                <motion.img
                  key={step.key}
                  src={step.image}
                  alt={`${step.label}: ${step.text}`}
                  width={1000}
                  height={750}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                />
              </AnimatePresence>
            </div>
            <figcaption className="mt-3 text-sm text-fg-subtle">{step.caption}</figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
};
