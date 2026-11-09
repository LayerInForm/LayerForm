import React, { useState } from 'react';
import { ArrowUpRight, Star } from '@phosphor-icons/react';
import { CountUp, Reveal } from './effects';

/* ---------- Daten ---------- */

export interface GoogleReview {
  rating: number;
  text: string;
  author: string;
}

// Gesamtbewertung und Anzahl: bei neuen Rezensionen hier anpassen
export const RATING = 5;
export const REVIEW_COUNT = 12;
export const GOOGLE_URL = 'https://www.google.com/maps/search/?api=1&query=LayerForm+3D+Druck+Service+Bargteheide';

/** Bewertung im deutschen Format, z. B. "5,0" */
export const formatRating = (r: number = RATING) => r.toFixed(1).replace('.', ',');

// Auswahl echter Google-Rezensionen (Nachnamen abgekürzt)
const REVIEWS: GoogleReview[] = [
  { rating: 5, author: 'Moritz S.', text: 'In <24h zu sehr fairem Preis dringende Teile gedruckt – danke!' },
  {
    rating: 5,
    author: 'Mirco Z.',
    text: 'Junges aufstrebendes Unternehmen mit hoher Motivation, schneller Bearbeitungszeit und toller individueller Umsetzung. Weitere Aufträge werden bestimmt folgen. Vielen Dank',
  },
  {
    rating: 5,
    author: 'Christian',
    text: 'Super entspannter Kontakt per WhatsApp, schneller Druck, schnelle Lieferung, guter Preis! Jeder Zeit wieder! 👍',
  },
  {
    rating: 5,
    author: 'C. K.',
    text: 'Sehr kompetente Beratung. Schnelle Lieferung einer Starlink mini Halterung für die Befestigung an der Kederschiene meines LMC Wohnwagens. Spitzenqualität zum fairen Preis. Absolute Empfehlung.',
  },
  {
    rating: 5,
    author: 'Peter',
    text: 'Schnelle Abwicklung des Druckauftrags (Endstück für Dachrinne mit Rohranschluss), incl. Probedrucks. Gerne wieder!',
  },
  {
    rating: 5,
    author: 'K. Riedel',
    text: 'Sehr schnelle und professionelle 3D-Druck-Leistung. Top Qualität und ein hervorragendes Preis-Leistungs-Verhältnis. Absolut empfehlenswert!',
  },
];

/* ---------- Bausteine ---------- */

const Stars: React.FC<{ value: number; size?: number; className?: string }> = ({ value, size = 16, className = '' }) => (
  <span className={`flex gap-0.5 ${className}`} role="img" aria-label={`${value} von 5 Sternen`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={size} weight="fill" className={i < Math.round(value) ? '' : 'opacity-25'} aria-hidden="true" />
    ))}
  </span>
);

const ReviewCard: React.FC<{ review: GoogleReview; delay: number }> = ({ review, delay }) => {
  const [expanded, setExpanded] = useState(false);
  const long = review.text.length > 180;
  const initials = review.author.replace(/\./g, '').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

  return (
    <Reveal as="article" delay={delay} className="mb-4 break-inside-avoid rounded-panel bg-surface p-6 md:mb-5 md:p-7">
      <Stars value={review.rating} size={15} className="text-cyan" />
      <p className={`mt-4 leading-relaxed text-fg/90 ${!expanded && long ? 'line-clamp-4' : ''}`}>
        „{review.text}“
      </p>
      {long && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="mt-2 text-sm font-semibold text-cyan transition-colors hover:text-cyan-soft"
        >
          {expanded ? 'Weniger anzeigen' : 'Weiterlesen'}
        </button>
      )}
      <footer className="mt-5 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[.06] text-sm font-semibold text-fg-muted">
          {initials}
        </span>
        <span>
          <span className="block text-[15px] font-semibold">{review.author}</span>
          <span className="block text-sm text-fg-subtle">Google-Rezension</span>
        </span>
      </footer>
    </Reveal>
  );
};

/* ---------- Abschnitt ---------- */

export const Reviews: React.FC = () => (
  <section className="relative">
    <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 md:px-8 md:py-32 lg:grid-cols-12 lg:gap-10">
      <Reveal className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
        <h2 className="text-4xl font-semibold leading-[1.05] md:text-5xl">Was Kunden sagen</h2>
        <div className="mt-8 flex items-end gap-4">
          <CountUp to={RATING} className="text-7xl font-semibold leading-none tracking-tight tabular-nums" />
          <div className="pb-1">
            <Stars value={RATING} size={18} className="text-cyan" />
            <p className="mt-1.5 text-[15px] text-fg-muted">{REVIEW_COUNT} Bewertungen bei Google</p>
          </div>
        </div>
        <a href={GOOGLE_URL} target="_blank" rel="noopener noreferrer" className="link-arrow mt-8 text-[15px]">
          Alle Rezensionen auf Google <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
        </a>
      </Reveal>

      <div className="columns-1 gap-4 sm:columns-2 md:gap-5 lg:col-span-8">
        {REVIEWS.map((r, i) => (
          <ReviewCard key={`${r.author}-${i}`} review={r} delay={(i % 2) * 0.06} />
        ))}
      </div>
    </div>
  </section>
);
