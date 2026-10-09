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
  speed: number;       // relativer Druckgeschwindigkeitsfaktor
  pros: string[];
}

export const MATERIALS: Material[] = [
  {
    id: 'PETG', name: 'PETG', tag: 'Empfohlen', recommended: true, density: 1.27, perKg: FILAMENT_PER_KG.PETG, speed: 0.9,
    pros: ['Reicht für die meisten Teile, drinnen wie draußen', 'UV-beständig und wasserfest', 'Robust, zäh und leicht flexibel', 'Hitzebeständig bis ca. 70 °C'],
  },
  {
    id: 'PLA', name: 'PLA', tag: 'Empfohlen', recommended: true, density: 1.24, perKg: FILAMENT_PER_KG.PLA, speed: 1,
    pros: ['Ideal für Deko, Figuren und Prototypen', 'Sehr detailgenau, viele Farben', 'Günstigste Wahl für Innenräume', 'Nicht für Hitze über ca. 50 °C'],
  },
  {
    id: 'ABS', name: 'ABS', tag: 'Hitzefest', density: 1.04, perKg: FILAMENT_PER_KG.ABS, speed: 0.9,
    pros: ['Gehäuse, Teile im Auto-Innenraum', 'Hitzebeständig bis ca. 90 °C', 'Gut nachbearbeitbar'],
  },
  {
    id: 'ASA', name: 'ASA', tag: 'Outdoor', density: 1.07, perKg: FILAMENT_PER_KG.ASA, speed: 0.9,
    pros: ['Garten, Fassade, Auto außen', 'UV- und wetterbeständig', 'Hitzebeständig wie ABS'],
  },
  {
    id: 'TPU', name: 'TPU', tag: 'Auf Anfrage', onRequest: true, density: 1.21, perKg: 0, speed: 0.4,
    pros: ['Dichtungen, Puffer, Schutzhüllen', 'Gummiartig und elastisch', 'Preis je nach TPU-Härte auf Anfrage'],
  },
];

export interface Quality { lh: number; label: string; flow: number }
// flow: grob gemittelter Materialdurchsatz in mm³/s inklusive Leerfahrten
export const QUALITIES: Quality[] = [
  { lh: 0.28, label: 'Schnell', flow: 11 },
  { lh: 0.2, label: 'Standard', flow: 8 },
  { lh: 0.12, label: 'Fein', flow: 4.5 },
];
export const DEFAULT_QUALITY = 1;
export const DEFAULT_INFILL = 15;
