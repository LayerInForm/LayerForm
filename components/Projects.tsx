import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { User, Building2, ArrowUpRight, Gift } from 'lucide-react';
import { Reveal } from './effects';
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
    cta: { label: string; topic: string };
    extra?: { label: string; topic: string };
    etsy?: boolean;
    projects: Project[];
  }
> = {
  privat: {
    tab: 'Privatkunden',
    icon: User,
    title: 'Für Privatkunden',
    text: 'Ersatzteil für Haus und Garten, Geschenk mit persönlicher Note oder Deko fürs Zuhause – auch einzelne Stücke sind willkommen.',
    chips: ['Ersatzteile', 'Geschenke', 'Deko', 'Personalisierte Einzelstücke'],
    cta: { label: 'Idee schicken', topic: 'Anfrage als Privatkunde' },
    etsy: true,
    projects: [
      { title: 'Dachrinnen-Endstück mit Rohranschluss', category: 'Ersatzteil', image: '/projects/dachrinne.webp' },
      { title: 'Leuchte mit Wellenstruktur', category: 'Deko', image: '/projects/designlampe.webp' },
      { title: 'Vase mit Spiralrillen', category: 'Deko', image: '/projects/spiralvase.webp' },
    ],
  },
  unternehmen: {
    tab: 'Unternehmen',
    icon: Building2,
    title: 'Für Unternehmen',
    text: 'Vom Prototyp über Gehäuse bis zur Serienproduktion – dazu Giveaways und Werbeartikel mit Ihrem Logo für Messen, Events, Mitarbeiter und Kunden.',
    chips: ['Prototypen', 'Gehäuse & Serien', 'Giveaways mit Logo', 'Werbeartikel', 'Event-Deko'],
    cta: { label: 'Projekt besprechen', topic: 'Anfrage als Unternehmen' },
    extra: { label: 'Giveaways anfragen', topic: 'Anfrage: Giveaways für Unternehmen' },
    projects: [
      { title: 'Gehäuse-Serie mit Firmenlogo', category: 'Serienproduktion', image: '/projects/kraemer-gehaeuse.webp' },
      { title: 'Oktopus-Schlüsselanhänger', category: 'Giveaway', image: '/projects/oktopus-anhaenger.webp' },
      { title: 'Stativ-Adapter für Messtechnik', category: 'Sonderanfertigung', image: '/projects/stativ-adapter.webp' },
    ],
  },
};

const ProjectCard: React.FC<{ p: Project; big?: boolean; onInquiry: (topic?: string) => void }> = ({ p, big, onInquiry }) => (
  <figure className={`group ${big ? 'col-span-2' : ''}`}>
    <button
      onClick={() => onInquiry(`Anfrage bezüglich Referenzprojekt: ${p.title}`)}
      aria-label={`Ähnliches wie „${p.title}“ anfragen`}
      className={`relative block w-full overflow-hidden rounded-[1.5rem] text-left ${big ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}
    >
      <img
        src={p.image}
        alt={p.title}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-navy/85 via-navy/20 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="flex translate-y-3 items-center gap-1.5 rounded-full bg-cyan px-3.5 py-1.5 text-sm font-semibold text-ink transition-transform duration-300 group-hover:translate-y-0">
          Ähnliches anfragen <ArrowUpRight size={15} aria-hidden="true" />
        </span>
      </div>
      <span className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-ink backdrop-blur">
        {p.category}
      </span>
    </button>
    <figcaption className="mt-3 text-[15px] font-semibold leading-snug md:text-base">{p.title}</figcaption>
  </figure>
);

export const Projects: React.FC<ProjectsProps> = ({ onInquiry }) => {
  const [group, setGroup] = useState<Group>('privat');
  const reduce = useReducedMotion();
  const g = GROUPS[group];
  const Icon = g.icon;

  return (
    <section id="projekte" className="bg-ice">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <Reveal className="flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-semibold md:text-5xl">Für Privatkunden und Unternehmen</h2>
            <p className="mt-4 text-lg text-muted">
              Ein einzelnes Ersatzteil oder hundert Giveaways mit Firmenlogo – hier ein paar Projekte aus beiden Welten.
            </p>
          </div>

          {/* Umschalter mit gleitendem Hintergrund */}
          <div className="flex rounded-full border border-line bg-white p-1.5" role="tablist" aria-label="Kundengruppe">
            {(Object.keys(GROUPS) as Group[]).map((key) => {
              const TabIcon = GROUPS[key].icon;
              const on = key === group;
              return (
                <button
                  key={key}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setGroup(key)}
                  className={`relative flex items-center gap-2 rounded-full px-5 py-2.5 text-[15px] font-semibold transition-colors ${
                    on ? 'text-white' : 'text-ink/70 hover:text-ink'
                  }`}
                >
                  {on && (
                    <motion.span
                      layoutId="group-pill"
                      className="absolute inset-0 rounded-full bg-navy"
                      transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <TabIcon size={17} className="relative" aria-hidden="true" />
                  <span className="relative">{GROUPS[key].tab}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={group}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12, filter: 'blur(4px)' }}
            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
            className="mt-14 grid gap-10 md:grid-cols-[1fr_1.5fr] md:gap-12"
            role="tabpanel"
          >
            <div className="md:sticky md:top-28 md:self-start md:pt-2">
              <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${group === 'unternehmen' ? 'bg-navy text-cyan' : 'bg-cyan/20 text-cyan-text'}`}>
                <Icon size={23} aria-hidden="true" />
              </span>
              <h3 className="mt-6 text-3xl font-semibold">{g.title}</h3>
              <p className="mt-3 text-lg leading-relaxed text-ink/75">{g.text}</p>

              <ul className="mt-6 flex flex-wrap gap-2">
                {g.chips.map((c) => (
                  <li
                    key={c}
                    className={`rounded-full border px-3.5 py-1.5 text-sm font-medium ${
                      c.startsWith('Giveaways') ? 'border-cyan/60 bg-cyan/15 text-ink' : 'border-line bg-white text-ink/80'
                    }`}
                  >
                    {c.startsWith('Giveaways') && <Gift size={13} className="-mt-0.5 mr-1.5 inline" aria-hidden="true" />}
                    {c}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={() => onInquiry(g.cta.topic)} className="btn-primary">{g.cta.label}</button>
                {g.extra && (
                  <button onClick={() => onInquiry(g.extra!.topic)} className="btn-ghost">{g.extra.label}</button>
                )}
                {g.etsy && (
                  <a href={ETSY_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                    Fertige Stücke auf Etsy <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
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
