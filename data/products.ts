
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
    id: 'textile-printing-service',
    name: 'Textil-Veredelung',
    shortDescription: 'Hochwertiger Textildruck für Arbeitskleidung, Merchandise oder individuelle Einzelstücke.',
    fullDescription: 'LayerForm bringt Ihre Designs auf Textilien. Ob Firmen-Shirts in Kleinserie oder das eine, ganz besondere Geschenk – wir bedrucken Textilien mit höchster Präzision und Langlebigkeit. Wir nutzen hochwertige Flex- und Flockfolien für ein professionelles Finish, das auch nach vielen Wäschen überzeugt.',
    basePrice: 0,
    isCustomizable: true,
    imageUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=800',
    variants: [
      { id: 'text_flex', name: 'Flexdruck (Glatt)', priceOffset: 0, colorCode: '#ffffff' },
      { id: 'text_flock', name: 'Flockdruck (Samtig)', priceOffset: 0, colorCode: '#ffffff' }
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
