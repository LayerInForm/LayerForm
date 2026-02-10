
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
    id: 'puzzle-heart-keychain',
    name: 'Puzzle-Herz',
    shortDescription: 'Zweiteiliges Symbol der Verbundenheit. Inklusive kostenlosem Versand.',
    fullDescription: 'Ein haptisches Versprechen für Ihre Liebsten. Unser Puzzle-Herz wird auf modernsten Bambu Lab Systemen gefertigt, was eine unvergleichliche Oberflächengüte garantiert. Der Preis von 8,50 € versteht sich bereits inklusive sicherem Versand direkt zu Ihnen nach Hause.',
    basePrice: 8.50,
    isCustomizable: true,
    imageUrl: '/assets/images/products/heart-main.jpg', 
    variants: [
      { 
        id: 'v_red', 
        name: 'Rot', 
        colorCode: '#FF3B30', 
        priceOffset: 0, 
        stripeLink: 'https://buy.stripe.com/00waEZ4Ud5M09TQcLZ9MY01', 
        variantImageUrl: '/assets/images/products/heart-red.jpg' 
      },
      { 
        id: 'v_blue', 
        name: 'Blau', 
        colorCode: '#007AFF', 
        priceOffset: 0, 
        stripeLink: 'https://buy.stripe.com/beispiel_blau',
        variantImageUrl: '/assets/images/products/heart-blue.jpg'
      },
      { 
        id: 'v_black', 
        name: 'Schwarz', 
        colorCode: '#000000', 
        priceOffset: 0, 
        stripeLink: 'https://buy.stripe.com/beispiel_schwarz',
        variantImageUrl: '/assets/images/products/heart-black.jpg'
      },
      { 
        id: 'v_white', 
        name: 'Weiß', 
        colorCode: '#FFFFFF', 
        priceOffset: 0, 
        stripeLink: 'https://buy.stripe.com/beispiel_weiss',
        variantImageUrl: '/assets/images/products/heart-white.jpg'
      }
    ]
  },
  {
    id: 'magsafe-desk-stand',
    name: 'MagSafe Stand',
    shortDescription: 'Minimalistischer Desktop-Ständer. Inklusive kostenlosem Versand.',
    fullDescription: 'Ein skulpturaler Ständer, der Präzision und Ästhetik vereint. Durch den Einsatz von Bambu Lab Technologie erreichen wir Toleranzen im Mikrometerbereich. Gefertigt aus robustem Premium-Filament für maximale Langlebigkeit. Versandkostenfrei innerhalb Deutschlands.',
    basePrice: 34.90,
    imageUrl: '/assets/images/products/magsafe-main.jpg',
    variants: [
      { 
        id: 'v1', 
        name: 'Space Gray', 
        colorCode: '#4a4a4a', 
        priceOffset: 0, 
        stripeLink: 'https://buy.stripe.com/beispiel_spacegray',
        variantImageUrl: '/assets/images/products/magsafe-gray.jpg'
      },
      { 
        id: 'v2', 
        name: 'Arctic White', 
        colorCode: '#f5f5f7', 
        priceOffset: 0, 
        stripeLink: 'https://buy.stripe.com/beispiel_white',
        variantImageUrl: '/assets/images/products/magsafe-white.jpg'
      }
    ]
  }
];
