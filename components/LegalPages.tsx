
import React from 'react';

const LegalLayout: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="max-w-3xl mx-auto px-6 py-16 md:py-24">
    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-12 text-[#1d1d1f]">{title}</h1>
    <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed space-y-8">
      {children}
    </div>
  </section>
);

export const Impressum: React.FC = () => (
  <LegalLayout title="Impressum">
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Angaben gemäß § 5 TMG</h2>
        <p>
          LayerForm<br />
          Inhaber: Benjamin Ridel<br />
          Ludwig-Bechstein-Weg 25a<br />
          22941 Bargteheide<br />
          Deutschland
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Kontakt</h2>
        <p>
          Telefon: +49 155 65994781<br />
          E-Mail: <a href="mailto:layerform@web.de" className="text-blue-600 hover:underline">layerform@web.de</a>
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Rechtsform</h2>
        <p>Kleingewerbe (Einzelunternehmen)</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Umsatzsteuer</h2>
        <p>Kleinunternehmer im Sinne von § 19 UStG (Es wird keine Umsatzsteuer ausgewiesen)</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Registereintrag</h2>
        <p>Kein Eintrag im Handelsregister</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
        <p>Benjamin Ridel<br />Ludwig-Bechstein-Weg 25a<br />22941 Bargteheide</p>
      </div>
    </div>
  </LegalLayout>
);

export const AGB: React.FC = () => (
  <LegalLayout title="Allgemeine Geschäftsbedingungen">
    <div className="space-y-8">
      {[
        { t: "1. Geltungsbereich", c: "Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge zwischen LayerForm, Inhaber Benjamin Ridel, und seinen Kunden über den Verkauf von Waren, individuellen 3D-Druckerzeugnissen, CAD-Dienstleistungen sowie digitalen Dateien (STL-Dateien), die über die Website, per E-Mail oder über andere Kommunikationswege geschlossen werden." },
        { t: "2. Angebot und Vertragsschluss", c: "Die Darstellung der Produkte stellt kein rechtlich bindendes Angebot dar. Ein Vertrag kommt erst durch eine ausdrückliche Auftragsbestätigung oder durch Ausführung der Bestellung zustande." },
        { t: "3. Individuelle Anfertigungen", c: "Ein Großteil der Produkte wird individuell nach Kundenspezifikation gefertigt. Der Kunde ist verpflichtet, die übermittelten Daten, Maße und Angaben vor Produktionsfreigabe sorgfältig zu prüfen." },
        { t: "4. Preise und Zahlung", c: "Alle Preise sind Endpreise gemäß § 19 UStG (Kleinunternehmerregelung) und enthalten keine Umsatzsteuer. Akzeptierte Zahlungsmethoden: PayPal, Überweisung, Stripe, Barzahlung bei Abholung. Die Zahlung ist – sofern nicht anders vereinbart – vor Produktionsbeginn fällig." },
        { t: "5. Lieferung und Versand", c: "Der Versand erfolgt ausschließlich innerhalb Deutschlands. Lieferzeiten sind unverbindlich, sofern nicht ausdrücklich schriftlich zugesichert." },
        { t: "6. Widerrufsrecht", c: "Ein Widerrufsrecht besteht nicht, da die angebotenen Produkte überwiegend individuell nach Kundenwunsch gefertigt werden (§ 312g Abs. 2 Nr. 1 BGB). Ausnahme: Bei Transportschäden oder mangelhaften Produkten besteht ein Anspruch auf Nachbesserung oder Ersatzlieferung." },
        { t: "7. Gewährleistung", c: "Es gelten die gesetzlichen Gewährleistungsrechte. Material- und fertigungstypische Abweichungen (z. B. leichte Farbunterschiede, sichtbare Schichtlinien) stellen keinen Mangel dar." },
        { t: "8. Haftung", c: "LayerForm haftet nur für Schäden, die auf vorsätzlicher oder grob fahrlässiger Pflichtverletzung beruhen. Bei einfacher Fahrlässigkeit wird nur für die Verletzung wesentlicher Vertragspflichten gehaftet." },
        { t: "9. Digitale Inhalte (STL-Dateien)", c: "Digitale Dateien sind vom Umtausch ausgeschlossen. Eine Weitergabe, Vervielfältigung oder der Weiterverkauf der Dateien ist ohne ausdrückliche Genehmigung nicht gestattet." },
        { t: "10. Schlussbestimmungen", c: "Es gilt deutsches Recht. Sollte eine Bestimmung dieser AGB unwirksam sein, bleibt die Wirksamkeit der übrigen Regelungen unberührt." }
      ].map((item, i) => (
        <div key={i}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.t}</h3>
          <p>{item.c}</p>
        </div>
      ))}
    </div>
  </LegalLayout>
);

export const Datenschutz: React.FC = () => (
  <LegalLayout title="Datenschutzerklärung">
    <div className="space-y-8">
      {[
        { t: "1. Verantwortlicher", c: "Verantwortlicher im Sinne der DSGVO ist: Benjamin Ridel, LayerForm, Ludwig-Bechstein-Weg 25a, 22941 Bargteheide. E-Mail: layerform@web.de" },
        { t: "2. Zugriffsdaten", c: "Beim Besuch der Website werden automatisch folgende Daten erhoben: IP-Adresse, Datum und Uhrzeit des Zugriffs, Browsertyp und Version, Betriebssystem. Diese Daten dienen ausschließlich der technischen Bereitstellung der Website." },
        { t: "3. Kontaktformular", c: "Wenn Sie uns über das Kontaktformular kontaktieren, werden Ihre Angaben zur Bearbeitung der Anfrage gespeichert. Diese Daten werden nicht ohne Ihre Einwilligung weitergegeben." },
        { t: "4. E-Mail-Kontakt", c: "Bei Kontaktaufnahme per E-Mail werden die übermittelten personenbezogenen Daten gespeichert, um die Anfrage zu bearbeiten." },
        { t: "5. Cookies", c: "Die Website verwendet derzeit nur technisch notwendige Cookies. Tracking- oder Marketing-Cookies werden aktuell nicht eingesetzt." },
        { t: "6. Zahlungsanbieter", c: "Bei Nutzung externer Zahlungsdienste (z. B. PayPal oder Stripe) gelten die Datenschutzbestimmungen der jeweiligen Anbieter." },
        { t: "7. Social Media", c: "LayerForm unterhält Profile auf Plattformen wie Instagram, TikTok, Etsy und eBay Kleinanzeigen. Beim Besuch dieser Seiten gelten die Datenschutzbestimmungen der jeweiligen Plattformbetreiber." },
        { t: "8. Rechte der betroffenen Personen", c: "Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Anfragen richten Sie bitte an: layerform@web.de" },
        { t: "9. Änderung der Datenschutzerklärung", c: "Diese Datenschutzerklärung kann angepasst werden, um rechtlichen Anforderungen zu entsprechen." }
      ].map((item, i) => (
        <div key={i}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.t}</h3>
          <p>{item.c}</p>
        </div>
      ))}
    </div>
  </LegalLayout>
);
