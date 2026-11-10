import React from 'react';
import { SERVICE_PAGES } from '../src/seo';
import { CONTACT_EMAIL, CONTACT_PHONE, WHATSAPP_LINK } from '../src/constants';

export function ServiceLinks() {
  return <nav aria-label="Leistungen im Detail" className="mx-auto max-w-7xl px-5 py-12 md:px-8">
    <h2 className="text-2xl font-semibold">Was möchten Sie umsetzen?</h2>
    <div className="mt-5 flex flex-wrap gap-3">{SERVICE_PAGES.map(page => <a key={page.path} href={page.path} className="btn-ghost">{page.name} <span aria-hidden="true">↗</span></a>)}</div>
  </nav>;
}

export function ServicePage({ page, onInquiry }: { page: typeof SERVICE_PAGES[number]; onInquiry: (topic: string) => void }) {
  return <article className="mx-auto max-w-7xl px-5 pb-16 pt-28 md:px-8 md:pt-36">
    <nav aria-label="Brotkrumennavigation" className="mb-8 text-sm text-fg-muted"><a href="/" className="hover:text-cyan">Startseite</a><span aria-hidden="true"> / </span><span aria-current="page">{page.name}</span></nav>
    <div className="grid items-start gap-10 lg:grid-cols-[1.3fr_1fr]">
      <div><p className="text-xs font-semibold uppercase tracking-[.18em] text-cyan">LayerForm / Bargteheide</p>
        <h1 className="mt-5 text-[clamp(2.5rem,5vw,4.75rem)] font-semibold leading-[1.05] tracking-tight">{page.heading}</h1>
        <p className="mt-6 max-w-[65ch] text-lg leading-relaxed text-fg-muted">{page.intro}</p>
        <a href={'/anfrage?thema=' + encodeURIComponent(page.topic)} onClick={event => { if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) { event.preventDefault(); onInquiry(page.topic); } }} className="btn-primary mt-7">{page.topic === 'Automatisierung' ? 'Erstgespräch anfragen' : 'Projekt und Angebot anfragen'} <span aria-hidden="true">↗</span></a>
      </div>
      {page.topic !== 'Automatisierung' && <figure><img src={page.image} alt={page.alt} width={1200} height={900} fetchPriority="high" className="aspect-[4/3] w-full rounded-panel object-cover" /><figcaption className="mt-3 text-sm text-fg-muted">Projektbeispiel aus der Arbeit von LayerForm</figcaption></figure>}
    </div>
    <div className="mt-16 grid gap-10 border-t border-white/10 pt-12 lg:grid-cols-[1.5fr_1fr]">
      <div className="space-y-10">{page.sections.map(([heading, text]) => <section key={heading}><h2 className="text-2xl font-semibold">{heading}</h2><p className="mt-3 max-w-[70ch] leading-relaxed text-fg-muted">{text}</p></section>)}</div>
      <aside className="h-fit rounded-panel border border-white/10 bg-surface p-6 md:p-8"><h2 className="text-xl font-semibold">Das hilft bei Ihrer Anfrage</h2><ul className="mt-5 list-disc space-y-3 pl-5 text-fg-muted">{page.checklist.map(text => <li key={text}>{text}</li>)}</ul><p className="mt-6 leading-relaxed text-fg-muted">Noch nicht alle Angaben vorhanden? Beschreiben Sie zunächst Ihr Vorhaben. Die offenen Punkte klären wir gemeinsam.</p></aside>
    </div>
    <section className="mt-16 border-t border-white/10 pt-12"><h2 className="text-3xl font-semibold">Häufige Fragen zu {page.name}</h2><div className="mt-6 max-w-3xl divide-y divide-white/10">{page.faqs.map(([question, answer]) => <details key={question} className="py-5"><summary className="cursor-pointer text-lg font-semibold">{question}</summary><p className="mt-3 leading-relaxed text-fg-muted">{answer}</p></details>)}</div></section>
    <section className="mt-14 rounded-panel bg-surface p-7 md:p-10"><h2 className="text-2xl font-semibold">Besprechen wir Ihr Vorhaben.</h2><p className="mt-3 max-w-2xl leading-relaxed text-fg-muted">Sie sprechen direkt mit LayerForm in Bargteheide. Beschreiben Sie, was Sie brauchen – wir klären Machbarkeit, Umfang und die nächsten Schritte.</p><div className="mt-6 flex flex-wrap gap-4"><button onClick={() => onInquiry(page.topic)} className="btn-primary">Projekt anfragen</button><a href={WHATSAPP_LINK} className="btn-ghost">WhatsApp</a><a href={'mailto:' + CONTACT_EMAIL} className="btn-ghost">{CONTACT_EMAIL}</a><a href="tel:+4917685922649" className="btn-ghost">{CONTACT_PHONE}</a></div></section>
    <ServiceLinks />
  </article>;
}
