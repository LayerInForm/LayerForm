
import React from 'react';

interface HeroProps {
  onShopClick: () => void;
  onInquiryClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopClick, onInquiryClick }) => {
  return (
    <section className="max-w-5xl mx-auto px-6 py-20 md:py-32 flex flex-col items-center text-center">
      <div className="mb-16 animate-fade-in">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 md:w-44 md:h-44 mb-8 drop-shadow-2xl">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path d="M50 12L85 30L50 48L15 30L50 12Z" fill="#00E5FF" />
              <path d="M15 35L50 53L85 35V42L50 60L15 42V35Z" fill="#00B8D4" />
              <path d="M15 47L50 65L85 47V54L50 72L15 54V47Z" fill="#0097A7" />
              <path d="M15 59L50 77L85 59V66L50 84L15 66V59Z" fill="#006064" />
              <path d="M15 71L50 89L85 71V78L50 96L15 78V71Z" fill="#001C3D" />
              <path d="M50 48V96L85 78V30L50 48Z" fill="black" fillOpacity="0.1" />
            </svg>
          </div>
          <div className="text-4xl md:text-5xl font-bold tracking-tight">
            <span className="text-[#00E5FF]">Layer</span>
            <span className="text-[#001C3D]">Form</span>
          </div>
        </div>
      </div>

      <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.05] text-[#1d1d1f]">
        Präzision in <br/>
        <span className="bg-gradient-to-r from-[#00E5FF] via-[#00B8D4] to-[#0047AB] bg-clip-text text-transparent">jeder Schicht.</span>
      </h1>
      
      <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mb-16 leading-relaxed font-light">
        Von funktionalen technischen Bauteilen bis zu exklusiven Designobjekten. Wir realisieren Ihre Visionen mit industrieller Fertigungsqualität.
      </p>
      
      <div className="flex flex-col items-center space-y-8">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
          <button 
            onClick={onShopClick}
            className="bg-[#001C3D] text-white px-12 py-5 rounded-full font-semibold transition-soft hover:bg-black shadow-xl shadow-cyan-100/30 active:scale-95 text-lg"
          >
            Shop entdecken
          </button>
          <button 
            onClick={onInquiryClick}
            className="text-[#1d1d1f] border border-gray-200 px-10 py-5 rounded-full font-semibold flex items-center group transition-soft hover:bg-gray-50 bg-white"
          >
            Projekt anfragen
            <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-500 animate-fade-in-delayed">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            ))}
          </div>
          <span className="font-medium">Exzellente Kundenbewertungen</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          <span>Handgefertigt in Deutschland</span>
        </div>
      </div>

      <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-16 text-left w-full border-t border-gray-100 pt-20">
        <div className="space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-[#00B8D4]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h3 className="text-xl font-semibold text-[#001C3D]">Industrielle Qualität</h3>
          <p className="text-gray-500 text-base leading-relaxed">
            Wir verarbeiten Premium-Materialien (Carbon-Faser, Nylon, Resin) für Belastbarkeit und perfekte Oberflächen.
          </p>
        </div>
        <div className="space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#0047AB]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h3 className="text-xl font-semibold text-[#001C3D]">Rapid Prototyping</h3>
          <p className="text-gray-500 text-base leading-relaxed">
            Agile Fertigungsprozesse ermöglichen einen Versand Ihrer Bauteile oft innerhalb von 48 Stunden nach Auftrag.
          </p>
        </div>
        <div className="space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#001C3D]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          </div>
          <h3 className="text-xl font-semibold text-[#001C3D]">CAD-Expertise</h3>
          <p className="text-gray-500 text-base leading-relaxed">
            Wir unterstützen Sie bei der Konstruktion und Optimierung Ihrer 3D-Modelle für maximale Funktionalität.
          </p>
        </div>
      </div>
    </section>
  );
};
