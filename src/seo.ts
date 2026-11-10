export const SITE_URL = 'https://www.layer-form.de';
export const SERVICE_PAGES = [
  {
    path: '/3d-druck', name: '3D-Druck',
    title: '3D-Druck Service in Bargteheide · Versand deutschlandweit | LayerForm',
    description: 'Ersatzteile, Prototypen und Kleinserien im 3D-Druck: LayerForm in Bargteheide prüft Ihre Datei oder Idee. Versand in Deutschland oder Abholung. Projekt anfragen.',
    heading: '3D-Druck für Teile, die Sie wirklich brauchen.',
    intro: 'LayerForm fertigt in Bargteheide Kunststoffteile für Unternehmen und Privatkunden: vom einzelnen Ersatzteil über einen Prototyp bis zur Kleinserie. Sie können Ihr Projekt aus ganz Deutschland anfragen und die fertigen Teile versenden lassen oder nach Absprache abholen.',
    image: '/projects/stativ-adapter.webp', alt: '3D-gedruckter Stativadapter für die Messtechnik', topic: '3D-Druck',
    sections: [
      ['Ersatzteile, Halterungen und Gehäuse', 'Ein Adapter passt nicht, eine Abdeckung fehlt oder ein Gehäuse braucht andere Befestigungen? Beschreiben Sie die Funktion und schicken Sie Maße, Fotos oder eine vorhandene 3D-Datei. Wir prüfen, ob sich das Teil mit 3D-Druck umsetzen lässt.'],
      ['Vom Prototyp zur Kleinserie', 'Ein erstes Muster hilft, Passform und Handhabung zu prüfen. Nach Ihrer Freigabe können weitere Exemplare gefertigt werden. Stückzahl, Material, Farbe und gewünschter Termin fließen in das individuelle Angebot ein.'],
      ['Material passend zum Einsatz', 'Zur Auswahl stehen PLA, PETG, ASA, ABS und TPU. Entscheidend sind Belastung, Temperatur, Umgebung und gewünschte Flexibilität. Nennen Sie den Einsatzzweck, damit wir die Materialwahl gemeinsam prüfen können.']
    ],
    checklist: ['Fotos, Skizze oder vorhandene 3D-Datei', 'Maße und Funktion des Bauteils', 'Stückzahl, Farbe und gewünschter Termin', 'Besondere Anforderungen an Temperatur oder Belastung'],
    faqs: [
      ['Was kostet ein 3D-Druck?', 'Der Preis hängt von Geometrie, Größe, Material, Stückzahl und Nacharbeit ab. Wenn eine Konstruktion nötig ist, kommt dieser Aufwand hinzu. Schicken Sie Ihre Angaben für ein individuelles Angebot; einen pauschalen Stückpreis gibt es nicht.'],
      ['Kann ich ohne fertige 3D-Datei anfragen?', 'Ja. Fotos, eine bemaßte Skizze oder ein vorhandenes Muster helfen bei der Prüfung. Falls nötig, kann LayerForm das Teil zunächst per CAD konstruieren.'],
      ['Liefert LayerForm auch außerhalb von Bargteheide?', 'Ja, die fertigen Teile können innerhalb Deutschlands versendet werden. Eine Abholung in Bargteheide ist nach Absprache möglich.'],
      ['Wie lange dauert die Fertigung?', 'Das hängt von Konstruktion, Material, Stückzahl und Auslastung ab. Geben Sie Ihren Wunschtermin bei der Anfrage an. Den konkreten Termin stimmen wir vor der Fertigung mit Ihnen ab.']
    ]
  },
  {
    path: '/cad-konstruktion', name: 'CAD-Konstruktion',
    title: 'CAD-Konstruktion für 3D-Druck & Ersatzteile | LayerForm Bargteheide',
    description: 'Aus Skizze, Foto oder Muster zum 3D-Modell: CAD-Konstruktion und Anpassung für Ersatzteile, Gehäuse und Prototypen. Projekt mit LayerForm besprechen.',
    heading: 'Aus Ihrer Idee wird ein druckbares 3D-Modell.',
    intro: 'LayerForm konstruiert Bauteile in Fusion 360 und bereitet sie für den 3D-Druck vor. Ob Ersatzteil, individuelles Gehäuse oder Prototyp: Wir klären Funktion, Maße und Einbausituation, bevor aus Ihrer Idee ein Modell wird. Standort ist Bargteheide; die Abstimmung ist auch aus der Ferne möglich.',
    image: '/projects/cad-aussen.webp', alt: 'CAD-Modell eines individuell konstruierten Bauteils', topic: 'CAD-Konstruktion',
    sections: [
      ['Eine Skizze ist ein guter Anfang', 'Sie brauchen noch keine fertige technische Zeichnung. Eine Skizze mit Maßen und Fotos der Einbausituation helfen uns, Ihre Anforderungen zu verstehen. Welche Angaben oder Muster zusätzlich nötig sind, klären wir vor dem Angebot.'],
      ['Konstruktion und Anpassung', 'Wir entwickeln neue Bauteile oder prüfen, ob sich vorhandene Modelle anpassen lassen. Dazu gehören beispielsweise Befestigungspunkte, Aussparungen und Gehäuse. Wichtige Maße und die gewünschte Funktion stimmen wir gemeinsam ab.'],
      ['Passform am Muster prüfen', 'CAD und Fertigung können bei LayerForm zusammenlaufen. Bei Bedarf wird ein erstes Muster gedruckt, damit Sie Passform und Handhabung prüfen können, bevor eine weitere Fertigung freigegeben wird.']
    ],
    checklist: ['Skizzen, Fotos oder ein vorhandenes Muster', 'Wichtige Maße und Einbausituation', 'Funktion, Belastung und gewünschtes Material', 'Gewünschtes Ergebnis: Modell, Muster oder fertige Teile'],
    faqs: [
      ['Kann ein defektes Teil als Vorlage dienen?', 'Ein vorhandenes Teil kann als Vorlage helfen. Für die Machbarkeitsprüfung benötigen wir Fotos, Maße und Informationen zur Funktion. Fehlende Bereiche oder wichtige Passungen müssen gesondert abgestimmt werden.'],
      ['Ist die Konstruktion beim Druckpreis enthalten?', 'Konstruktionsaufwand und Fertigung hängen vom jeweiligen Projekt ab. Im individuellen Angebot klären wir, welche Leistungen enthalten sind.'],
      ['Kann ich das konstruierte Teil auch drucken lassen?', 'Ja. LayerForm bietet CAD-Konstruktion und 3D-Druck an. Material, Passformprüfung und Stückzahl stimmen wir vor der Fertigung ab.']
    ]
  },
  {
    path: '/automatisierung', name: 'Automatisierung & IT',
    title: 'Prozessautomatisierung für kleine Unternehmen | LayerForm',
    description: 'Weniger doppelte Eingaben: LayerForm verbindet Formulare, CRM und Büroprogramme. Automatisierung und KI für kleine Unternehmen. Erstgespräch anfragen.',
    heading: 'Weniger Copy-Paste. Mehr Zeit für Ihren Betrieb.',
    intro: 'LayerForm unterstützt kleine Unternehmen und Start-ups bei wiederkehrenden Büroaufgaben: Anfragen strukturiert erfassen, Daten zwischen Programmen übertragen und KI gezielt einsetzen. Wir beginnen mit einem konkreten Ablauf und prüfen, welche Automatisierung zu Ihren vorhandenen Programmen passt.',
    image: '/projects/kraemer-gehaeuse.webp', alt: 'Individuell gefertigte Gehäuse als Beispiel für die technische Projektarbeit von LayerForm', topic: 'Automatisierung',
    sections: [
      ['Anfragen übersichtlich ins CRM übernehmen', 'Formularangaben lassen sich strukturiert an ein CRM wie HubSpot übertragen. Vor der Umsetzung klären wir Pflichtfelder, Zuordnung, Wiederholungen und Fehlerfälle, damit nachvollziehbar bleibt, welche Anfrage wo angekommen ist.'],
      ['Vorhandene Programme verbinden', 'Ob Tabellen, E-Mail oder Auftragsverwaltung: Wir prüfen die verfügbaren Schnittstellen und legen fest, welches System für welche Daten verantwortlich ist. Ziel ist ein klarer Ablauf mit weniger doppelter Eingabe.'],
      ['KI mit klaren Aufgaben', 'KI kann beispielsweise Nachrichten vorsortieren, Dokumente zusammenfassen oder Antwortentwürfe vorbereiten. Wir grenzen den Einsatz gemeinsam ein und klären, welche Schritte weiterhin eine menschliche Prüfung benötigen.']
    ],
    checklist: ['Ein konkreter Ablauf, der heute Zeit kostet', 'Die beteiligten Programme und bisherigen Arbeitsschritte', 'Häufigkeit und typische Fehlerfälle', 'Ihr gewünschtes Ergebnis und nötige Freigaben'],
    faqs: [
      ['Müssen wir dafür alle Programme wechseln?', 'Das ist nicht das Ziel. Zuerst prüfen wir die Programme, die Sie bereits nutzen, und deren Schnittstellen. Ob eine Verbindung möglich und sinnvoll ist, hängt vom konkreten System und Tarif ab.'],
      ['Wie beginnt ein Automatisierungsprojekt?', 'In einem unverbindlichen Erstgespräch beschreiben Sie den Ablauf und Ihre Programme. Danach klären wir Anforderungen, Machbarkeit und den Umfang eines individuellen Angebots.'],
      ['Kann ich zunächst nur einen Ablauf automatisieren?', 'Ja. Ein klar abgegrenzter Ablauf ist ein sinnvoller Einstieg. Weitere Schritte lassen sich nach der Prüfung des ersten Prozesses besprechen.']
    ]
  }
] as const;

