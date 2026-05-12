
import React from 'react';

interface HeroProps {
  onShopClick: () => void;
  onInquiryClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopClick, onInquiryClick }) => {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 py-20 overflow-hidden">
      {/* Animated Background Mesh */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00E5FF]/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Abstract 3D lines / Grid */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#00E5FF 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="mb-10 animate-fade-in inline-flex items-center space-x-3 glass px-6 py-2.5 rounded-full border-white/5">
          <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping"></span>
          <span className="text-[10px] font-bold text-[#00E5FF] uppercase tracking-[0.5em]">Next Gen Manufacturing</span>
        </div>

        <h1 className="text-[64px] md:text-[140px] leading-[0.85] font-bold tracking-[-0.07em] mb-16 animate-fade-in">
          LayerForm <br />
          <span className="text-glow text-[#00E5FF]">Precision Tech.</span>
        </h1>
        
        <p className="text-xl md:text-3xl text-gray-400 font-light max-w-3xl mx-auto mb-20 leading-relaxed tracking-tight">
          Ihre Vision, perfektioniert durch hochpräzisen 3D-Druck und moderne Textilveredelung. Technisch kompetent, nachhaltig gefertigt.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 animate-fade-in">
          <button 
            onClick={onInquiryClick}
            className="w-full sm:w-auto bg-[#00E5FF] text-black px-16 py-7 rounded-full font-bold text-xl hover:scale-[1.05] transition-soft active:scale-95 shadow-[0_0_50px_rgba(0,229,255,0.4)]"
          >
            Jetzt Anfragen
          </button>
          <button 
            onClick={onShopClick}
            className="w-full sm:w-auto glass px-16 py-7 rounded-full font-bold text-xl hover:bg-white/10 transition-soft"
          >
            Leistungen entdecken
          </button>
        </div>
      </div>

      {/* Floating Elements (Visual 3D feel) */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
        <div className="w-[1px] h-12 bg-gradient-to-b from-[#00E5FF] to-transparent"></div>
      </div>
    </section>
  );
};
