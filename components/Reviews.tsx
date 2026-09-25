import React, { useRef, useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { CountUp, Reveal } from './effects';

/* ---------- Daten ---------- */

export interface GoogleReview {
  rating: number;
  text: string;
  author: string;
}

// Gesamtbewertung und Anzahl – bei neuen Rezensionen hier anpassen
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
  <span className={`flex ${className}`} aria-label={`${value} von 5 Sternen`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={size}
        strokeWidth={0}
        fill="currentColor"
        className={i < Math.round(value) ? '' : 'opacity-25'}
      />
    ))}
  </span>
);

const GoogleMark: React.FC = () => (
  <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
  </svg>
);

const ReviewCard: React.FC<{ review: GoogleReview }> = ({ review }) => {
  const [expanded, setExpanded] = useState(false);
  const long = review.text.length > 260;
  const initials = review.author.replace(/\./g, '').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

  return (
    <article className="flex w-[85vw] max-w-[24rem] shrink-0 snap-start flex-col rounded-[1.75rem] border border-line bg-white p-7 transition-shadow duration-300 hover:shadow-[0_18px_50px_-20px_rgba(0,28,71,.25)] sm:w-[22rem]">
      <div className="flex items-center justify-between">
        <Stars value={review.rating} className="text-[#FBBC04]" />
        <GoogleMark />
      </div>

      <p className={`mt-5 flex-1 whitespace-pre-line leading-relaxed text-ink/85 ${!expanded && long ? 'line-clamp-6' : ''}`}>
        {review.text}
      </p>
      {long && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="mt-2 self-start text-sm font-semibold text-cyan-text hover:underline"
        >
          {expanded ? 'Weniger anzeigen' : 'Mehr lesen'}
        </button>
      )}

      <footer className="mt-6 flex items-center gap-3 border-t border-line pt-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan/20 text-sm font-semibold text-ink">
          {initials}
        </span>
        <div className="min-w-0">
          <span className="block truncate font-semibold">{review.author}</span>
          <span className="text-sm text-muted">Google-Rezension</span>
        </div>
      </footer>
    </article>
  );
};

/* ---------- Abschnitt ---------- */

export const Reviews: React.FC = () => {
  const scroller = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 380), behavior: 'smooth' });
  };

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-6 pt-20 md:pt-24">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex items-center gap-5">
            <CountUp to={RATING} className="text-6xl font-semibold tabular-nums tracking-tight" />
            <div>
              <Stars value={RATING} size={20} className="text-cyan-mid" />
              <p className="mt-1 text-[15px] text-muted">
                {REVIEW_COUNT} Bewertungen bei Google
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {REVIEWS.length > 1 && (
              <div className="hidden gap-2 md:flex">
                <button onClick={() => scrollBy(-1)} className="btn-ghost !p-3" aria-label="Vorherige Rezensionen">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={() => scrollBy(1)} className="btn-ghost !p-3" aria-label="Nächste Rezensionen">
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
            <a href={GOOGLE_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              Alle Rezensionen auf Google
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
            <div
              ref={scroller}
              className="-mx-6 mt-10 flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto scroll-px-6 px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {REVIEWS.map((r, i) => (
                <ReviewCard key={`${r.author}-${i}`} review={r} />
              ))}
            </div>
            <p className="mt-2 text-xs text-muted">Rezensionen von Google</p>
          </Reveal>
      </div>
    </section>
  );
};
