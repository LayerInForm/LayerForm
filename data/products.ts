
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
    id: 'custom-manufacturing-service',
    name: 'Individuelle Fertigung',
    shortDescription: 'Einzelstücke (1-5) oder Kleinserien (6-50+). Ihr Projekt, unser Know-how.',
    fullDescription: 'Sie haben eine Skizze, eine CAD-Datei oder einfach nur eine Vision? Wir fertigen für Sie alles an – von personalisierten Firmenlogos über technische Prototypen bis hin zu Event-Gadgets. Wir sind spezialisiert auf die Umsetzung von Einzelstücken bis 5 Einheiten sowie effiziente Kleinserien. Nehmen Sie Kontakt auf für ein unverbindliches Angebot.',
    basePrice: 0,
    isCustomizable: true,
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800', 
    variants: [
      { 
        id: 'v_custom', 
        name: 'Unverbindliche Anfrage', 
        colorCode: '#00E5FF', 
        priceOffset: 0, 
        stripeLink: '', 
        variantImageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800' 
      }
    ]
  },
  {
    id: 'modular-organizer',
    name: 'Modularer Organizer',
    shortDescription: 'Individuelles Ordnungssystem für Schubladen und Schränke. Beliebig erweiterbar.',
    fullDescription: 'Schluss mit Chaos. Unser modulares System passt sich Ihren Bedürfnissen an. Wählen Sie aus verschiedenen Modulgrößen und stellen Sie sich Ihren perfekten Organizer zusammen. Jedes Modul wird mit höchster Präzision gefertigt und lässt sich nahtlos mit anderen verbinden.',
    basePrice: 0,
    isCustomizable: true,
    imageUrl: 'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?auto=format&fit=crop&q=80&w=800',
    variants: [
      { id: 'mod_small', name: 'Standard Modul (1x1)', priceOffset: 0, colorCode: '#4a4a4a' },
      { id: 'mod_medium', name: 'Medium Modul (1x2)', priceOffset: 0, colorCode: '#4a4a4a' },
      { id: 'mod_large', name: 'Large Modul (2x2)', priceOffset: 0, colorCode: '#4a4a4a' }
    ]
  },
  {
    id: 'custom-logo-sign',
    name: 'Firmenlogo & Schriftzüge',
    shortDescription: 'Ihr Name oder Logo als hochwertiges 3D-Objekt für Wände oder Türen.',
    fullDescription: 'Bringen Sie Ihre Marke an die Wand. Wir fertigen Ihren Firmennamen oder Ihr Logo als plastisches 3D-Objekt. Wählen Sie zwischen verschiedenen Schriftarten, Größen und Montagemöglichkeiten (selbstklebend oder zum Schrauben). Perfekt für Büros, Empfangsbereiche oder Messestände.',
    basePrice: 0,
    isCustomizable: true,
    imageUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=800',
    variants: [
      { id: 'sign_small', name: 'Small (bis 20cm)', priceOffset: 0, colorCode: '#000000' },
      { id: 'sign_medium', name: 'Medium (bis 50cm)', priceOffset: 0, colorCode: '#000000' },
      { id: 'sign_large', name: 'Large (bis 100cm)', priceOffset: 0, colorCode: '#000000' }
    ]
  }
];
