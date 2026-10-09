/**
 * Zentrale Preisdaten von LayerForm.
 * Werden vom internen Kalkulator (#kalk) und vom Kunden-Preisrechner (#preisrechner) genutzt,
 * damit beide immer gleich rechnen. Preise nur hier ändern.
 *
 * Grundidee: Die Marge liegt dort, wo die echten Kosten entstehen.
 *  - Material:      Einkauf + 10 % Ausschuss, darauf eine moderate Marge (Standard 100 %)
 *  - Maschinenzeit: fester Stundensatz (enthält Strom, Verschleiß, Abschreibung und Gewinn)
 *  - Arbeitszeit:   Bearbeitungspauschale pro Auftrag, Nacharbeit nach Minuten
 *  - CAD:           eigener Stundensatz
 *  - Versand, Verpackung: ohne Marge durchgereicht
 *  - Serien:        Mengenrabatt auf Material und Maschinenzeit
 */

/** Filament-Einkaufspreise in € pro 1000 g. TPU wird im internen Kalkulator manuell eingegeben. */
export const FILAMENT_PER_KG = {
  PLA: 15,
  PETG: 16,
  ABS: 18,
  ASA: 26,
} as const;
export type FilamentId = keyof typeof FILAMENT_PER_KG;

/** Aufschlag für Ausschuss, Fehldrucke und Reste auf das Material (0,10 = 10 %) */
export const AUSSCHUSS = 0.1;

/** Marge auf das Material in Prozent (100 % = Materialkosten verdoppelt) */
export const MATERIAL_MARGE_STANDARD = 100;
export const MATERIAL_MARGE_VORLAGEN = [50, 100, 150, 200];

/** Maschinenstundensatz in € pro Druckstunde, enthält Strom, Verschleiß, Abschreibung und Gewinn */
export const MASCHINEN_STUNDENSATZ = 2.0;

/** Bearbeitungspauschale pro Auftrag in € (Datei prüfen, slicen, abnehmen, verpacken) */
export const BEARBEITUNGSPAUSCHALE = 3.0;

/** Stundensatz für Nacharbeit (Stützen entfernen, schleifen, Gewindeeinsätze …) in € */
export const ARBEIT_STUNDENSATZ = 30;

/** Stundensatz für CAD-Konstruktion in € */
export const CAD_STUNDENSATZ = 45;

/** Mengenrabatt auf Material und Maschinenzeit, höchste passende Stufe gilt */
export const MENGENRABATT = [
  { abStueck: 10, prozent: 10 },
  { abStueck: 50, prozent: 20 },
];

/** Eigene Kosten (nur zur Gewinnanzeige im internen Kalkulator) */
export const STROM_PREIS_KWH = 0.4;
export const DRUCKER_WATT = 250;
export const STROM_PRO_STUNDE = (DRUCKER_WATT / 1000) * STROM_PREIS_KWH; // 0,10 €
export const VERSCHLEISS_PRO_STUNDE = 0.25;

/**
 * Zusatzkosten ohne Marge, z. B. Verpackung und Versand.
 * Preise in €. Im internen Kalkulator lassen sie sich zusätzlich pro Gerät anpassen und ergänzen.
 */
export interface Zusatzposition { id: string; name: string; preis: number }
export const ZUSATZKOSTEN: Zusatzposition[] = [
  { id: 'paket-klein', name: 'Kleines Paket', preis: 0 },
  { id: 'paket-gross', name: 'Großes Paket', preis: 0 },
  { id: 'versand-klein', name: 'Kleiner Versand', preis: 0 },
  { id: 'versand-gross', name: 'Großer Versand', preis: 0 },
  { id: 'verpackung', name: 'Verpackungsmaterial', preis: 0.3 },
  { id: 'versandtasche', name: 'Versandtasche', preis: 0.18 }, // 18 € für 100 Stück
];

/** Kleinunternehmer nach § 19 UStG: keine Umsatzsteuer */
export const MWST_HINWEIS = 'Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.';

export interface MaterialAnteil { gramm: number; preisProKg: number }

