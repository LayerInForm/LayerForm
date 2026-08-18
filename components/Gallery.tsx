import React, { useState } from 'react';
import { GALLERY_PROJECTS, GalleryProject } from '../data/gallery';
import { X, ArrowRight } from 'lucide-react';

interface GalleryProps {
  onInquiryClick?: (projectTitle?: string) => void;
}

export const Gallery: React.FC<GalleryProps> = ({ onInquiryClick }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Alle');
  const [activeProject, setActiveProject] = useState<GalleryProject | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const categories = ['Alle', ...Array.from(new Set(GALLERY_PROJECTS.map(p => p.category)))];

  const filteredProjects = selectedCategory === 'Alle' 
    ? GALLERY_PROJECTS 
    : GALLERY_PROJECTS.filter(p => p.category === selectedCategory);

  const handleImageError = (id: string) => {
    setFailedImages(prev => ({ ...prev, [id]: true }));
  };

  return (
    <section id="gallery" className="py-14 sm:py-20 md:py-28 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-5 text-center md:text-left">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0096C7] bg-sky-50 border border-sky-100 px-3.5 py-1 rounded-full mb-3 inline-block">
            Galerie &amp; Referenzen
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-2 mt-1">
            Realisierte Kundenprojekte.
          </h2>
          <p className="text-slate-600 font-normal text-sm sm:text-base md:text-lg">
            Einblicke in aktuelle 3D-Drucke, Halterungen und Sonderanfertigungen.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 sm:flex-wrap gap-2 justify-start sm:justify-center md:justify-end no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap min-h-[38px] flex items-center justify-center ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 active:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Project Grid - Clean, direct, no dark overlay filters or zoom effects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {filteredProjects.map((p: GalleryProject) => {
          const imgSrc = failedImages[p.id] && p.fallbackImg ? p.fallbackImg : p.img;

          return (
            <div 
              key={p.id}
              onClick={() => setActiveProject(p)}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-2xs hover:border-[#0096C7]/60 transition-colors cursor-pointer flex flex-col"
            >
              {/* Photo Area without filters/zooms */}
              <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
                <img 
                  src={imgSrc} 
                  alt={p.title} 
                  onError={() => handleImageError(p.id)}
                  className="w-full h-full object-cover" 
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 border border-slate-200 text-slate-800 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-2xs">
                  {p.category}
                </span>
              </div>
              
              {/* Clean Content Area below the image */}
              <div className="p-4 sm:p-5 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
                    {p.title}
                  </h3>
                  {p.description && (
                    <p className="text-xs text-slate-500 font-normal leading-relaxed line-clamp-2 mb-3">
                      {p.description}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0096C7]">
                  <span>Details ansehen</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 relative my-auto">
            <button
              onClick={() => setActiveProject(null)}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 border border-slate-200 flex items-center justify-center shadow-2xs transition-colors"
              aria-label="Schließen"
            >
              <X size={18} />
            </button>

            <div className="aspect-[16/10] bg-slate-100 relative">
              <img
                src={failedImages[activeProject.id] && activeProject.fallbackImg ? activeProject.fallbackImg : activeProject.img}
                alt={activeProject.title}
                onError={() => handleImageError(activeProject.id)}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 px-3 py-1 bg-white/95 border border-slate-200 text-slate-900 text-xs font-bold rounded-full shadow-2xs">
                {activeProject.category}
              </div>
            </div>

            <div className="p-5 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
                {activeProject.title}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5 font-normal">
                {activeProject.description || "Präzisionsgefertigtes Bauteil mit optimierten Fertigungsparametern für höchste Maßhaltigkeit und Belastbarkeit."}
              </p>

              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block text-[9px] sm:text-[10px] font-mono uppercase">Fertigung</span>
                  <span className="font-bold text-slate-800 text-[11px] sm:text-xs">FDM 3D-Druck</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] sm:text-[10px] font-mono uppercase">Schicht</span>
                  <span className="font-bold text-slate-800 text-[11px] sm:text-xs">ab 0.08 mm</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] sm:text-[10px] font-mono uppercase">Qualität</span>
                  <span className="font-bold text-emerald-600 text-[11px] sm:text-xs">Geprüft</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={() => {
                    const title = activeProject.title;
                    setActiveProject(null);
                    if (onInquiryClick) {
                      onInquiryClick(title);
                    }
                  }}
                  className="flex-1 py-3.5 rounded-2xl bg-[#0096C7] hover:bg-[#0077B6] text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 shadow-2xs min-h-[48px] active:scale-98"
                >
                  <span>Ähnliches Projekt anfragen</span>
                  <ArrowRight size={14} />
                </button>

                <button
                  onClick={() => setActiveProject(null)}
                  className="px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors min-h-[44px]"
                >
                  Schließen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
