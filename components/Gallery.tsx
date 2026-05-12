import React from 'react';

const projects = [
  {
    title: 'Industrielle Bauteile',
    category: 'Engineering',
    img: 'https://images.unsplash.com/photo-1543069110-239103986877?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'Custom Prototyping',
    category: 'Industrial',
    img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'Funktionsmodelle',
    category: 'Design',
    img: 'https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'Textilveredelung',
    category: 'Merchandise',
    img: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&q=80&w=800'
  }
];

export const Gallery: React.FC = () => {
  return (
    <section id="gallery" className="py-48 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-12 text-center md:text-left">
        <div className="max-w-2xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#00E5FF] mb-6 block">Inspiration</span>
          <h2 className="text-4xl md:text-7xl font-bold tracking-tight mb-8">Projektgalerie.</h2>
          <p className="text-gray-400 font-light text-xl md:text-2xl leading-relaxed">Einblicke in unsere Präzisionsfertigung und realisierte Kundenprojekte weltweit.</p>
        </div>
        <button className="px-10 py-5 glass border-white/10 rounded-full text-sm font-black uppercase tracking-widest hover:bg-[#00E5FF] hover:text-black transition-all hover:scale-105 active:scale-95 shadow-xl">
          Alle Projekte ansehen
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {projects.map((p, idx) => (
          <div key={idx} className="group relative aspect-[4/5] rounded-[48px] overflow-hidden bg-white/5 glass border border-white/5 hover:border-[#00E5FF]/30 transition-all duration-700 shadow-2xl">
            <img 
              src={p.img} 
              alt={p.title} 
              className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 p-10 flex flex-col justify-end">
              <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#00E5FF] mb-3">{p.category}</span>
              <h3 className="text-2xl font-bold tracking-tight">{p.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
