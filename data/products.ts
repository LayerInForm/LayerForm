
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
    id: 'puzzle-heart-keychain',
    name: 'Puzzle-Herz Anhänger',
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
    name: 'MagSafe Desktop Stand',
    shortDescription: 'Minimalistischer Stand. Inklusive kostenlosem Versand.',
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
