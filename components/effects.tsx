import React, { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useReducedMotion } from 'motion/react';

export const EASE_OUT = [0.23, 1, 0.32, 1] as const;

/** Blendet Inhalte beim Scrollen ein: kurzer Weg nach oben, weiches Ausklingen. */
export const Reveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
  as?: 'div' | 'li' | 'article';
}> = ({ children, delay = 0, className, y = 20, as = 'div' }) => {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.7, delay, ease: EASE_OUT }}
    >
      {children}
    </Tag>
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
    const controls = animate(0, to, { duration: 1.2, ease: EASE_OUT, onUpdate: setValue });
    return () => controls.stop();
  }, [inView, reduce, to]);

  return (
    <span ref={ref} className={className}>
      {value.toFixed(decimals).replace('.', ',')}
    </span>
  );
};
