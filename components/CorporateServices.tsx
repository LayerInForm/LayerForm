import React from 'react';
import { ArrowUpRight } from '@phosphor-icons/react';
import { Reveal } from './effects';

interface CorporateServicesProps { onInquiryClick: () => void; }

const SERVICES = [
  { number: '01', title: '3D-Druck', description: 'Funktionsteile, Ersatzteile, Prototypen und Serien. Wir fertigen, was Sie brauchen – ohne Umwege.', image: '/projects/kraemer-gehaeuse.webp', alt: '3D-gedruckte Gehäuse in Serie' },
  { number: '02', title: 'CAD & Entwicklung', description: 'Aus einer Skizze, einem Muster oder einer Idee entsteht ein fertiges Modell. Passgenau für Ihren Einsatz.', image: '/projects/cad-aussen.webp', alt: 'CAD-Konstruktion eines Bauteils' },
  { number: '03', title: 'Kleinserien & Werbeartikel', description: 'Kleine Stückzahlen, personalisierte Produkte und Giveaways für Ihr Unternehmen.', image: '/projects/oktopus-anhaenger.webp', alt: '3D-gedruckte Schlüsselanhänger in Kleinserie' },
];

export const CorporateServices: React.FC<CorporateServicesProps> = ({ onInquiryClick }) => (
  <section id="leistungen" className="relative border-y border-ink/[.07] bg-surface">
    <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-8 border-b border-ink/15 pb-10">
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[.2em] text-fg">Leistungen / LayerForm</p>
            <h2 className="max-w-[12ch] text-[clamp(3rem,6vw,6rem)] font-semibold leading-[.95] tracking-[-.06em]">Von der Idee<br />zum Objekt.</h2>
          </div>
          <p className="max-w-[30ch] text-lg leading-relaxed text-fg-muted">Ein Ansprechpartner. Vom ersten Entwurf bis zum fertigen Bauteil.</p>
        </div>
      </Reveal>
      <div className="divide-y divide-ink/10">
        {SERVICES.map((s) => (
          <Reveal key={s.number}>
            <article className="group grid items-center gap-7 py-9 md:grid-cols-[5rem_minmax(0,1fr)_minmax(0,1fr)] md:gap-10 md:py-12">
              <span className="self-start pt-2 font-mono text-sm text-fg">{s.number} / 03</span>
              <div>
                <h3 className="max-w-[12ch] text-3xl font-semibold tracking-tight md:text-5xl">{s.title}</h3>
                <p className="mt-5 max-w-[42ch] text-base leading-relaxed text-fg-muted md:text-lg">{s.description}</p>
                <button onClick={onInquiryClick} className="mt-7 inline-flex items-center gap-2 border-b border-cyan pb-1 text-sm font-semibold text-fg transition-colors hover:text-fg">Projekt besprechen <ArrowUpRight size={17} aria-hidden="true" /></button>
              </div>
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-surface">
                <img src={s.image} alt={s.alt} width={1200} height={750} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