export const PAGE_META: Record<string, { title: string; description: string }> = {
  '/': { title: '3D-Druck & CAD in Bargteheide · deutschlandweit | LayerForm', description: '3D-Druck, CAD-Konstruktion und Kleinserien aus Bargteheide. Für Unternehmen und Privatkunden, mit Versand in Deutschland. Idee oder Datei senden und Angebot anfragen.' },
  ...Object.fromEntries(SERVICE_PAGES.map(page => [page.path, page])),
  '/anfrage': { title: 'Projekt anfragen: 3D-Druck, CAD & Automatisierung | LayerForm', description: 'Beschreiben Sie Ihr Vorhaben: 3D-Druck, CAD-Konstruktion oder Automatisierung. LayerForm prüft Ihre Angaben und bespricht mit Ihnen die nächsten Schritte.' },
  '/kontakt': { title: 'Kontakt zu LayerForm in Bargteheide', description: 'LayerForm erreichen: Kontakt per E-Mail, Telefon oder WhatsApp. Besprechen Sie Ihr Projekt für 3D-Druck, CAD oder Automatisierung.' },
  ...Object.fromEntries(['Impressum', 'AGB', 'Datenschutz', 'Widerruf'].map(name => ['/' + name.toLowerCase(), { title: name + ' | LayerForm', description: name + ' von LayerForm.' }]))
};

