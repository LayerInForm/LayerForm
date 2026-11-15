import React from 'react';
import { ConsultationHub } from './ConsultationHub';
import { ServiceLinks } from './ServicePage';
import { BUSINESS_ADDRESS, CONTACT_EMAIL, CONTACT_PHONE } from '../src/constants';

export function ContactPage({ onInquiry }: { onInquiry: () => void }) {
  return <article className="pt-28 md:pt-36">
    <div className="mx-auto max-w-7xl px-5 md:px-8">
      <nav aria-label="Brotkrumennavigation" className="mb-8 text-sm text-fg-muted"><a href="/" className="hover:text-cyan">Startseite</a><span aria-hidden="true"> / </span><span aria-current="page">Kontakt</span></nav>
      <p className="text-xs font-semibold uppercase tracking-[.18em] text-cyan">LayerForm / Bargteheide</p>
      <h1 className="mt-5 max-w-4xl text-[clamp(2.5rem,5vw,4.75rem)] font-semibold leading-[1.05] tracking-tight">Ihr Kontakt für 3D-Druck, CAD und Automatisierung.</h1>
      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-fg-muted">Sie möchten ein Ersatzteil fertigen lassen, eine Idee konstruieren oder einen Büroablauf vereinfachen? LayerForm in Bargteheide ist für Unternehmen und Privatkunden erreichbar. Beschreiben Sie Ihr Vorhaben über das Anfrageformular, per E-Mail, Telefon oder WhatsApp.</p>
      <div className="mt-12 grid gap-10 border-t border-white/10 pt-10 lg:grid-cols-2">
        <section aria-labelledby="projekt-vorbereiten">
          <h2 id="projekt-vorbereiten" className="text-2xl font-semibold">Was hilft bei der ersten Einschätzung?</h2>
          <p className="mt-4 max-w-[65ch] leading-relaxed text-fg-muted">Für <a href="/3d-druck" className="text-cyan underline underline-offset-4">3D-Druck</a> oder <a href="/cad-konstruktion" className="text-cyan underline underline-offset-4">CAD-Konstruktion</a> helfen Fotos, eine bemaßte Skizze oder eine vorhandene Datei. Nennen Sie die Funktion, wichtige Maße, Stückzahl und Ihren Wunschtermin. Wenn das Material noch offen ist, beschreiben Sie Belastung und Einsatzort.</p>
          <p className="mt-4 max-w-[65ch] leading-relaxed text-fg-muted">Bei einer <a href="/automatisierung" className="text-cyan underline underline-offset-4">Prozessautomatisierung</a> beginnen wir mit dem heutigen Ablauf: Welche Programme verwenden Sie, welche Angaben übertragen Sie mehrfach und welches Ergebnis wünschen Sie sich? Offene Fragen klären wir vor einem individuellen Angebot.</p>
          <p className="mt-4 leading-relaxed text-fg-muted">Eine vollständige technische Zeichnung ist für die erste Kontaktaufnahme nicht erforderlich. Preis und Termin hängen vom konkreten Projekt ab und werden vor der Umsetzung abgestimmt.</p>
        </section>
        <section aria-labelledby="standort-abholung">
          <h2 id="standort-abholung" className="text-2xl font-semibold">Standort, Abholung und Versand</h2>
          <address className="mt-4 not-italic leading-relaxed text-fg-muted">LayerForm · Inhaber Benjamin Ridel<br />{BUSINESS_ADDRESS.streetAddress}<br />{BUSINESS_ADDRESS.postalCode} {BUSINESS_ADDRESS.addressLocality}, {BUSINESS_ADDRESS.addressRegion}<br /><a href={'mailto:' + CONTACT_EMAIL} className="mt-3 inline-block text-cyan underline underline-offset-4">{CONTACT_EMAIL}</a><br /><a href="tel:+4917685922649" className="text-cyan underline underline-offset-4">{CONTACT_PHONE}</a></address>
          <p className="mt-4 max-w-[65ch] leading-relaxed text-fg-muted">Fertige Druckteile können nach Absprache in Bargteheide abgeholt oder innerhalb Deutschlands versendet werden. Bitte vereinbaren Sie eine Abholung vorab. Die Abstimmung zu CAD- und Automatisierungsprojekten ist auch aus der Ferne möglich.</p>
          <p className="mt-4 text-sm leading-relaxed text-fg-muted">Angaben zum Anbieter finden Sie im <a href="/impressum" className="underline underline-offset-4 hover:text-cyan">Impressum</a>. Hinweise zur Verarbeitung Ihrer Anfrage stehen in der <a href="/datenschutz" className="underline underline-offset-4 hover:text-cyan">Datenschutzerklärung</a>.</p>
        </section>
      </div>
    </div>
    <ConsultationHub onInquiryClick={onInquiry} />
    <ServiceLinks />
  </article>;
}
