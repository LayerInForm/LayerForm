import React from 'react';
import {
  ArrowRight, CalendarCheck, ChartBar, Check, Desktop, Funnel, Plugs, Receipt, Sparkle,
} from '@phosphor-icons/react';
import { Reveal } from './effects';

interface AutomationProps {
  onInquiry: (topic?: string) => void;
}

/* Typische Abläufe, die kleine Unternehmen automatisieren */
const USE_CASES = [
  {
    icon: Funnel,
    title: 'Anfragen & Leads',
    text: 'Kontaktformular, E-Mail oder WhatsApp: Jede Anfrage landet automatisch im CRM, der Kunde bekommt eine Bestätigung, Sie eine Aufgabe.',
  },
  {
    icon: Receipt,
    title: 'Angebote & Rechnungen',
    text: 'Angebote aus Vorlagen, Rechnungen direkt aus dem Auftrag, Zahlungserinnerungen ohne Nachfassen von Hand.',
  },
  {
    icon: Sparkle,
    title: 'KI im Arbeitsalltag',
    text: 'E-Mails vorsortieren, Antworten vorschlagen, Dokumente zusammenfassen: KI dort, wo sie Zeit spart, mit klaren Regeln.',
  },
  {
    icon: Plugs,
    title: 'Programme verbinden',
    text: 'Shop, CRM, Buchhaltung und Tabellen tauschen Daten selbst aus. Schluss mit doppelter Eingabe und Copy-Paste.',
  },
  {
    icon: CalendarCheck,
    title: 'Termine & Erinnerungen',
    text: 'Terminbuchung, Bestätigungen und Erinnerungen laufen von allein, inklusive Bitte um eine Bewertung nach dem Auftrag.',
  },
  {
    icon: ChartBar,
    title: 'Auswertungen',
    text: 'Umsatz, offene Angebote und Anfragen auf einen Blick, automatisch aktuell statt jeden Monat neu zusammengesucht.',
  },
];

const STEPS = [
  { title: 'Kostenloses Erstgespräch', text: '30 Minuten per Telefon oder Video. Sie erzählen, wo es hakt, wir zeigen, was möglich ist.' },
  { title: 'Prozess-Check', text: 'Wir nehmen Ihre Abläufe auf und zeigen, wo sich Automatisierung wirklich lohnt. Danach bekommen Sie ein klares Angebot.' },
  { title: 'Umsetzung', text: 'Wir bauen die Abläufe in Ihren Programmen, testen mit echten Fällen und passen an, bis alles sitzt.' },
  { title: 'Übergabe & Betreuung', text: 'Kurze Einweisung und Dokumentation. Auf Wunsch kümmern wir uns weiter um Pflege und Erweiterungen.' },
];

const IT_SERVICES = [
  'Google Workspace & Microsoft 365 einrichten',
  'E-Mail-Postfächer, Domains & Zugänge',
  'Websites erstellen und pflegen',
  'CRM einführen, z. B. HubSpot',
  'KI-Tools sicher im Team nutzen',
  'Ansprechpartner bei IT-Fragen',
];

const TOOLS = ['Google Workspace', 'Microsoft 365', 'Power Automate', 'n8n', 'HubSpot', 'Lexware', 'Gemini', 'ChatGPT', 'Claude'];

/* Beispiel-Ablauf, so wie er bei LayerForm selbst läuft */
const FLOW = ['Anfrage kommt rein', 'KI erkennt Kundenmail', 'Lead im CRM', 'Bestätigung an Kunden', 'Aufgabe für Sie'];

