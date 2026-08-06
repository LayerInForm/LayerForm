export interface GalleryProject {
  id: string;
  title: string;
  category: 'Engineering' | 'Industrial' | 'Design' | 'Ersatzteile' | 'Prototyping';
  // Pfad im public-Ordner (z.B. /gallery/projekt-1.jpg oder /gallery/industrielle-bauteile.jpg)
  img: string;
  // Fallback-Bild, falls das lokale Bild noch nicht in /public/gallery/ abgelegt wurde
  fallbackImg?: string;
  description?: string;
}

export const GALLERY_PROJECTS: GalleryProject[] = [
  {
    id: 'projekt-1',
    title: 'Industrielle Bauteile',
    category: 'Engineering',
    img: '/gallery/projekt-1.jpg',
    fallbackImg: 'https://images.unsplash.com/photo-1543069110-239103986877?auto=format&fit=crop&q=80&w=800',
    description: 'Präzise gefertigte Funktionsteile für Maschinenbau und Automatisierung.'
  },
  {
    id: 'projekt-2',
    title: 'Custom Prototyping',
    category: 'Prototyping',
    img: '/gallery/projekt-2.jpg',
    fallbackImg: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    description: 'Schnelle Iterationen von Gehäusen und Bauteil-Prototypen.'
  },
  {
    id: 'projekt-3',
    title: 'Funktionsmodelle & Design',
    category: 'Design',
    img: '/gallery/projekt-3.jpg',
    fallbackImg: 'https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&q=80&w=800',
    description: 'Ästhetische Designobjekte und komplexe Geometrien.'
  },
  {
    id: 'projekt-4',
    title: 'Kleinserien & On-Demand',
    category: 'Industrial',
    img: '/gallery/projekt-4.jpg',
    fallbackImg: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=800',
    description: 'Skalierbare Produktion von 5 bis 500+ Stück in bester Qualität.'
  },
  {
    id: 'projekt-5',
    title: 'Ersatzteil Rekonstruktion',
    category: 'Ersatzteile',
    img: '/gallery/projekt-5.jpg',
    fallbackImg: 'https://images.unsplash.com/photo-1631415147131-7b7463f8546b?auto=format&fit=crop&q=80&w=800',
    description: 'Nachkonstruktion und Druck von nicht mehr erhältlichen Kunststoffteilen.'
  },
  {
    id: 'projekt-6',
    title: 'Firmenlogos & Schriftzüge',
    category: 'Design',
    img: '/gallery/projekt-6.jpg',
    fallbackImg: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
    description: 'Dreidimensionale Logos und Markenzeichen für Empfangsbereiche.'
  }
];
