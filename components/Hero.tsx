
import React from 'react';

interface HeroProps {
  onShopClick: () => void;
  onInquiryClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopClick, onInquiryClick }) => {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-32 md:pt-48 md:pb-56 flex flex-col items-center text-center">
        
        {/* Animated Badge */}
        <div className="mb-12 animate-fade-in opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
          <span className="inline-flex items-center px-6 py-2 rounded-full bg-gray-50 text-[13px] font-semibold text-gray-800 border border-gray-100 shadow-sm">
            <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-pulse"></span>
            Bambu Lab Hochpräzisions-Druck
          </span>
        </div>

        <h1 className="text-[52px] leading-[1.05] md:text-[100px] font-bold tracking-[-0.05em] mb-10 text-[#1d1d1f] animate-fade-in">
          Echtes Handwerk.<br />
          <span className="bg-gradient-to-b from-blue-400 to-blue-700 bg-clip-text text-transparent">Digital geformt.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mb-16 leading-relaxed font-light animate-fade-in opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          Wir fertigen exklusive Design-Objekte und präzise Funktionsteile auf modernsten Fertigungssystemen. In Bargteheide.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-8 animate-fade-in opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
          <button 
            onClick={onShopClick}
            className="w-full sm:w-auto bg-black text-white px-12 py-5 rounded-full font-bold text-lg hover:scale-[1.03] transition-soft active:scale-95 shadow-2xl shadow-black/10"
          >
            Kollektion entdecken
          </button>
          <button 
            onClick={onInquiryClick}
            className="group flex items-center text-lg font-bold text-gray-900 hover:text-blue-600 transition-soft"
          >
            Eigenes Projekt anfragen
            <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </section>
  );
};