export function structuredData(path: string) {
  const page = SERVICE_PAGES.find(item => item.path === path);
  const organization = { '@type': 'Organization', '@id': SITE_URL + '/#organization', name: 'LayerForm', url: SITE_URL + '/', logo: SITE_URL + '/favicon-512x512.png', email: 'info@layer-form.de', telephone: '+49 176 85922649', areaServed: { '@type': 'Country', name: 'Deutschland' }, location: { '@type': 'Place', name: 'Bargteheide, Schleswig-Holstein' }, sameAs: ['https://www.instagram.com/ridel.projects/', 'https://www.tiktok.com/@ridel.projects'] };
  return { '@context': 'https://schema.org', '@graph': [organization,
    { '@type': 'WebPage', '@id': SITE_URL + path, url: SITE_URL + path, name: PAGE_META[path]?.title, description: PAGE_META[path]?.description, inLanguage: 'de-DE', about: { '@id': organization['@id'] } },
    ...(page ? [{ '@type': 'Service', name: page.name, serviceType: page.name, description: page.intro, url: SITE_URL + path, provider: { '@id': organization['@id'] }, areaServed: { '@type': 'Country', name: 'Deutschland' } }, { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Startseite', item: SITE_URL + '/' }, { '@type': 'ListItem', position: 2, name: page.name, item: SITE_URL + path }] }] : [])
  ] };
}
