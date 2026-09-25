import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  animate,
} from 'motion/react';

/** Blendet Inhalte beim Scrollen weich ein (von unten, mit leichter Unschärfe). */
export const Reveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}> = ({ children, delay = 0, className, y = 28 }) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '0px 0px -80px 0px' }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Karte mit Lichtkegel, der dem Mauszeiger folgt, und leichter 3D-Neigung.
 * `glow` legt die Farbe des Lichtkegels fest.
 */
export const SpotlightCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  glow?: string;
  tilt?: number;
}> = ({ children, className = '', glow = 'rgba(0,229,255,.18)', tilt = 6 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [tilt, -tilt]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(px, [0, 1], [-tilt, tilt]), { stiffness: 200, damping: 20 });

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    px.set(x);
    py.set(y);
    el.style.setProperty('--sx', `${x * 100}%`);
    el.style.setProperty('--sy', `${y * 100}%`);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={reduce ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className={`spotlight group relative ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `radial-gradient(420px circle at var(--sx,50%) var(--sy,50%), ${glow}, transparent 60%)` }}
        aria-hidden="true"
      />
      {children}
    </motion.div>
  );
};

/** Zählt eine Zahl hoch, sobald sie sichtbar wird. */
export const CountUp: React.FC<{ to: number; decimals?: number; className?: string }> = ({
  to,
  decimals = 1,
  className,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(reduce ? to : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, to, { duration: 1.4, ease: [0.2, 0.8, 0.2, 1], onUpdate: setValue });
    return () => controls.stop();
  }, [inView, reduce, to]);

  return (
    <span ref={ref} className={className}>
      {value.toFixed(decimals).replace('.', ',')}
    </span>
  );
};
