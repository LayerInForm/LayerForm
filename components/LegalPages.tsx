import React from 'react';
import { CONTACT_EMAIL, CONTACT_PHONE } from '../src/constants';

const LegalLayout: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20 md:py-28 animate-fade-in">
    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-10 text-slate-900">{title}</h1>
    <div className="space-y-8 text-slate-600 leading-relaxed font-normal text-sm md:text-base">
      {children}
    </div>
  </section>
);

export const Impressum: React.FC = () => (
  <LegalLayout title="Impressum">
    <div className="space-y-8 bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm text-slate-700">
      <div>
        <h2 className="text-base font-bold text-[#0096C7] uppercase tracking-wider mb-2">Angaben gemäß § 5 DDG</h2>
        <p className="leading-relaxed text-slate-800 font-medium">
          LayerForm<br />
          Inhaber: Benjamin Ridel<br />
          Ludwig-Bechstein-Weg 25a<br />
          22941 Bargteheide<br />
          Deutschland
        </p>
      </div>

      <div className="border-t border-slate-100 pt-6">
        <h2 className="text-base font-bold text-[#0096C7] uppercase tracking-wider mb-2">Kontakt</h2>
        <p className="leading-relaxed text-slate-800">
          Telefon: <a href={`tel:${CONTACT_PHONE.replace(/\s+/g, '')}`} className="text-[#0096C7] hover:underline">{CONTACT_PHONE}</a><br />
          E-Mail: <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#0096C7] hover:underline">{CONTACT_EMAIL}</a>
        </p>
      </div>

      <div className="border-t border-slate-100 pt-6">
        <h2 className="text-base font-bold text-[#0096C7] uppercase tracking-wider mb-2">Rechtsform</h2>
        <p className="text-slate-800">Kleingewerbe (Einzelunternehmen)</p>
      </div>

      <div className="border-t border-slate-100 pt-6">
        <h2 className="text-base font-bold text-[#0096C7] uppercase tracking-wider mb-2">Umsatzsteuer</h2>
        <p className="text-slate-800">Kleinunternehmer im Sinne von § 19 UStG (Es wird keine Umsatzsteuer ausgewiesen)</p>
      </div>

      <div className="border-t border-slate-100 pt-6">
        <h2 className="text-base font-bold text-[#0096C7] uppercase tracking-wider mb-2">Registereintrag</h2>
        <p className="text-slate-800">Kein Eintrag im Handelsregister</p>
      </div>

      <div className="border-t border-slate-100 pt-6">
        <h2 className="text-base font-bold text-[#0096C7] uppercase tracking-wider mb-2">Verantwortlich für den Inhalt</h2>
        <p className="text-slate-800">Benjamin Ridel<br />Ludwig-Bechstein-Weg 25a<br />22941 Bargteheide</p>
      </div>
    </div>
  </LegalLayout>
);

