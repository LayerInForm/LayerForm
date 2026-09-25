import React from 'react';
import { Star, ArrowUpRight } from 'lucide-react';
import { ETSY_URL } from './links';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { formatRating, REVIEW_COUNT } from './Reviews';

interface HeroProps {
  onInquiryClick: () => void;
}

/* ---------- Isometrischer Schichtwürfel im Stil des Logos ---------- */

const CX = 200;      // Mitte
const W = 150;       // halbe Breite der Raute
const H = 86.6;      // halbe Höhe der Raute (isometrisch: W * tan 30°)
const T = 26;        // Dicke einer Schicht
const STEP = 31;     // Abstand der Schichten (Dicke + Fuge)
const LAYERS = 7;
const TOP = 16;

const pts = (p: [number, number][]) => p.map(([x, y]) => `${x},${y.toFixed(1)}`).join(' ');

// Farbe zwischen zwei Hex-Werten mischen
const mix = (a: string, b: string, t: number) => {
  const n = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [n(a), n(b)];
  return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * t)).join(',')})`;
};

const LayerCube: React.FC = () => {
  const slabs = Array.from({ length: LAYERS }, (_, k) => {
    const y = TOP + k * STEP;          // k = 0 ist die oberste Schicht
    const t = k / (LAYERS - 1);        // 0 oben … 1 unten
    return {
      k,
      top: pts([[CX, y], [CX + W, y + H], [CX, y + 2 * H], [CX - W, y + H]]),
      left: pts([[CX - W, y + H], [CX, y + 2 * H], [CX, y + 2 * H + T], [CX - W, y + H + T]]),
      right: pts([[CX, y + 2 * H], [CX + W, y + H], [CX + W, y + H + T], [CX, y + 2 * H + T]]),
      topFill: mix('#00E5FF', '#1FA8E0', t),
      leftFill: mix('#0B3F86', '#061A4F', t),
      rightFill: mix('#19C9EE', '#0A3AA0', t),
    };
  });

  // Öffnung in der obersten Fläche, wie im Logo
  const s = 0.42;
  const hy = TOP + H;
  const hole: [number, number][] = [[CX, hy - s * H], [CX + s * W, hy], [CX, hy + s * H], [CX - s * W, hy]];
  const D = 34;

  return (
    <svg viewBox="0 0 400 420" className="h-auto w-full" role="img" aria-label="Würfel aus gedruckten Schichten">
      <defs>
        <linearGradient id="lf-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#00E5FF" />
          <stop offset="1" stopColor="#8FF5FF" />
        </linearGradient>
        <clipPath id="lf-hole"><polygon points={pts(hole)} /></clipPath>
      </defs>

      {[...slabs].reverse().map((sl) => (
        <g key={sl.k} className="slab" style={{ animationDelay: `${(LAYERS - 1 - sl.k) * 0.12 + 0.15}s` }}>
          <polygon points={sl.top} fill={sl.k === 0 ? 'url(#lf-top)' : sl.topFill} />
          <polygon points={sl.left} fill={sl.leftFill} />
          <polygon points={sl.right} fill={sl.rightFill} />
          {sl.k === 0 && (
            <g clipPath="url(#lf-hole)">
              <polygon points={pts(hole)} fill="#041B47" />
              <polygon points={pts([hole[3], hole[0], [hole[0][0], hole[0][1] + D], [hole[3][0], hole[3][1] + D]])} fill="#0B3F86" />
              <polygon points={pts([hole[0], hole[1], [hole[1][0], hole[1][1] + D], [hole[0][0], hole[0][1] + D]])} fill="#139DD0" />
            </g>
          )}
        </g>
      ))}
    </svg>
  );
};

/* ---------- Hero ---------- */

// Kleine "Druckpartikel", die um den Würfel aufsteigen (feste Werte, damit nichts springt)
const PARTICLES = [
  { l: 12, d: 0, s: 6, t: 7 }, { l: 24, d: 2.4, s: 4, t: 9 }, { l: 38, d: 1.1, s: 5, t: 8 },
  { l: 55, d: 3.2, s: 4, t: 10 }, { l: 68, d: 0.6, s: 6, t: 7.5 }, { l: 80, d: 2, s: 4, t: 9.5 },
  { l: 90, d: 4.1, s: 5, t: 8.5 }, { l: 46, d: 5, s: 3, t: 11 },
];

const lineVariants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
  show: (i: number) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { delay: 0.1 + i * 0.12, duration: 0.8, ease: [0.2, 0.8, 0.2, 1] as const },
  }),
};

export const Hero: React.FC<HeroProps> = ({ onInquiryClick }) => {
  const reduce = useReducedMotion();

  // Würfel neigt sich leicht zur Maus
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotY = useSpring(useTransform(mx, [-1, 1], [-12, 12]), { stiffness: 80, damping: 18 });
  const rotX = useSpring(useTransform(my, [-1, 1], [8, -8]), { stiffness: 80, damping: 18 });
  const glowX = useSpring(useTransform(mx, [-1, 1], [-30, 30]), { stiffness: 60, damping: 20 });

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };

  const fromHidden = reduce ? false : 'hidden';

  return (
    <section
      className="hero-bg relative overflow-hidden text-white"
      onPointerMove={onMove}
      onPointerLeave={() => { mx.set(0); my.set(0); }}
    >
      <div className="grid-lines grid-drift absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-36 md:grid-cols-[1.15fr_1fr] md:pb-28 md:pt-44">
        <div>
          <motion.p
            variants={lineVariants} initial={fromHidden} animate="show" custom={0}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-sm text-white/80 backdrop-blur"
          >
            <span className="flex text-cyan" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={13} fill="currentColor" strokeWidth={0} className="star-pop" style={{ animationDelay: `${0.6 + i * 0.08}s` }} />
              ))}
            </span>
            {formatRating()} bei Google
            <span className="text-white/50">({REVIEW_COUNT})</span>
          </motion.p>

          <h1 className="mt-7 text-[clamp(2.7rem,6.4vw,5.4rem)] font-semibold leading-[1.02]">
            <motion.span className="block" variants={lineVariants} initial={fromHidden} animate="show" custom={1}>
              Ihre Idee.
            </motion.span>
            <motion.span className="block" variants={lineVariants} initial={fromHidden} animate="show" custom={2}>
              Gedruckt &amp; <span className="shimmer-text">geliefert.</span>
            </motion.span>
          </h1>

          <motion.p
            variants={lineVariants} initial={fromHidden} animate="show" custom={3}
            className="mt-7 max-w-lg text-lg leading-relaxed text-white/70 md:text-xl"
          >
            Von Funktionsteilen bis zur Deko, vom Einzelstück bis zur Serie: Wir fertigen im
            3D-Druck, was Sie brauchen. Für Unternehmen und Privatkunden in ganz Deutschland.
          </motion.p>

          <motion.div
            variants={lineVariants} initial={fromHidden} animate="show" custom={4}
            className="mt-10 flex flex-wrap gap-3"
          >
            <button onClick={onInquiryClick} className="btn-primary">Projekt anfragen</button>
            <a href={ETSY_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost-dark">
              Zum Etsy-Shop <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </motion.div>
        </div>

        <div className="relative mx-auto w-full max-w-[17rem] md:max-w-none">
          <motion.div
            className="glow-pulse absolute inset-[16%] rounded-full bg-cyan/30 blur-3xl"
            style={reduce ? undefined : { x: glowX }}
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            {PARTICLES.map((p, i) => (
              <span
                key={i}
                className="particle"
                style={{ left: `${p.l}%`, width: p.s, height: p.s, animationDelay: `${p.d}s`, animationDuration: `${p.t}s` }}
              />
            ))}
          </div>
          <motion.div
            className="relative"
            style={reduce ? undefined : { rotateX: rotX, rotateY: rotY, transformPerspective: 1000 }}
          >
            <div className="cube-float">
              <LayerCube />
            </div>
            <div className="scan-line" aria-hidden="true" />
          </motion.div>
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
  <div className="marquee relative border-t border-white/10 bg-white/[.03] py-5" aria-label="Was wir drucken">
    <div className="marquee-track flex w-max items-center">
      {[0, 1].map((copy) => (
        <ul key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
          {ITEMS.map((item) => (
            <li key={item} className="flex items-center whitespace-nowrap text-lg font-medium text-white/75 md:text-xl">
              <span className="mx-7 inline-block h-2.5 w-2.5 rotate-45 rounded-[2px] bg-cyan shadow-[0_0_10px_#00E5FF]" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      ))}
    </div>
  </div>
);
