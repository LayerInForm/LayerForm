
export interface ProductVariant {
  id: string;
  name: string;
  colorCode?: string;
  priceOffset: number;
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
  stripeLink?: string; 
}

export const PRODUCTS: Product[] = [
  {
    id: 'puzzle-heart-keychain',
    name: 'Puzzle-Herz Anhänger',
    shortDescription: 'Zweiteiliges Symbol der Verbundenheit. Individuell personalisierbar.',
    fullDescription: 'Ein haptisches Versprechen für Ihre Liebsten. Unser Puzzle-Herz besteht aus zwei präzise gefertigten Hälften, die perfekt ineinandergreifen. Jedes Set wird individuell mit Ihren Wunschnamen und einem besonderen Datum versehen.',
    basePrice: 7.99,
    isCustomizable: true,
    imageUrl: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&q=80&w=800', 
    stripeLink: '', 
    variants: [
      { id: 'v_red', name: 'Rot', colorCode: '#FF3B30', priceOffset: 0 },
      { id: 'v_blue', name: 'Blau', colorCode: '#007AFF', priceOffset: 0 },
      { id: 'v_black', name: 'Schwarz', colorCode: '#000000', priceOffset: 0 },
      { id: 'v_white', name: 'Weiß', colorCode: '#FFFFFF', priceOffset: 0 }
    ]
  },
  {
    id: 'magsafe-desk-stand',
    name: 'MagSafe Desktop Stand',
    shortDescription: 'Minimalistische Ladestation für Ihr iPhone.',
    fullDescription: 'Ein skulpturaler Ständer, der Präzision und Ästhetik vereint. Dieser Stand ist perfekt auf das Apple MagSafe Ladegerät zugeschnitten und sorgt für einen aufgeräumten Arbeitsplatz.',
    basePrice: 34.90,
    imageUrl: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=800',
    stripeLink: '', 
    variants: [
      { id: 'v1', name: 'Space Gray', colorCode: '#4a4a4a', priceOffset: 0 },
      { id: 'v2', name: 'Arctic White', colorCode: '#f5f5f7', priceOffset: 0 },
      { id: 'v3', name: 'Deep Black', colorCode: '#1d1d1f', priceOffset: 0 }
    ]
  },
  {
    id: 'stealth-headphone-mount',
    name: 'Stealth Headphone Mount',
    shortDescription: 'Dezente Untertisch-Halterung für Premium-Headsets.',
    fullDescription: 'Schaffen Sie Platz auf Ihrem Schreibtisch. Die Stealth-Halterung wird unsichtbar unter der Tischplatte montiert und hält selbst schwerste Audiophile-Kopfhörer sicher.',
    basePrice: 19.50,
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=800',
    stripeLink: '',
    variants: [
      { id: 'v1', name: 'Matte Carbon', colorCode: '#2c2c2e', priceOffset: 0 },
      { id: 'v2', name: 'Signal Orange', colorCode: '#ff5722', priceOffset: 2.00 }
    ]
  },
  {
    id: 'luna-planter',
    name: 'Luna Geometric Planter',
    shortDescription: 'Organisches Designobjekt mit Textur-Finish.',
    fullDescription: 'Der Luna Planter nutzt die feinen Schichtlinien des 3D-Drucks als Designelement. Wasserdicht und aus nachhaltigem Bio-Kunststoff gefertigt. Ein Blickfang für jedes moderne Interieur.',
    basePrice: 49.00,
    imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=800',
    stripeLink: '',
    variants: [
      { id: 'v1', name: 'Sandstein', colorCode: '#d2b48c', priceOffset: 0 },
      { id: 'v2', name: 'Betongrau', colorCode: '#8e8e93', priceOffset: 0 },
      { id: 'v3', name: 'Frost', colorCode: '#e5e5ea', priceOffset: 5.00 }
    ]
  }
];