/* AGB in drei Teilen: Allgemeiner Teil, Teil A (3D-Druck und CAD), Teil B (IT-Service und Automatisierung, nur für Unternehmer) */
type AgbItem = { t: string; c: string[] };
const AGB_TEILE: { titel: string; hinweis?: string; punkte: AgbItem[] }[] = [
  {
    titel: 'Allgemeiner Teil',
    punkte: [
      { t: '§ 1 Geltungsbereich', c: [
        'Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge zwischen LayerForm, Inhaber Benjamin Ridel, Ludwig-Bechstein-Weg 25a, 22941 Bargteheide (nachfolgend „LayerForm“), und seinen Kunden.',
        'Der Allgemeine Teil gilt für alle Leistungen. Ergänzend gilt Teil A für 3D-Druck, CAD-Konstruktion und digitale Dateien sowie Teil B für IT-Service, Beratung und Automatisierung. Bei Widersprüchen gehen die Regelungen in Teil A bzw. Teil B dem Allgemeinen Teil vor.',
        'Verbraucher im Sinne dieser AGB ist jede natürliche Person, die ein Rechtsgeschäft zu Zwecken abschließt, die überwiegend weder ihrer gewerblichen noch ihrer selbständigen beruflichen Tätigkeit zugerechnet werden können (§ 13 BGB). Unternehmer ist jede natürliche oder juristische Person oder rechtsfähige Personengesellschaft, die bei Abschluss des Vertrags in Ausübung ihrer gewerblichen oder selbständigen beruflichen Tätigkeit handelt (§ 14 BGB).',
        'Abweichende oder ergänzende Geschäftsbedingungen des Kunden werden nicht Vertragsbestandteil, es sei denn, LayerForm stimmt ihrer Geltung ausdrücklich in Textform zu.',
      ] },
      { t: '§ 2 Angebot und Vertragsschluss', c: [
        'Darstellungen auf der Website, in Anzeigen oder in sozialen Medien sind kein rechtlich bindendes Angebot. Anfragen des Kunden sind unverbindlich.',
        'Ein Vertrag kommt zustande, wenn der Kunde ein Angebot von LayerForm annimmt (z. B. per E-Mail oder WhatsApp) oder LayerForm einen Auftrag in Textform bestätigt. Maßgeblich für den Leistungsumfang ist das jeweilige Angebot bzw. die darin enthaltene Leistungsbeschreibung.',
      ] },
      { t: '§ 3 Preise und Zahlung', c: [
        'LayerForm ist Kleinunternehmer im Sinne von § 19 UStG. Alle Preise sind Endpreise; Umsatzsteuer wird nicht ausgewiesen.',
        'Zahlung ist per Überweisung, PayPal oder bei Abholung in bar möglich. Rechnungen sind, sofern nichts anderes vereinbart ist, innerhalb von 14 Tagen ohne Abzug fällig. Für einzelne Leistungen gelten die Zahlungsregeln in Teil A und Teil B.',
      ] },
      { t: '§ 4 Haftung', c: [
        'LayerForm haftet unbeschränkt bei Vorsatz und grober Fahrlässigkeit, bei schuldhafter Verletzung des Lebens, des Körpers oder der Gesundheit, nach dem Produkthaftungsgesetz sowie im Umfang einer ausdrücklich übernommenen Garantie.',
        'Bei leicht fahrlässiger Verletzung einer wesentlichen Vertragspflicht (einer Pflicht, deren Erfüllung die ordnungsgemäße Durchführung des Vertrags überhaupt erst ermöglicht und auf deren Einhaltung der Kunde regelmäßig vertrauen darf) ist die Haftung auf den vertragstypischen, bei Vertragsschluss vorhersehbaren Schaden begrenzt. Im Übrigen ist die Haftung für leichte Fahrlässigkeit ausgeschlossen.',
        'Für Unternehmer gelten im Bereich IT-Service und Automatisierung zusätzlich die Regelungen in Teil B.',
      ] },
      { t: '§ 5 Datenschutz', c: [
        'LayerForm verarbeitet personenbezogene Daten ausschließlich zur Durchführung des Vertrags und nach Maßgabe der Datenschutzerklärung auf www.layer-form.de.',
      ] },
      { t: '§ 6 Schlussbestimmungen', c: [
        'Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts. Gegenüber Verbrauchern gilt diese Rechtswahl nur, soweit dadurch nicht zwingende Schutzvorschriften des Staates ihres gewöhnlichen Aufenthalts entzogen werden.',
        'Ist der Kunde Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen, ist Gerichtsstand für alle Streitigkeiten der Sitz von LayerForm.',
        'Sollte eine Bestimmung dieser AGB unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.',
      ] },
    ],
  },
  {
    titel: 'Teil A: 3D-Druck, CAD-Konstruktion und digitale Dateien',
    punkte: [
      { t: 'A 1 Individuelle Anfertigungen', c: [
        'Produkte werden überwiegend individuell nach den Angaben des Kunden gefertigt. Der Kunde prüft Daten, Maße, Material und Farbe vor der Freigabe sorgfältig.',
        'Stellt der Kunde Dateien, Vorlagen, Logos oder Muster bereit, versichert er, dass er zu deren Nutzung berechtigt ist und keine Rechte Dritter verletzt werden. Er stellt LayerForm von Ansprüchen Dritter frei, die auf einer solchen Rechtsverletzung beruhen.',
      ] },
      { t: 'A 2 Zahlung und Produktion', c: [
        'Sofern nichts anderes vereinbart ist, wird die Rechnung nach der Auftragsbestätigung gestellt. Die Produktion beginnt nach Zahlungseingang.',
      ] },
      { t: 'A 3 Lieferung und Versand', c: [
        'Der Versand erfolgt innerhalb Deutschlands. Nach Absprache ist eine Abholung in Bargteheide möglich. Liefertermine sind unverbindlich, sofern sie nicht ausdrücklich in Textform als verbindlich zugesagt wurden.',
        'Ist der Kunde Unternehmer, geht die Gefahr mit Übergabe der Ware an das Versandunternehmen auf ihn über.',
      ] },
      { t: 'A 4 Widerrufsrecht', c: [
        'Bei Waren, die nach Kundenspezifikation angefertigt oder eindeutig auf die persönlichen Bedürfnisse zugeschnitten sind, besteht kein Widerrufsrecht (§ 312g Abs. 2 Nr. 1 BGB). Dies betrifft den überwiegenden Teil der angebotenen Leistungen.',
      ] },
      { t: 'A 5 Gewährleistung', c: [
        'Es gelten die gesetzlichen Mängelrechte. Fertigungstypische Merkmale des 3D-Drucks, insbesondere sichtbare Schichtlinien, leichte Farb- und Maßabweichungen im Rahmen üblicher Toleranzen sowie Spuren von Stützstrukturen, stellen keinen Mangel dar.',
        'Gegenüber Unternehmern beträgt die Verjährungsfrist für Mängelansprüche ein Jahr ab Ablieferung. Unternehmer haben offensichtliche Mängel unverzüglich, spätestens innerhalb von 7 Tagen nach Erhalt, in Textform anzuzeigen (§ 377 HGB bleibt unberührt).',
      ] },
      { t: 'A 6 CAD-Dateien und digitale Inhalte', c: [
        'Erstellte CAD- und Druckdateien darf der Kunde für den vereinbarten Zweck nutzen. Eine Weitergabe oder ein Weiterverkauf der Dateien ist nur mit ausdrücklicher Zustimmung von LayerForm gestattet, sofern nichts anderes vereinbart ist.',
      ] },
    ],
  },
  {
    titel: 'Teil B: IT-Service, Beratung und Automatisierung',
    hinweis: 'Leistungen nach Teil B erbringt LayerForm ausschließlich gegenüber Unternehmern im Sinne von § 14 BGB.',
    punkte: [
      { t: 'B 1 Leistungsumfang und Vertragsart', c: [
        'LayerForm erbringt Beratung, IT-Service und die Einrichtung von Automatisierungen (z. B. Workflows, Schnittstellen zwischen Programmen, CRM-Einrichtung, Einführung von KI-Werkzeugen) sowie deren laufende Betreuung.',
        'Ziele, Maßnahmen und Umfang werden vor Beginn im Angebot bzw. in einer Leistungsbeschreibung festgelegt. Nach der Umsetzung erhält der Kunde eine Beschreibung der umgesetzten Lösung und ihrer Funktionsweise.',
        'Die Leistungen werden als Dienstleistungen im Sinne der §§ 611 ff. BGB erbracht. LayerForm schuldet die fachgerechte Durchführung der vereinbarten Tätigkeiten, jedoch keinen bestimmten wirtschaftlichen oder technischen Erfolg, insbesondere keine bestimmte Zeitersparnis, Umsatzsteigerung oder dauerhafte Funktionsfähigkeit in Systemen Dritter. Eine Erfolgshaftung oder Mängelhaftung nach Werkvertragsrecht besteht nicht, sofern nicht ausdrücklich in Textform etwas anderes vereinbart ist.',
      ] },
      { t: 'B 2 Mitwirkung des Kunden', c: [
        'Der Kunde stellt rechtzeitig und kostenfrei alle für die Leistung erforderlichen Informationen, Zugänge, Berechtigungen und Ansprechpartner zur Verfügung und benennt einen verantwortlichen Ansprechpartner.',
        'Der Kunde ist für die regelmäßige Sicherung seiner Daten selbst verantwortlich, insbesondere vor Beginn von Arbeiten an seinen Systemen.',
        'Verzögerungen oder Mehraufwand, die auf fehlender oder verspäteter Mitwirkung beruhen, gehen nicht zulasten von LayerForm; Mehraufwand wird nach Zeitaufwand berechnet.',
      ] },
      { t: 'B 3 Übergabe und Freigabe', c: [
        'Nach Abschluss einer Umsetzung übergibt LayerForm die Lösung mit Beschreibung an den Kunden. Der Kunde prüft die Lösung innerhalb von 7 Tagen. Hinweise, die innerhalb dieser Frist in Textform eingehen und den vereinbarten Leistungsumfang betreffen, berücksichtigt LayerForm im Rahmen des Auftrags.',
        'Nach Ablauf dieser Frist oder mit Nutzung der Lösung im laufenden Betrieb gilt die Leistung als vollständig erbracht. Spätere Anpassungen, Erweiterungen oder Fehlerbehebungen sind gesondert zu beauftragen und werden nach Aufwand berechnet, sofern sie nicht in einer vereinbarten Betreuung enthalten sind.',
        'Der Betrieb, die Prüfung der Ergebnisse im Alltag und die Entscheidung über den Einsatz der Lösung liegen beim Kunden.',
      ] },
      { t: 'B 4 Programme und Dienste Dritter', c: [
        'Lösungen von LayerForm nutzen Software und Dienste Dritter (z. B. Google Workspace, Microsoft 365, HubSpot, n8n, Lexware oder KI-Dienste). Für deren Verfügbarkeit, Funktionsweise, Preise, Datenverarbeitung und Änderungen (z. B. an Schnittstellen) ist LayerForm nicht verantwortlich. Lizenz- und Nutzungskosten für solche Dienste trägt der Kunde.',
        'Ergebnisse von KI-Werkzeugen können fehlerhaft sein. Der Kunde ist verpflichtet, solche Ergebnisse vor ihrer Verwendung zu prüfen.',
      ] },
      { t: 'B 5 Vergütung und Abrechnung', c: [
        'Die Vergütung richtet sich nach dem Angebot. Umsetzungen werden je Umsetzung nach Übergabe oder nach vereinbarten Teilschritten abgerechnet. Laufende Betreuung wird monatlich abgerechnet.',
        'Leistungen außerhalb des vereinbarten Umfangs werden nach Zeitaufwand zum jeweils vereinbarten Stundensatz berechnet.',
      ] },
      { t: 'B 6 Laufende Betreuung', c: [
        'Ein Betreuungsvertrag läuft auf unbestimmte Zeit, sofern nichts anderes vereinbart ist, und kann von beiden Seiten mit einer Frist von einem Monat zum Monatsende in Textform gekündigt werden. Das Recht zur außerordentlichen Kündigung bleibt unberührt.',
        'Der Umfang der Betreuung (z. B. enthaltene Stunden, Reaktionszeiten) ergibt sich aus dem Angebot. Nicht genutzte Stunden verfallen am Monatsende, sofern nichts anderes vereinbart ist.',
      ] },
      { t: 'B 7 Haftung', c: [
        'Ergänzend zu § 4 gilt für Leistungen nach Teil B: Bei leichter Fahrlässigkeit haftet LayerForm nur bei Verletzung wesentlicher Vertragspflichten und der Höhe nach begrenzt auf die Vergütung des betroffenen Auftrags, bei laufender Betreuung auf die Vergütung der letzten drei Monate.',
        'Soweit gesetzlich zulässig, ist die Haftung ausgeschlossen für entgangenen Gewinn, mittelbare Schäden und Folgeschäden, für Schäden durch Ausfälle oder Änderungen von Diensten Dritter sowie für den Verlust von Daten, soweit dieser durch eine ordnungsgemäße Datensicherung des Kunden vermeidbar gewesen wäre.',
        'Ansprüche des Kunden verjähren innerhalb eines Jahres ab Erbringung der jeweiligen Leistung.',
        'Die Haftung bei Vorsatz und grober Fahrlässigkeit, bei Verletzung des Lebens, des Körpers oder der Gesundheit, nach dem Produkthaftungsgesetz und aus einer Garantie bleibt unberührt.',
      ] },
      { t: 'B 8 Nutzungsrechte', c: [
        'Der Kunde erhält an den für ihn erstellten Lösungen ein zeitlich unbegrenztes, nicht übertragbares Recht zur Nutzung im eigenen Unternehmen, sobald die vereinbarte Vergütung vollständig bezahlt ist. LayerForm darf allgemeine Methoden, Vorlagen und Bausteine, die keine vertraulichen Informationen des Kunden enthalten, weiterverwenden.',
      ] },
      { t: 'B 9 Datenschutz und Vertraulichkeit', c: [
        'Soweit LayerForm im Auftrag des Kunden personenbezogene Daten verarbeitet, schließen die Parteien einen Vertrag über die Auftragsverarbeitung nach Art. 28 DSGVO.',
        'Beide Parteien behandeln vertrauliche Informationen der jeweils anderen Partei, insbesondere Zugangsdaten und Geschäftsgeheimnisse, vertraulich. Zugangsdaten werden nur für die Durchführung des Auftrags verwendet. Der Kunde sollte Zugänge nach Abschluss des Auftrags ändern oder entziehen.',
      ] },
      { t: 'B 10 Referenzen', c: [
        'LayerForm darf den Kunden mit Firmennamen und Logo als Referenz nennen, sofern der Kunde dem nicht in Textform widerspricht.',
      ] },
    ],
  },
];

