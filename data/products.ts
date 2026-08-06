
export interface ProductVariant {
  id: string;
  name: string;
  colorCode?: string;
  priceOffset: number;
  stripeLink?: string;
  variantImageUrl?: string; 
}

export interface Product {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  basePrice: number;
  imageUrl: string; 
  variants: ProductVariant[];
  isCustomizable?: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: '3d-printing-manufaktur',
    name: '3D-Druck Manufaktur',
    shortDescription: 'Präzisionsgefertigte Kunststoffteile für Privat und Technik. Von der Idee zum fertigen Objekt.',
    fullDescription: 'Wir fertigen Ihre 3D-Dateien präzise und zuverlässig. Egal ob technisches Bauteil, dekoratives Element oder Prototyp – wir nutzen modernste FDM-Systeme (Bambu Lab), um höchste Oberflächenqualität und Maßhaltigkeit zu garantieren. Wir unterstützen Sie bei der Materialwahl für optimale Stabilität und Ästhetik.',
    basePrice: 0,
    isCustomizable: true,
    imageUrl: 'https://images.unsplash.com/photo-1631415147131-7b7463f8546b?auto=format&fit=crop&q=80&w=800',
    variants: [
      { id: '3d_fdm', name: 'FDM Präzisionsdruck', priceOffset: 0, colorCode: '#00E5FF' },
      { id: '3d_consult', name: 'Materialberatung', priceOffset: 0, colorCode: '#001C3D' }
    ]
  },
  {
    id: 'cad-design-service',
    name: '3D-CAD Konstruktion',
    shortDescription: 'Professionelle Erstellung digitaler 3D-Modelle nach Ihrer Idee oder Zeichnung.',
    fullDescription: 'Sie haben eine Idee, eine Handskizze oder ein defektes Bauteil, aber keine 3D-Datei? Wir erstellen präzise CAD-Modelle für den 3D-Druck oder die Weiterverarbeitung. Von einfachen Abdeckungen bis zu komplexen Gehäusen konstruieren wir Ihre Wünsche maßgenau.',
    basePrice: 0,
    isCustomizable: true,
    imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    variants: [
      { id: 'cad_basic', name: 'Basis Modellierung', priceOffset: 0, colorCode: '#00E5FF' },
      { id: 'cad_expert', name: 'Komplexe Konstruktion', priceOffset: 0, colorCode: '#001C3D' }
    ]
  },
  {
    id: 'spare-parts-reconstruction',
    name: 'Ersatzteil-Service',
    shortDescription: 'Nicht mehr lieferbare Bauteile? Wir rekonstruieren und drucken passgenaue Ersatzteile.',
    fullDescription: 'Nachhaltigkeit durch Reparatur. Wenn ein Kunststoffteil bricht und das Original nicht mehr verfügbar ist, kommen wir ins Spiel. Wir vermessen Ihr defektes Teil, erstellen eine digitale Kopie (CAD) und drucken ein funktionales Ersatzteil, das oft stabiler ist als das Original.',
    basePrice: 0,
    isCustomizable: true,
    imageUrl: 'https://images.unsplash.com/photo-1631415147131-7b7463f8546b?auto=format&fit=crop&q=80&w=800',
    variants: [
      { id: 'spare_cad', name: 'CAD-Rekonstruktion', priceOffset: 0, colorCode: '#00E5FF' },
      { id: 'spare_print', name: 'Ersatzteildruck', priceOffset: 0, colorCode: '#001C3D' }
    ]
  },
  {
    id: 'special-projects-series',
    name: 'Spezialanfertigungen',
    shortDescription: 'Exklusive Einzelstücke oder Serienproduktion. Von 1 bis 500+ Einheiten nach Maß.',
    fullDescription: 'Ihre Vision ohne Grenzen. Wir realisieren komplexe Sonderwünsche für Privat- und Geschäftskunden. Von der ersten Skizze bis zur finalen Kleinserie begleiten wir Sie persönlich. Wir konstruieren gemeinsam die optimale Lösung, die perfekt auf Ihre Anforderungen zugeschnitten ist – nachhaltig und präzise.',
    basePrice: 0,
    isCustomizable: true,
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
    variants: [
      { id: 'spec_single', name: 'Einzelstück / Prototyp', priceOffset: 0, colorCode: '#00E5FF' },
      { id: 'spec_series', name: 'Serienproduktion', priceOffset: 0, colorCode: '#001C3D' }
    ]
  }
];
