import React from 'react';
import { MessageCircle, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { Reveal } from './effects';

interface ConsultationHubProps {
  onInquiryClick: () => void;
}

const CHANNELS = [
  { icon: MessageCircle, label: 'WhatsApp', value: '+49 176 85922649', href: 'https://wa.me/4917685922649' },
  { icon: Mail, label: 'E-Mail', value: 'info@layer-form.de', href: 'mailto:info@layer-form.de' },
  { icon: Phone, label: 'Telefon', value: '+49 176 85922649', href: 'tel:+4917685922649' },
];

// TODO: Bei Bedarf durch den direkten Link zum Google-Unternehmensprofil ersetzen.
const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=LayerForm+Bargteheide';

export const ConsultationHub: React.FC<ConsultationHubProps> = ({ onInquiryClick }) => (
  <section id="kontakt" className="bg-white px-3 py-20 md:px-6 md:py-24">
    <Reveal className="glow-border mx-auto max-w-6xl rounded-[2.5rem] p-[2px]">
    <div className="hero-bg relative overflow-hidden rounded-[calc(2.5rem-2px)] text-white">
      <div className="grid-lines absolute inset-0" aria-hidden="true" />

      <div className="relative grid gap-12 px-7 py-14 md:grid-cols-[1.1fr_1fr] md:px-14 md:py-20">
        <div>
          <h2 className="text-4xl font-semibold leading-[1.05] md:text-[3.4rem]">
            Erzählen Sie uns, was Sie brauchen.
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-white/70">
            Eine kurze Beschreibung, ein Foto, eine Skizze oder eine Datei reicht für eine erste Einschätzung.
          </p>
          <button onClick={onInquiryClick} className="btn-primary mt-10">Anfrageformular öffnen</button>

          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 flex items-center gap-2.5 text-[15px] text-white/60 transition-colors hover:text-white"
          >
            <MapPin size={17} className="text-cyan" aria-hidden="true" />
            Werkstatt in Bargteheide, Versand in ganz Deutschland
          </a>
        </div>

        <div className="flex flex-col gap-3 md:justify-center">
          {CHANNELS.map(({ icon: Icon, label, value, href }, i) => (
            <Reveal key={label} delay={0.15 + i * 0.1} y={16}>
            <div>
              <a
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group flex items-center gap-4 rounded-2xl transition-transform duration-300 hover:-translate-y-0.5 border border-white/10 bg-white/[.06] p-4 transition-colors hover:border-cyan/50 hover:bg-white/10 md:p-5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan/15 text-cyan transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-6deg]">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm text-white/55">{label}</span>
                  <span className="block truncate text-lg font-medium">{value}</span>
                </span>
                <ArrowUpRight size={18} className="text-white/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cyan" aria-hidden="true" />
              </a>
            </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
    </Reveal>
  </section>
);
