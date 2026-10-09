/**
 * Zentrale Preisdaten von LayerForm.
 * Werden vom internen Kalkulator (#kalkulation) und vom Kunden-Preisrechner (#preisrechner) genutzt,
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

/** Verkaufspreis = Selbstkosten × 4 (300 % Aufschlag) */
export const AUFSCHLAG_FAKTOR = 4;
/** Mindestpreis pro Auftrag in € */
export const MINDESTPREIS = 2;

/** Kleinunternehmer nach § 19 UStG: keine Umsatzsteuer */
export const MWST_HINWEIS = 'Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.';

export interface MaterialAnteil {
  gramm: number;
  preisProKg: number;
}

export interface Kalkulation {
  material: number;      // € Material pro Stück
  strom: number;         // € Strom pro Stück
  selbstkosten: number;  // € pro Stück
  aufschlag: number;     // € pro Stück
  verkaufProStueck: number; // € pro Stück vor Mindestpreis und Zuschlag
  stueck: number;
  zwischensumme: number; // Verkauf × Stückzahl
  mindestpreisGreift: boolean;
  zuschlag: number;      // € einmalig pro Auftrag
  gesamt: number;        // € Endpreis
  proStueck: number;     // € Endpreis / Stückzahl
}

const cent = (v: number) => Math.round(v * 100) / 100;

/**
 * Grundformel:
 *   Material     = Gramm / 1000 × Preis pro kg
 *   Strom        = Druckstunden × 0,10 €
 *   Selbstkosten = Material + Strom
 *   Verkauf      = Selbstkosten × 4
 *   Gesamt       = max(Mindestpreis, Verkauf × Stückzahl) + Zuschlag
 */
export function kalkuliere(opts: { materialien: MaterialAnteil[]; stunden: number; stueck?: number; zuschlag?: number }): Kalkulation {
  const stueck = Math.max(1, Math.floor(opts.stueck ?? 1));
  const zuschlag = Math.max(0, opts.zuschlag ?? 0);
  const material = opts.materialien.reduce((s, m) => s + (m.gramm / 1000) * m.preisProKg, 0);
  const strom = opts.stunden * STROM_PRO_STUNDE;
  const selbstkosten = material + strom;
  const verkaufProStueck = selbstkosten * AUFSCHLAG_FAKTOR;
  const zwischensumme = verkaufProStueck * stueck;
  const mindestpreisGreift = zwischensumme < MINDESTPREIS;
  const gesamt = cent(Math.max(MINDESTPREIS, zwischensumme) + zuschlag);
  return {
    material: cent(material),
    strom: cent(strom),
    selbstkosten: cent(selbstkosten),
    aufschlag: cent(verkaufProStueck - selbstkosten),
    verkaufProStueck: cent(verkaufProStueck),
    stueck,
    zwischensumme: cent(zwischensumme),
    mindestpreisGreift,
    zuschlag: cent(zuschlag),
    gesamt,
    proStueck: cent(gesamt / stueck),
  };
}

export const euro = (v: number) => v.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
