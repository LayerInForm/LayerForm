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
        'Verbrauchern steht ein Widerrufsrecht nach Maßgabe der Widerrufsbelehrung zu. Bei Waren, die nach Kundenspezifikation angefertigt oder eindeutig auf die persönlichen Bedürfnisse zugeschnitten sind, besteht kein Widerrufsrecht (§ 312g Abs. 2 Nr. 1 BGB). Dies betrifft den überwiegenden Teil der angebotenen Leistungen.',
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
        { t: "1. Verantwortlicher", c: "LayerForm, Inhaber Benjamin Ridel, Ludwig-Bechstein-Weg 25a, 22941 Bargteheide, Deutschland. E-Mail: info@layer-form.de, Telefon: +49 176 85922649." },
        { t: "2. Hosting und Server-Logdateien", c: "Die Website wird bei Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA, gehostet. Beim Aufruf werden technisch notwendige Daten verarbeitet: IP-Adresse, Datum und Uhrzeit, aufgerufene Seite, Browser und Betriebssystem. Diese Daten dienen der sicheren und stabilen Bereitstellung der Website. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem sicheren Betrieb). Vercel ist unter dem EU-US Data Privacy Framework zertifiziert; zusätzlich besteht ein Auftragsverarbeitungsvertrag." },
        { t: "3. Besucherstatistik ohne Cookies", c: "Wir nutzen Vercel Web Analytics, um zu verstehen, wie die Website genutzt wird (z. B. aufgerufene Seiten, Herkunftsseite, Gerätetyp, Land). Es werden keine Cookies gesetzt und keine Nutzerprofile über verschiedene Websites erstellt; Besucher werden nicht persönlich identifiziert. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Verbesserung unseres Angebots)." },
        { t: "4. Cookies und Schriftarten", c: "Die Website setzt keine Cookies zu Analyse- oder Werbezwecken. Schriftarten werden von unserem eigenen Server geladen; es findet keine Verbindung zu Google Fonts statt." },
        { t: "5. Anfrageformular", c: "Wenn Sie das Anfrageformular nutzen, verarbeiten wir Ihre Angaben: Vor- und Nachname, E-Mail-Adresse, optional Telefonnummer, Firma und Adresse, Ihre Nachricht sowie Angaben zu Stückzahl, Termin, Filament und Farbe. Zweck ist die Bearbeitung Ihrer Anfrage und die Erstellung eines Angebots. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen). Dabei setzen wir folgende Dienstleister ein: Resend (Resend, Inc., USA) für den Versand der Anfrage an uns und einer Eingangsbestätigung an Sie per E-Mail, auf Grundlage von Standardvertragsklauseln bzw. des EU-US Data Privacy Framework; HubSpot (HubSpot Ireland Ltd., One Sir John Rogerson’s Quay, Dublin 2, Irland) zur Speicherung Ihrer Anfrage in unserer Kundenverwaltung, wobei eine Verarbeitung durch die US-Muttergesellschaft auf Grundlage des EU-US Data Privacy Framework bzw. von Standardvertragsklauseln möglich ist; Google Workspace (Google Cloud EMEA Ltd., Dublin, Irland) für Empfang und Bearbeitung der E-Mails in unserem Postfach. Wählen Sie im Formular den Versand per WhatsApp, wird die Nachricht in Ihrer WhatsApp-App vorbereitet und erst durch Sie selbst gesendet (siehe Nr. 6)." },
        { t: "6. Kontakt per E-Mail, Telefon und WhatsApp", c: "Wenn Sie uns per E-Mail, Telefon oder WhatsApp kontaktieren, verarbeiten wir Ihre Angaben zur Bearbeitung Ihres Anliegens (Art. 6 Abs. 1 lit. b DSGVO, sonst lit. f DSGVO). Für WhatsApp nutzen wir WhatsApp Business der WhatsApp Ireland Ltd., Merrion Road, Dublin 4, Irland (Meta). Dabei werden Ihre Telefonnummer, Ihr Profilname und Ihre Nachrichten verarbeitet; Meta kann Daten auch in den USA verarbeiten. Erste Fragen beantwortet ein KI-Assistent von Meta, der sich als solcher zu erkennen gibt; konkrete Angebote erstellen wir persönlich. Wenn Sie das nicht möchten, schreiben Sie uns bitte per E-Mail." },
        { t: "7. Angebote, Aufträge und Rechnungen", c: "Zur Durchführung von Aufträgen verarbeiten wir Name, Anschrift, E-Mail, Auftragsdaten und Zahlungsinformationen (Art. 6 Abs. 1 lit. b DSGVO). Rechnungen erstellen und versenden wir mit Lexware Office der Haufe-Lexware GmbH & Co. KG, Munzinger Straße 9, 79111 Freiburg. Für den Versand geben wir Name und Anschrift an DHL (Deutsche Post AG, Bonn) weiter. Zahlen Sie per PayPal, verarbeitet PayPal (Europe) S.à r.l. et Cie, S.C.A., Luxemburg, Ihre Zahlungsdaten in eigener Verantwortung. Rechnungen und Buchungsbelege bewahren wir nach den gesetzlichen Fristen auf (Art. 6 Abs. 1 lit. c DSGVO in Verbindung mit § 147 AO und § 257 HGB)." },
        { t: "8. IT-Service und Automatisierung", c: "Verarbeiten wir im Rahmen von IT- oder Automatisierungsaufträgen personenbezogene Daten unserer Kunden, geschieht dies als Auftragsverarbeiter auf Grundlage eines Vertrags nach Art. 28 DSGVO. Verantwortlich für diese Daten bleibt der Kunde." },
        { t: "9. Unsere Profile auf anderen Plattformen", c: "Auf der Website verlinken wir auf unsere Profile bei Instagram, TikTok, Etsy und Kleinanzeigen. Es handelt sich um einfache Links, nicht um eingebettete Inhalte; Daten werden erst übertragen, wenn Sie einen Link anklicken. Auf den Plattformen gelten deren Datenschutzbestimmungen." },
        { t: "10. Speicherdauer", c: "Wir speichern Daten nur so lange, wie es für den jeweiligen Zweck nötig ist. Anfragen ohne Auftrag löschen wir spätestens zwei Jahre nach dem letzten Kontakt. Daten mit gesetzlicher Aufbewahrungspflicht löschen wir nach Ablauf dieser Frist." },
        { t: "11. Ihre Rechte", c: "Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch gegen Verarbeitungen auf Grundlage berechtigter Interessen (Art. 21). Eine erteilte Einwilligung können Sie jederzeit für die Zukunft widerrufen. Eine Nachricht an info@layer-form.de genügt. Sie haben außerdem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Zuständig für uns ist das Unabhängige Landeszentrum für Datenschutz Schleswig-Holstein (ULD), Holstenstraße 98, 24103 Kiel." },
        { t: "12. Pflicht zur Bereitstellung, automatisierte Entscheidungen, Verschlüsselung", c: "Für eine Anfrage benötigen wir mindestens Ihren Namen und eine Kontaktmöglichkeit; ohne diese Angaben können wir nicht antworten. Eine automatisierte Entscheidungsfindung einschließlich Profiling findet nicht statt. Die Website wird verschlüsselt über HTTPS übertragen." },
        { t: "13. Änderungen", c: "Wir passen diese Erklärung an, wenn sich unsere Dienste oder die Rechtslage ändern. Stand: Oktober 2026." }
      ].map((item, i) => (
        <div key={i} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
          <h3 className="text-base font-bold text-[#0096C7] mb-2">{item.t}</h3>
          <p className="leading-relaxed text-slate-700 text-sm">{item.c}</p>
        </div>
      ))}
    </div>
  </LegalLayout>
);