export const Automation: React.FC<AutomationProps> = ({ onInquiry }) => (
  <section id="automatisierung" className="relative overflow-hidden">
    <div className="layer-lines pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
    <div className="relative mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <Reveal>
        <span className="inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/10 px-3.5 py-1.5 text-sm font-semibold text-cyan">
          Automatisierung &amp; IT-Service
        </span>
        <h2 className="mt-5 max-w-[16ch] text-4xl font-semibold leading-[1.05] md:text-6xl">
          Abläufe, die von selbst laufen.
        </h2>
        <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-fg-muted">
          Für Start-ups und kleine Unternehmen: Wir automatisieren wiederkehrende Aufgaben, verbinden Ihre Programme und bringen
          KI sinnvoll in den Alltag. Damit Sie Zeit für Kunden und Wachstum haben, statt für Copy-Paste und Zettelwirtschaft.
        </p>
      </Reveal>

      {/* Beispiel-Ablauf */}
      <Reveal delay={0.05}>
        <div className="mt-12 rounded-panel bg-gradient-to-br from-deep to-surface p-6 shadow-[inset_0_1px_0_rgba(255,255,255,.08)] md:p-8">
          <p className="text-sm font-semibold text-fg-muted">So läuft es bei uns selbst, jeden Tag:</p>
          <ol className="mt-5 flex flex-col gap-2 md:flex-row md:items-center md:gap-0">
            {FLOW.map((step, i) => (
              <li key={step} className="flex items-center gap-2 md:flex-1 md:gap-0">
                <span className="flex min-h-[3.25rem] flex-1 items-center gap-3 rounded-media bg-bg/60 px-4 py-3 text-[15px] font-medium leading-snug md:justify-center md:text-center">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-cyan text-xs font-bold text-ink md:hidden">{i + 1}</span>
                  {step}
                </span>
                {i < FLOW.length - 1 && (
                  <ArrowRight size={18} className="hidden shrink-0 text-cyan md:mx-2 md:block" aria-hidden="true" />
                )}
              </li>
            ))}
          </ol>
          <p className="mt-5 text-[15px] leading-relaxed text-fg/75">
            Ohne dass jemand eine Mail abtippt oder eine Liste pflegt. Genau solche Abläufe bauen wir auch für Ihr Unternehmen.
          </p>
        </div>
      </Reveal>

      {/* Einsatzbereiche */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-5">
        {USE_CASES.map(({ icon: Icon, title, text }, i) => (
          <Reveal key={title} delay={0.04 * i}>
            <article className="flex h-full flex-col rounded-panel border border-white/[.07] bg-surface p-7">
              <Icon size={28} className="text-cyan" aria-hidden="true" />
              <h3 className="mt-5 text-xl font-semibold">{title}</h3>
              <p className="mt-2 leading-relaxed text-fg-muted">{text}</p>
            </article>
          </Reveal>
        ))}
      </div>

      {/* Ablauf und IT-Service */}
      <div className="mt-6 grid gap-4 lg:grid-cols-12 md:gap-5">
        <Reveal className="lg:col-span-7">
          <article className="h-full rounded-panel border border-white/[.07] bg-surface p-7 md:p-9">
            <h3 className="text-2xl font-semibold">So arbeiten wir</h3>
            <ol className="mt-6 space-y-5">
              {STEPS.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px] bg-cyan/15 text-sm font-bold text-cyan">{i + 1}</span>
                  <div>
                    <p className="font-semibold">{s.title}</p>
                    <p className="mt-1 leading-relaxed text-fg-muted">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </article>
        </Reveal>

        <Reveal delay={0.06} className="lg:col-span-5">
          <article className="flex h-full flex-col rounded-panel bg-gradient-to-br from-deep to-surface p-7 md:p-9">
            <Desktop size={28} className="text-cyan" aria-hidden="true" />
            <h3 className="mt-5 text-2xl font-semibold">IT-Service</h3>
            <p className="mt-2 leading-relaxed text-fg/75">
              Keine eigene IT-Abteilung? Wir sind Ihr Ansprechpartner für die Technik im Hintergrund.
            </p>
            <ul className="mt-5 space-y-2.5">
              {IT_SERVICES.map((s) => (
                <li key={s} className="flex items-start gap-2.5 leading-snug">
                  <Check size={18} weight="bold" className="mt-0.5 shrink-0 text-cyan" aria-hidden="true" />
                  {s}
                </li>
              ))}
            </ul>
          </article>
        </Reveal>
      </div>

      {/* Werkzeuge und Abschluss */}
      <Reveal delay={0.04}>
        <div className="mt-6 flex flex-col gap-6 rounded-panel border border-white/[.07] bg-surface p-7 md:flex-row md:items-center md:justify-between md:p-9">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-fg-muted">Wir arbeiten mit den Programmen, die Sie schon nutzen:</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {TOOLS.map((t) => (
                <li key={t} className="rounded-full border border-white/10 px-3 py-1.5 text-sm text-fg/85">{t}</li>
              ))}
            </ul>
          </div>
          <div className="shrink-0 md:text-right">
            <button onClick={() => onInquiry('Automatisierung')} className="btn-primary w-full md:w-auto">
              Kostenloses Erstgespräch
            </button>
            <p className="mt-2 text-sm text-fg-muted">30 Minuten, unverbindlich</p>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);