export interface Kalkulation {
  stueck: number;
  // pro Stück
  materialEinkauf: number;   // € Filament zum Einkaufspreis
  materialMitAusschuss: number;
  materialMargeProzent: number;
  material: number;          // € Materialpreis für den Kunden
  stunden: number;
  stundensatz: number;
  maschine: number;          // € Maschinenzeit für den Kunden
  produktProStueck: number;  // Material + Maschine
  // Auftrag
  produkt: number;           // × Stückzahl
  rabattProzent: number;
  rabatt: number;
  pauschale: number;
  nacharbeit: number;
  cad: number;
  zusatz: number;
  gesamt: number;            // Endpreis
  proStueck: number;         // Endpreis / Stückzahl
  // eigene Kosten und Gewinn (intern)
  kosten: { material: number; strom: number; verschleiss: number; zusatz: number; summe: number };
  gewinn: number;            // Endpreis − eigene Kosten (deckt deine Arbeitszeit)
}

const cent = (v: number) => Math.round(v * 100) / 100;

export const rabattFuer = (menge: number) =>
  MENGENRABATT.filter((s) => menge >= s.abStueck).reduce((m, s) => Math.max(m, s.prozent), 0);

/**
 * Formel:
 *   Material   = Gramm / 1000 × kg-Preis × 1,10 (Ausschuss) × (1 + Materialmarge)
 *   Maschine   = Druckstunden × Maschinenstundensatz
 *   Produkt    = (Material + Maschine) × Stückzahl − Mengenrabatt
 *   Endpreis   = Produkt + Bearbeitungspauschale + Nacharbeit + CAD + Zusatzkosten
 */
export function kalkuliere(opts: {
  materialien: MaterialAnteil[];       // pro Stück
  stunden: number;                     // pro Stück
  stueck?: number;
  materialMargeProzent?: number;
  stundensatz?: number;
  pauschale?: number;
  nacharbeitMinutenProStueck?: number;
  cadMinuten?: number;
  zusatz?: number;
  mengeFuerRabatt?: number;            // falls abweichend von stueck (Preisrechner mit verschiedenen Teilen)
}): Kalkulation {
  const stueck = Math.max(1, Math.floor(opts.stueck ?? 1));
  const mm = Math.max(0, opts.materialMargeProzent ?? MATERIAL_MARGE_STANDARD);
  const satz = Math.max(0, opts.stundensatz ?? MASCHINEN_STUNDENSATZ);
  const pauschale = Math.max(0, opts.pauschale ?? BEARBEITUNGSPAUSCHALE);
  const zusatz = Math.max(0, opts.zusatz ?? 0);

  const materialEinkauf = opts.materialien.reduce((s, m) => s + (m.gramm / 1000) * m.preisProKg, 0);
  const materialMitAusschuss = materialEinkauf * (1 + AUSSCHUSS);
  const material = materialMitAusschuss * (1 + mm / 100);
  const maschine = opts.stunden * satz;
  const produktProStueck = material + maschine;
  const produkt = produktProStueck * stueck;
  const rabattProzent = rabattFuer(opts.mengeFuerRabatt ?? stueck);
  const rabatt = (produkt * rabattProzent) / 100;
  const nacharbeit = ((opts.nacharbeitMinutenProStueck ?? 0) / 60) * ARBEIT_STUNDENSATZ * stueck;
  const cad = ((opts.cadMinuten ?? 0) / 60) * CAD_STUNDENSATZ;
  const gesamt = cent(produkt - rabatt + pauschale + nacharbeit + cad + zusatz);

  const kMaterial = materialMitAusschuss * stueck;
  const kStrom = opts.stunden * STROM_PRO_STUNDE * stueck;
  const kVerschleiss = opts.stunden * VERSCHLEISS_PRO_STUNDE * stueck;
  const kSumme = kMaterial + kStrom + kVerschleiss + zusatz;

  return {
    stueck,
    materialEinkauf: cent(materialEinkauf),
    materialMitAusschuss: cent(materialMitAusschuss),
    materialMargeProzent: mm,
    material: cent(material),
    stunden: opts.stunden,
    stundensatz: satz,
    maschine: cent(maschine),
    produktProStueck: cent(produktProStueck),
    produkt: cent(produkt),
    rabattProzent,
    rabatt: cent(rabatt),
    pauschale: cent(pauschale),
    nacharbeit: cent(nacharbeit),
    cad: cent(cad),
    zusatz: cent(zusatz),
    gesamt,
    proStueck: cent(gesamt / stueck),
    kosten: { material: cent(kMaterial), strom: cent(kStrom), verschleiss: cent(kVerschleiss), zusatz: cent(zusatz), summe: cent(kSumme) },
    gewinn: cent(gesamt - kSumme),
  };
}

export const euro = (v: number) => v.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