export const AGB: React.FC = () => (
  <LegalLayout title="Allgemeine Geschäftsbedingungen">
    <div className="space-y-12">
      {AGB_TEILE.map((teil) => (
        <section key={teil.titel} className="space-y-8 bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm text-slate-700">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{teil.titel}</h2>
            {teil.hinweis && <p className="mt-2 text-sm font-semibold text-slate-700">{teil.hinweis}</p>}
          </div>
          {teil.punkte.map((item) => (
            <div key={item.t} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
              <h3 className="text-base font-bold text-[#0096C7] mb-2">{item.t}</h3>
              {item.c.map((absatz, k) => (
                <p key={k} className="leading-relaxed text-slate-700 text-sm mt-2 first:mt-0">{absatz}</p>
              ))}
            </div>
          ))}
        </section>
      ))}
      <p className="text-sm text-slate-500">Stand: Oktober 2026</p>
    </div>
  </LegalLayout>
);

export const Datenschutz: React.FC = () => (
  <LegalLayout title="Datenschutzerklärung">
    <div className="space-y-8 bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm text-slate-700">
      {[
        { t: "1. Verantwortlicher", c: `Verantwortlicher im Sinne der DSGVO ist: Benjamin Ridel, LayerForm, Ludwig-Bechstein-Weg 25a, 22941 Bargteheide. E-Mail: ${CONTACT_EMAIL}` },
        { t: "2. Zugriffsdaten", c: "Beim Besuch der Website werden automatisch folgende Daten erhoben: IP-Adresse, Datum und Uhrzeit des Zugriffs, Browsertyp und Version, Betriebssystem. Diese Daten dienen ausschließlich der technischen Bereitstellung der Website." },
        { t: "3. Anfrageformular und Preisrechner", c: "Wenn Sie uns über das Anfrageformular oder den Preisrechner kontaktieren, werden Ihre Angaben (z. B. Name, Kontaktdaten, Projektbeschreibung, Dateien) per E-Mail über den Versanddienstleister Resend (Resend, Inc., USA) an uns übermittelt und zur Bearbeitung der Anfrage in unserem E-Mail-Postfach (Google Workspace) sowie in unserer Kundenverwaltung HubSpot (HubSpot Ireland Ltd., Datenspeicherung in der EU) gespeichert. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Durchführung vorvertraglicher Maßnahmen). Die Daten werden gelöscht, sobald sie für die Bearbeitung nicht mehr erforderlich sind und keine gesetzlichen Aufbewahrungspflichten bestehen." },
        { t: "4. E-Mail-Kontakt", c: "Bei Kontaktaufnahme per E-Mail werden die übermittelten personenbezogenen Daten gespeichert, um die Anfrage zu bearbeiten." },
        { t: "5. Cookies", c: "Die Website verwendet derzeit nur technisch notwendige Cookies. Tracking- oder Marketing-Cookies werden aktuell nicht eingesetzt." },
        { t: "6. Zahlungsanbieter", c: "Bei Nutzung externer Zahlungsdienste (z. B. PayPal oder Stripe) gelten die Datenschutzbestimmungen der jeweiligen Anbieter." },
        { t: "7. Social Media", c: "LayerForm unterhält Profile auf Plattformen wie Instagram, TikTok, Etsy und eBay Kleinanzeigen. Beim Besuch dieser Seiten gelten die Datenschutzbestimmungen der jeweiligen Plattformbetreiber." },
        { t: "8. Rechte der betroffenen Personen", c: `Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Anfragen richten Sie bitte an: ${CONTACT_EMAIL}` },
        { t: "9. Änderung der Datenschutzerklärung", c: "Diese Datenschutzerklärung kann angepasst werden, um rechtlichen Anforderungen zu entsprechen." }
      ].map((item, i) => (
        <div key={i} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
          <h3 className="text-base font-bold text-[#0096C7] mb-2">{item.t}</h3>
          <p className="leading-relaxed text-slate-700 text-sm">{item.c}</p>
        </div>
      ))}
    </div>
  </LegalLayout>
);
