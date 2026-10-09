/**
 * Darstellung und Schätzung des Kunden-Preisrechners.
 * Die Preise selbst (Filament, Strom, Aufschlag, Mindestpreis) kommen aus src/pricing.ts,
 * damit der Preisrechner und der interne Kalkulator immer gleich rechnen.
 */
import { FILAMENT_PER_KG } from '../../src/pricing';

export const MAX_PART = 255; // mm, maximale Teilegröße je Achse und nutzbare Plattenfläche
export const BED = 256;      // mm, Druckplatte (nur Darstellung)
export const GAP = 10;       // mm Mindestabstand zwischen allen Teilen auf einer Platte
export const MAX_FILE_MB = 50;

export interface Material {
  id: string;
  name: string;
  tag: string;
  recommended?: boolean;
  onRequest?: boolean; // kein Richtpreis, nur Anfrage
  density: number;     // g/cm³
  perKg: number;       // € pro 1000 g
  maxFlow: number;     // max. Volumenstrom in mm³/s (Bambu-Filamentprofil)
  pros: string[];
}

export const MATERIALS: Material[] = [
  {
    id: 'PETG', name: 'PETG', tag: 'Empfohlen', recommended: true, density: 1.27, perKg: FILAMENT_PER_KG.PETG, maxFlow: 12,
    pros: ['Reicht für die meisten Teile, drinnen wie draußen', 'UV-beständig und wasserfest', 'Robust, zäh und leicht flexibel', 'Hitzebeständig bis ca. 70 °C'],
  },
  {
    id: 'PLA', name: 'PLA', tag: 'Empfohlen', recommended: true, density: 1.24, perKg: FILAMENT_PER_KG.PLA, maxFlow: 21,
    pros: ['Ideal für Deko, Figuren und Prototypen', 'Sehr detailgenau, viele Farben', 'Günstigste Wahl für Innenräume', 'Nicht für Hitze über ca. 50 °C'],
  },
  {
    id: 'ABS', name: 'ABS', tag: 'Hitzefest', density: 1.04, perKg: FILAMENT_PER_KG.ABS, maxFlow: 16,
    pros: ['Gehäuse, Teile im Auto-Innenraum', 'Hitzebeständig bis ca. 90 °C', 'Gut nachbearbeitbar'],
  },
  {
    id: 'ASA', name: 'ASA', tag: 'Outdoor', density: 1.07, perKg: FILAMENT_PER_KG.ASA, maxFlow: 16,
    pros: ['Garten, Fassade, Auto außen', 'UV- und wetterbeständig', 'Hitzebeständig wie ABS'],
  },
  {
    id: 'TPU', name: 'TPU', tag: 'Auf Anfrage', onRequest: true, density: 1.21, perKg: 0, maxFlow: 3.5,
    pros: ['Dichtungen, Puffer, Schutzhüllen', 'Gummiartig und elastisch', 'Preis je nach TPU-Härte auf Anfrage'],
  },
];

export interface Quality { lh: number; label: string }
export const QUALITIES: Quality[] = [
  { lh: 0.28, label: 'Schnell' },
  { lh: 0.2, label: 'Standard' },
  { lh: 0.12, label: 'Fein' },
];

/**
 * Druckerprofil für die Schätzung: Bambu Lab A1 mit 0,4-mm-Düse,
 * angelehnt an die Bambu-Studio-Standardprozesse („0.20mm Standard @BBL A1“ usw.).
 * Die Faktoren unter "korrektur" lassen sich mit echten Slicer-Werten nachjustieren.
 */
export const DRUCKER = {
  name: 'Bambu Lab A1',
  linienbreite: 0.42,      // mm
  wandLinien: 2,           // Wandschleifen
  deckschichten: 5,        // obere Schichten
  deckMinMm: 1.0,          // obere Schale mindestens 1 mm
  bodenschichten: 3,       // untere Schichten
  speed: { aussenwand: 200, innenwand: 300, fuellung: 270, deckflaeche: 200, ersteSchicht: 50 }, // mm/s
  effizienz: { wand: 0.55, fuellung: 0.7, deckflaeche: 0.6 }, // Anteil echter Druckgeschwindigkeit (Beschleunigung, Ecken)
  schichtwechselSek: 2.5,  // Z-Hub, Wischen, Schichtwechsel
  leerfahrtAufschlag: 0.12, // +12 % Zeit für Leerfahrten
  startMinuten: 7,         // Aufheizen, Kalibrierung, Spüllinie je Platte
  spuellinieGramm: 0.3,    // Spüllinie am Plattenrand je Platte
  korrektur: { gewicht: 1.0, zeit: 1.0 },
};
export const DEFAULT_QUALITY = 1;
export const DEFAULT_INFILL = 15;
