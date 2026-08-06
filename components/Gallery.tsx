import React, { useState } from 'react';
import { GALLERY_PROJECTS, GalleryProject } from '../data/gallery';

export const Gallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Alle');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const categories = ['Alle', ...Array.from(new Set(GALLERY_PROJECTS.map(p => p.category)))];

  const filteredProjects = selectedCategory === 'Alle' 
    ? GALLERY_PROJECTS 
    : GALLERY_PROJECTS.filter(p => p.category === selectedCategory);

  const handleImageError = (id: string) => {
    setFailedImages(prev => ({ ...prev, [id]: true }));
  };

  return (
    <section id="gallery" className="py-24 md:py-48 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 text-center md:text-left">
        <div className="max-w-2xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#00E5FF] mb-4 block">Inspiration</span>
          <h2 className="text-4xl md:text-7xl font-bold tracking-tight mb-6">Projektgalerie.</h2>
          <p className="text-gray-400 font-light text-lg md:text-2xl leading-relaxed">
            Einblicke in unsere Präzisionsfertigung und realisierte Kundenprojekte.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-3 mb-12 justify-center md:justify-start">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
              selectedCategory === cat
                ? 'bg-[#00E5FF] text-black shadow-lg shadow-[#00E5FF]/20 scale-105'
                : 'glass text-gray-400 hover:text-white hover:border-white/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((p: GalleryProject) => {
          const imgSrc = failedImages[p.id] && p.fallbackImg ? p.fallbackImg : p.img;

          return (
            <div 
              key={p.id} 
              className="group relative aspect-[4/5] rounded-[32px] md:rounded-[40px] overflow-hidden bg-white/5 glass border border-white/5 hover:border-[#00E5FF]/40 transition-all duration-500 shadow-xl"
            >
              <img 
                src={imgSrc} 
                alt={p.title} 
                onError={() => handleImageError(p.id)}
                className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" 
                loading="lazy"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-8 flex flex-col justify-end">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#00E5FF] mb-2">
                  {p.category}
                </span>
                <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-2 text-white">
                  {p.title}
                </h3>
                {p.description && (
                  <p className="text-xs md:text-sm text-gray-300 font-light leading-relaxed">
                    {p.description}
                  </p>
                )}
                <span className="text-[10px] text-gray-400 mt-3 font-mono">
                  Bild-Pfad: {p.img}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
