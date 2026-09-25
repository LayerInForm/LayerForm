import React from 'react';
import { Layers, DraftingCompass, Building2, Boxes } from 'lucide-react';
import { Reveal, SpotlightCard } from './effects';

interface CorporateServicesProps {
  onInquiryClick: () => void;
}

export const CorporateServices: React.FC<CorporateServicesProps> = ({ onInquiryClick }) => (
  <section id="leistungen" className="bg-white">
    <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <Reveal className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-semibold md:text-5xl">Was wir machen</h2>
          <p className="mt-4 max-w-md text-lg text-muted">
            Vom Einzelstück bis zur Serie – von der Idee bis zum fertigen Produkt.
          </p>
        </div>
        <button onClick={onInquiryClick} className="btn-ghost">Projekt anfragen</button>
      </Reveal>

      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {/* Hauptleistung: groß und dunkel, im Farbverlauf des Würfels */}
        <Reveal className="md:col-span-2">
          <SpotlightCard
            tilt={3}
            glow="rgba(0,229,255,.22)"
            className="h-full overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy-2 via-deep to-[#0B5FA8] p-8 text-white md:p-10"
          >
            <div className="orb absolute -right-16 -top-16 h-64 w-64 rounded-full bg-cyan/20 blur-3xl" aria-hidden="true" />
            <Layers size={30} className="icon-hop relative text-cyan" aria-hidden="true" />
            <h3 className="relative mt-10 text-3xl font-semibold md:text-4xl">FDM-3D-Druck</h3>
            <p className="relative mt-3 max-w-md text-lg leading-relaxed text-white/75">
              Funktionsteile, Deko und alles dazwischen – gedruckt auf Bambu-Lab-Systemen. Sie haben eine Idee oder eine Datei, wir setzen sie um.
            </p>
            <p className="relative mt-6 text-[15px] text-white/55">Funktionsteile, Ersatzteile, Deko, Giveaways</p>
          </SpotlightCard>
        </Reveal>

        <Reveal delay={0.08}>
          <ServiceCard
            icon={<DraftingCompass size={26} />}
            title="CAD-Konstruktion"
            text="Keine Datei? Wir konstruieren das Teil nach Skizze, Foto oder Muster."
            examples="Nachbauten, Anpassungen, Neuentwicklungen"
          />
        </Reveal>
        <Reveal delay={0.04}>
          <ServiceCard
            icon={<Building2 size={26} />}
            title="Für Unternehmen"
            text="Individuelle Lösungen für Ihren Betrieb – vom ersten Prototyp bis zur Lieferung."
            examples="Prototypen, Firmenlogos, Giveaways"
          />
        </Reveal>

        <Reveal delay={0.12} className="md:col-span-2">
          <SpotlightCard
            tilt={3}
            glow="rgba(0,121,160,.16)"
            className="flex h-full flex-col justify-between gap-8 overflow-hidden rounded-[2rem] bg-cyan/15 p-8 md:flex-row md:items-end md:p-10"
          >
            <div className="relative">
              <Boxes size={28} className="icon-hop text-cyan-text" aria-hidden="true" />
              <h3 className="mt-8 text-3xl font-semibold">Vom Einzelstück zur Serie</h3>
              <p className="mt-3 max-w-md text-lg leading-relaxed text-ink/75">
                Ein einzelnes Teil oder eine ganze Serienproduktion – ohne Werkzeugkosten wie beim Spritzguss.
              </p>
            </div>
            <p className="relative text-[15px] text-muted md:text-right">Einzelanfertigungen, Serienproduktion</p>
          </SpotlightCard>
        </Reveal>
      </div>
    </div>
  </section>
);

const ServiceCard: React.FC<{ icon: React.ReactNode; title: string; text: string; examples: string }> = ({
  icon, title, text, examples,
}) => (
  <SpotlightCard
    glow="rgba(0,229,255,.2)"
    className="h-full overflow-hidden rounded-[2rem] border border-line bg-ice p-8 transition-colors hover:border-cyan/60"
  >
    <span className="icon-hop relative inline-block text-cyan-text" aria-hidden="true">{icon}</span>
    <h3 className="relative mt-8 text-2xl font-semibold">{title}</h3>
    <p className="relative mt-3 leading-relaxed text-ink/75">{text}</p>
    <p className="relative mt-5 text-[15px] text-muted">{examples}</p>
  </SpotlightCard>
);
