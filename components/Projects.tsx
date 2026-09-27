import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Buildings, User } from '@phosphor-icons/react';
import { EASE_OUT, Reveal } from './effects';
import { ETSY_URL } from './links';

interface ProjectsProps {
  /** Öffnet das Anfrageformular mit vorausgefülltem Betreff */
  onInquiry: (topic?: string) => void;
}

interface Project {
  title: string;
  category: string;
  image: string;
}

type Group = 'privat' | 'unternehmen';

// Bilder liegen unter public/projects/ (4:3, WebP)
const GROUPS: Record<
  Group,
  {
    tab: string;
    icon: typeof User;
    title: string;
    text: string;
    chips: string[];
    topic: string;
    extra?: { label: string; topic: string };
    etsy?: boolean;
    projects: Project[];
  }
> = {
  privat: {
    tab: 'Privatkunden',
    icon: User,
    title: 'Für Privatkunden',
    text: 'Ersatzteil für Haus und Garten, Geschenk mit persönlicher Note oder Deko fürs Zuhause. Auch einzelne Stücke sind willkommen.',
    chips: ['Ersatzteile', 'Geschenke', 'Deko', 'Personalisierte Einzelstücke'],
    topic: 'Anfrage als Privatkunde',
    etsy: true,
    projects: [
      { title: 'Dachrinnen-Endstück mit Rohranschluss', category: 'Ersatzteil', image: '/projects/dachrinne.webp' },
      { title: 'Leuchte mit Wellenstruktur', category: 'Deko', image: '/projects/designlampe.webp' },
      { title: 'Vase mit Spiralrillen', category: 'Deko', image: '/projects/spiralvase.webp' },
    ],
  },
  unternehmen: {
    tab: 'Unternehmen',
    icon: Buildings,
    title: 'Für Unternehmen',
    text: 'Vom Prototyp über Gehäuse bis zur Serienproduktion. Dazu Giveaways und Werbeartikel mit Ihrem Logo für Messen, Events, Mitarbeiter und Kunden.',
    chips: ['Prototypen', 'Gehäuse & Serien', 'Giveaways mit Logo', 'Werbeartikel', 'Event-Deko'],
    topic: 'Anfrage als Unternehmen',
    extra: { label: 'Giveaways anfragen', topic: 'Anfrage: Giveaways für Unternehmen' },
    projects: [
      { title: 'Gehäuse-Serie mit Firmenlogo', category: 'Serienproduktion', image: '/projects/kraemer-gehaeuse.webp' },
      { title: 'Oktopus-Schlüsselanhänger', category: 'Giveaway', image: '/projects/oktopus-anhaenger.webp' },
      { title: 'Stativ-Adapter für Messtechnik', category: 'Sonderanfertigung', image: '/projects/stativ-adapter.webp' },
    ],
  },
};

const ProjectCard: React.FC<{ p: Project; big?: boolean; onInquiry: (topic?: string) => void }> = ({ p, big, onInquiry }) => (
  <figure className={big ? 'col-span-2' : ''}>
    <button
      onClick={() => onInquiry(`Anfrage bezüglich Referenzprojekt: ${p.title}`)}
      aria-label={`Ähnliches wie „${p.title}“ anfragen`}
      className="group block w-full text-left"
    >
      <span className={`relative block overflow-hidden rounded-panel bg-surface ${big ? 'aspect-[16/10]' : 'aspect-[4/5] sm:aspect-[4/3]'}`}>
        <img
          src={p.image}
          alt={p.title}
          width={1200}
          height={900}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        <span className="pointer-events-none absolute inset-0 rounded-panel shadow-[inset_0_0_0_1px_rgba(255,255,255,.08)]" />
      </span>
      <figcaption className="mt-3 flex items-start justify-between gap-3">
        <span>
          <span className="block text-[15px] font-semibold leading-snug text-fg md:text-base">{p.title}</span>
          <span className="mt-0.5 block text-sm text-fg-subtle">{p.category}</span>
        </span>
        <ArrowUpRight
          size={18}
          weight="bold"
          className="mt-0.5 shrink-0 text-fg-subtle transition-[color,transform] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan"
          aria-hidden="true"
        />
      </figcaption>
    </button>
  </figure>
);

export const Projects: React.FC<ProjectsProps> = ({ onInquiry }) => {
  const [group, setGroup] = useState<Group>('privat');
  const reduce = useReducedMotion();
  const g = GROUPS[group];

  return (
    <section id="projekte" className="relative">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <Reveal>
          <h2 className="max-w-3xl text-4xl font-semibold leading-[1.05] md:text-6xl">
            Ein Ersatzteil oder hundert Giveaways.
          </h2>
          <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-fg-muted">
            Projekte aus beiden Welten. Tippen Sie auf ein Bild, um etwas Ähnliches anzufragen.
          </p>

          {/* Umschalter mit gleitendem Hintergrund */}
          <div
            className="mt-10 inline-flex w-full rounded-full border border-white/10 bg-surface p-1.5 sm:w-auto"
            role="tablist"
            aria-label="Kundengruppe"
          >
            {(Object.keys(GROUPS) as Group[]).map((key) => {
              const TabIcon = GROUPS[key].icon;
              const on = key === group;
              return (
                <button
                  key={key}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setGroup(key)}
                  className={`relative flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-2.5 text-sm font-semibold transition-colors sm:flex-none sm:px-5 sm:text-[15px] ${
                    on ? 'text-ink' : 'text-fg-muted hover:text-fg'
                  }`}
                >
                  {on && (
                    <motion.span
                      layoutId="group-pill"
                      className="absolute inset-0 rounded-full bg-cyan"
                      transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 36 }}
                    />
                  )}
                  <TabIcon size={17} weight={on ? 'bold' : 'regular'} className="relative hidden shrink-0 min-[360px]:block" aria-hidden="true" />
                  <span className="relative">{GROUPS[key].tab}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={group}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-10"
            role="tabpanel"
          >
            <div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
              <h3 className="text-3xl font-semibold">{g.title}</h3>
              <p className="mt-4 max-w-[46ch] text-lg leading-relaxed text-fg-muted">{g.text}</p>

              <ul className="mt-6 flex flex-wrap gap-2">
                {g.chips.map((c) => (
                  <li key={c} className="rounded-full border border-white/10 px-3.5 py-1.5 text-sm text-fg/85">
                    {c}
                  </li>
                ))}
              </ul>

              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
                <button onClick={() => onInquiry(g.topic)} className="btn-primary">Projekt anfragen</button>
                {g.extra && (
                  <button onClick={() => onInquiry(g.extra!.topic)} className="btn-ghost">{g.extra.label}</button>
                )}
                {g.etsy && (
                  <a href={ETSY_URL} target="_blank" rel="noopener noreferrer" className="link-arrow text-[15px]">
                    Fertige Stücke auf Etsy <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:gap-x-6 lg:col-span-8">
              {g.projects.map((p, i) => (
                <ProjectCard key={p.title} p={p} big={i === 0} onInquiry={onInquiry} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
