import React from 'react';
import { ArrowUpRight, EnvelopeSimple, MapPin, Phone, WhatsappLogo } from '@phosphor-icons/react';
import { Reveal } from './effects';
import { SOCIALS } from './social';

interface ConsultationHubProps {
  onInquiryClick: () => void;
}

const CHANNELS = [
  { icon: WhatsappLogo, label: 'WhatsApp', value: '+49 176 85922649', href: 'https://wa.me/4917685922649' },
  { icon: EnvelopeSimple, label: 'E-Mail', value: 'info@layer-form.de', href: 'mailto:info@layer-form.de' },
  { icon: Phone, label: 'Telefon', value: '+49 176 85922649', href: 'tel:+4917685922649' },
];

// Bei Bedarf durch den direkten Link zum Google-Unternehmensprofil ersetzen.
const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=LayerForm+Bargteheide';

export const ConsultationHub: React.FC<ConsultationHubProps> = ({ onInquiryClick }) => (
  <section id="kontakt" className="px-3 py-16 md:px-6 md:py-24">
    <Reveal className="relative mx-auto max-w-7xl overflow-hidden rounded-panel bg-gradient-to-br from-deep via-navy to-surface shadow-[inset_0_1px_0_rgba(255,255,255,.08)]">
      <div className="layer-lines pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative grid gap-14 px-6 py-14 md:px-12 md:py-20 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <h2 className="max-w-[16ch] text-4xl font-semibold leading-[1.04] md:text-6xl">
            Erzählen Sie uns, was Sie brauchen.
          </h2>
          <p className="mt-6 max-w-[44ch] text-lg leading-relaxed text-fg/75">
            Eine kurze Beschreibung, ein Foto, eine Skizze oder eine Datei reicht für eine erste Einschätzung.
          </p>
          <button onClick={onInquiryClick} className="btn-primary mt-10">Projekt anfragen</button>

          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 flex items-center gap-2.5 text-[15px] text-fg-muted transition-colors hover:text-fg"
          >
            <MapPin size={18} className="shrink-0 text-cyan" aria-hidden="true" />
            Werkstatt in Bargteheide, Versand in ganz Deutschland
          </a>
        </div>

        <div className="lg:col-span-5 lg:self-center">
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {CHANNELS.map(({ icon: Icon, label, value, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="group flex items-center gap-4 py-5"
                >
                  <Icon size={24} className="shrink-0 text-cyan" aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm text-fg-muted">{label}</span>
                    <span className="block truncate text-lg font-medium">{value}</span>
                  </span>
                  <ArrowUpRight
                    size={18}
                    weight="bold"
                    className="text-fg-muted transition-[color,transform] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan"
                    aria-hidden="true"
                  />
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            {SOCIALS.map(({ name, handle, href, Icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`LayerForm auf ${name}`}
                className="flex items-center gap-2 rounded-full border border-white/15 py-2 pl-3 pr-4 text-[15px] font-medium transition-colors hover:border-white/40 active:scale-[.97]"
              >
                <Icon size={19} className="text-cyan" aria-hidden="true" />
                {handle}
              </a>
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  </section>
);
