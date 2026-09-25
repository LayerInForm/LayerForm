import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Box, Scan, CheckCircle2 } from 'lucide-react';
import { Reveal } from './effects';

interface CadShowcaseProps {
  onInquiryClick: () => void;
}

const STEPS = [
  {
    key: 'innen',
    icon: Scan,
    label: 'Konstruktion innen',
    text: 'Verstärkungsrippen, Schraublaschen und Aufnahmen – passgenau nach Maß konstruiert.',
    image: '/projects/cad-innen.webp',
    chip: 'CAD-Modell',
  },
  {
    key: 'aussen',
    icon: Box,
    label: 'Konstruktion außen',
    text: 'Auf Wunsch mit eigenem Motiv, hier ein Herz als Aussparung.',
    image: '/projects/cad-aussen.webp',
    chip: 'CAD-Modell',
  },
  {
    key: 'fertig',
    icon: CheckCircle2,
    label: 'Gedrucktes Teil',
    text: 'Aus dem Modell wird ein stabiles, einsatzfertiges Bauteil.',
    image: '/projects/eckteil-gedruckt.webp',
    chip: 'Fertiger Druck',
  },
];

export const CadShowcase: React.FC<CadShowcaseProps> = ({ onInquiryClick }) => {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const reduce = useReducedMotion();

  // Wechselt automatisch, bis jemand selbst klickt
  useEffect(() => {
    if (!auto || reduce) return;
    const t = setInterval(() => setActive((a) => (a + 1) % STEPS.length), 4500);
    return () => clearInterval(t);
  }, [auto, reduce]);

  const step = STEPS[active];

  return (
    <section className="hero-bg relative overflow-hidden text-white">
      <div className="grid-lines absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-[1fr_1.25fr] md:py-32">
        <Reveal>
          <h2 className="text-4xl font-semibold leading-[1.05] md:text-5xl">Vom CAD-Modell zum fertigen Teil</h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-white/70">
            Keine Datei? Kein Problem. Wir konstruieren Ihr Teil selbst und drucken es direkt im Anschluss.
          </p>

          <div className="mt-10 flex flex-col gap-2" role="tablist" aria-label="Ansichten">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const on = i === active;
              return (
                <button
                  key={s.key}
                  role="tab"
                  aria-selected={on}
                  onClick={() => { setActive(i); setAuto(false); }}
                  className={`relative flex items-start gap-4 overflow-hidden rounded-2xl border p-4 text-left transition-colors ${
                    on ? 'border-cyan/50 bg-white/10' : 'border-white/10 bg-white/[.03] hover:bg-white/[.07]'
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                      on ? 'bg-cyan text-ink' : 'bg-white/10 text-white/70'
                    }`}
                  >
                    <Icon size={19} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-semibold">{s.label}</span>
                    <span className={`mt-0.5 block text-[15px] leading-snug ${on ? 'text-white/75' : 'text-white/50'}`}>{s.text}</span>
                  </span>
                  {/* Fortschrittsbalken beim automatischen Wechsel */}
                  {on && auto && !reduce && (
                    <motion.span
                      key={`bar-${active}`}
                      className="absolute bottom-0 left-0 h-[2px] bg-cyan"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 4.5, ease: 'linear' }}
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <button onClick={onInquiryClick} className="btn-primary mt-10">Konstruktion anfragen</button>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-[0_30px_80px_-30px_rgba(0,229,255,.35)]">
            <div className="relative aspect-[4/3]">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.img
                  key={step.key}
                  src={step.image}
                  alt={`${step.label}: ${step.text}`}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.04, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                />
              </AnimatePresence>
            </div>
            <span className="absolute left-4 top-4 rounded-full bg-navy/85 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              {step.chip}
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
