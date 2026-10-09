/**
 * Zentrale Preisdaten von LayerForm.
 * Werden vom internen Kalkulator (#kalk) und vom Kunden-Preisrechner (#preisrechner) genutzt,
 * damit beide immer gleich rechnen. Preise nur hier ändern.
 */

/** Filamentpreise in € pro 1000 g. TPU wird im internen Kalkulator manuell eingegeben. */
export const FILAMENT_PER_KG = {
  PLA: 15,
  PETG: 16,
  ABS: 18,
  ASA: 26,
} as const;
export type FilamentId = keyof typeof FILAMENT_PER_KG;

/** Strom: 0,40 €/kWh bei 250 W Leistungsaufnahme */
export const STROM_PREIS_KWH = 0.4;
export const DRUCKER_WATT = 250;
/** € pro Druckstunde (0,25 kW × 0,40 €/kWh = 0,10 €) */
export const STROM_PRO_STUNDE = (DRUCKER_WATT / 1000) * STROM_PREIS_KWH;

/** Druckerverschleiß in € pro Druckstunde */
export const VERSCHLEISS_PRO_STUNDE = 0.25;

/**
 * Marge in Prozent auf die Herstellkosten.
 * 100 % = doppelter Preis, 300 % = vierfacher Preis (Standard), 400 % für Firmenkunden.
 */
export const MARGE_STANDARD = 300;
export const MARGE_VORLAGEN = [
  { prozent: 100, label: '100 %' },
  { prozent: 200, label: '200 %' },
  { prozent: 300, label: '300 %', hinweis: 'Standard' },
  { prozent: 400, label: '400 %', hinweis: 'Firma' },
];

/** Mindestpreis für das Produkt (ohne CAD und Zusatzkosten) in € */
export const MINDESTPREIS = 2;

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
  { id: 'verpackung', name: 'Verpackungsmaterial', preis: 0 },
];

/** Kleinunternehmer nach § 19 UStG: keine Umsatzsteuer */
export const MWST_HINWEIS = 'Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.';

export interface MaterialAnteil {
  gramm: number;
  preisProKg: number;
}

export interface Kalkulation {
  material: number;         // € Material pro Stück
  strom: number;            // € Strom pro Stück
  verschleiss: number;      // € Druckerverschleiß pro Stück
  herstellkosten: number;   // € pro Stück
  margeProzent: number;
  marge: number;            // € pro Stück
  verkaufProStueck: number; // € pro Stück vor Mindestpreis
  stueck: number;
  zwischensumme: number;    // Verkauf × Stückzahl
  mindestpreisGreift: boolean;
  produkt: number;          // € Produktpreis gesamt (mit Mindestpreis)
  cad: number;              // € CAD-Konstruktion, ohne Marge
  zusatz: number;           // € Zusatzkosten gesamt, ohne Marge
  gesamt: number;           // € Endpreis
}

const cent = (v: number) => Math.round(v * 100) / 100;

/**
 * Formel:
 *   Material       = Gramm / 1000 × Preis pro kg
 *   Strom          = Druckstunden × 0,10 €
 *   Verschleiß     = Druckstunden × 0,25 €
 *   Herstellkosten = Material + Strom + Verschleiß
 *   Verkauf        = Herstellkosten × (1 + Marge / 100)
 *   Produkt        = max(Mindestpreis, Verkauf × Stückzahl)
 *   Endpreis       = Produkt + CAD + Zusatzkosten
 */
export function kalkuliere(opts: {
  materialien: MaterialAnteil[];
  stunden: number;
  stueck?: number;
  margeProzent?: number;
  cad?: number;
  zusatz?: number;
}): Kalkulation {
  const stueck = Math.max(1, Math.floor(opts.stueck ?? 1));
  const margeProzent = Math.max(0, opts.margeProzent ?? MARGE_STANDARD);
  const cad = Math.max(0, opts.cad ?? 0);
  const zusatz = Math.max(0, opts.zusatz ?? 0);
  const material = opts.materialien.reduce((s, m) => s + (m.gramm / 1000) * m.preisProKg, 0);
  const strom = opts.stunden * STROM_PRO_STUNDE;
  const verschleiss = opts.stunden * VERSCHLEISS_PRO_STUNDE;
  const herstellkosten = material + strom + verschleiss;
  const verkaufProStueck = herstellkosten * (1 + margeProzent / 100);
  const zwischensumme = verkaufProStueck * stueck;
  const mindestpreisGreift = zwischensumme < MINDESTPREIS;
  const produkt = Math.max(MINDESTPREIS, zwischensumme);
  return {
    material: cent(material),
    strom: cent(strom),
    verschleiss: cent(verschleiss),
    herstellkosten: cent(herstellkosten),
    margeProzent,
    marge: cent(verkaufProStueck - herstellkosten),
    verkaufProStueck: cent(verkaufProStueck),
    stueck,
    zwischensumme: cent(zwischensumme),
    mindestpreisGreift,
    produkt: cent(produkt),
    cad: cent(cad),
    zusatz: cent(zusatz),
    gesamt: cent(produkt + cad + zusatz),
  };
}

export const euro = (v: number) => v.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
