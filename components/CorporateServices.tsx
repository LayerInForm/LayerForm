import React from 'react';
import { Buildings, PencilRuler, Stack } from '@phosphor-icons/react';
import { Reveal } from './effects';

interface CorporateServicesProps {
  onInquiryClick: () => void;
}

/** Bento mit genau vier Leistungen */
export const CorporateServices: React.FC<CorporateServicesProps> = () => (
  <section id="leistungen" className="relative">
    <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <Reveal>
        <h2 className="text-4xl font-semibold leading-[1.05] md:text-6xl">Was wir machen</h2>
        <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-fg-muted">
          Von der Idee bis zum fertigen Produkt. Mit Datei oder ohne.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-4 lg:grid-cols-12 lg:grid-rows-[auto_auto_auto] md:gap-5">
        {/* FDM-3D-Druck: großes Bildfeld */}
        <Reveal className="lg:col-span-7 lg:row-span-2">
          <article className="relative flex h-full min-h-[26rem] flex-col justify-end overflow-hidden rounded-panel bg-surface p-7 md:p-10">
            <img
              src="/projects/spiralvase.webp"
              alt=""
              width={1200}
              height={900}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/0" aria-hidden="true" />
            <div className="relative">
              <Stack size={30} className="text-cyan" aria-hidden="true" />
              <h3 className="mt-5 text-3xl font-semibold md:text-4xl">FDM-3D-Druck</h3>
              <p className="mt-3 max-w-[44ch] text-lg leading-relaxed text-fg/80">
                Funktionsteile, Deko und alles dazwischen, gedruckt auf Bambu-Lab-Systemen. Sie haben eine Idee oder eine Datei, wir setzen sie um.
              </p>
            </div>
          </article>
        </Reveal>

        {/* CAD-Konstruktion: mit Modellansicht */}
        <Reveal delay={0.06} className="lg:col-span-5">
          <article className="flex h-full flex-col overflow-hidden rounded-panel border border-white/[.07] bg-surface">
            <img
              src="/projects/cad-aussen.webp"
              alt="CAD-Modell eines Eckteils mit Herz-Aussparung"
              width={1000}
              height={750}
              loading="lazy"
              className="aspect-[16/8] w-full object-cover"
            />
            <div className="p-7 md:p-8">
              <PencilRuler size={26} className="text-cyan" aria-hidden="true" />
              <h3 className="mt-4 text-2xl font-semibold">CAD-Konstruktion</h3>
              <p className="mt-2 leading-relaxed text-fg-muted">
                Keine Datei? Wir konstruieren das Teil nach Skizze, Foto oder Muster. Nachbauten, Anpassungen, Neuentwicklungen.
              </p>
            </div>
          </article>
        </Reveal>

        {/* Für Unternehmen */}
        <Reveal delay={0.1} className="lg:col-span-5">
          <article className="flex h-full flex-col justify-between rounded-panel bg-gradient-to-br from-deep to-surface p-7 md:p-8">
            <Buildings size={26} className="text-cyan" aria-hidden="true" />
            <div className="mt-10">
              <h3 className="text-2xl font-semibold">Für Unternehmen</h3>
              <p className="mt-2 leading-relaxed text-fg/75">
                Prototypen, Firmenlogos und Giveaways. Individuelle Lösungen vom ersten Muster bis zur Lieferung.
              </p>
            </div>
          </article>
        </Reveal>

        {/* Vom Einzelstück zur Serie: breites Feld */}
        <Reveal delay={0.08} className="lg:col-span-12">
          <article className="grid overflow-hidden rounded-panel border border-white/[.07] bg-surface md:grid-cols-2">
            <div className="flex flex-col justify-center p-7 md:p-10">
              <h3 className="text-3xl font-semibold md:text-4xl">Vom Einzelstück zur Serie</h3>
              <p className="mt-3 max-w-[46ch] text-lg leading-relaxed text-fg-muted">
                Ein einzelnes Teil oder eine ganze Serienproduktion. Ohne Werkzeugkosten wie beim Spritzguss.
              </p>
            </div>
            <img
              src="/projects/oktopus-anhaenger.webp"
              alt="Serie gedruckter Oktopus-Schlüsselanhänger in Pink und Blau"
              width={1200}
              height={900}
              loading="lazy"
              className="aspect-[16/10] h-full w-full object-cover md:aspect-auto md:max-h-[22rem]"
            />
          </article>
        </Reveal>
      </div>
    </div>
  </section>
);
