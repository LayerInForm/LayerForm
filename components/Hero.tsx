import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  MessageSquare, 
  Layers, 
  ShieldCheck, 
  Zap, 
  Star,
  Printer,
  FileCode
} from 'lucide-react';
import { WHATSAPP_LINK, GOOGLE_MAPS_LINK } from '../src/constants';

interface HeroProps {
  onShopClick: () => void;
  onInquiryClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopClick, onInquiryClick }) => {
  return (
    <section className="relative pt-24 sm:pt-32 md:pt-40 pb-12 sm:pb-16 md:pb-24 px-4 sm:px-6 overflow-hidden">
      {/* Subtle Background Lighting & Grid */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-8 sm:top-12 left-1/2 -translate-x-1/2 w-[350px] sm:w-[650px] md:w-[850px] h-[350px] sm:h-[450px] bg-gradient-to-b from-sky-100/70 via-cyan-50/30 to-transparent rounded-full blur-3xl" />
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: 'linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)', 
            backgroundSize: '28px 28px' 
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto text-center">
        {/* Top 3D Printing Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center space-x-2 bg-white border border-slate-200/90 px-3.5 py-1.5 rounded-full shadow-2xs mb-5 sm:mb-6"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0096C7] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0096C7]"></span>
          </span>
          <span className="text-[10px] sm:text-xs font-bold text-slate-800 tracking-wide font-mono uppercase">
            3D-Druck &amp; CAD-Fertigung
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.12] sm:leading-[1.08] mb-4 sm:mb-6 max-w-4xl mx-auto"
        >
          Präziser <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0077B6] via-[#0096C7] to-[#00B4D8]">3D-Druck</span> nach Maß.
        </motion.h1>
        
        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-sm sm:text-base md:text-lg text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10 px-1"
        >
          Wir fertigen Ihre Bauteile, Prototypen und Kleinserien schnell und passgenau. Schicken Sie uns einfach Ihre 3D-Datei oder Idee.
        </motion.p>
        
        {/* Call to Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-md sm:max-w-none mx-auto mb-8 sm:mb-10"
        >
          <button 
            onClick={onInquiryClick}
            className="group w-full sm:w-auto bg-[#0096C7] hover:bg-[#0077B6] text-white px-7 py-4 rounded-full font-bold text-sm sm:text-base transition-all shadow-md hover:shadow-cyan-500/20 active:scale-98 flex items-center justify-center space-x-2 min-h-[48px]"
          >
            <Printer size={18} />
            <span>Projekt anfragen</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <a 
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-6 py-4 rounded-full font-bold text-sm sm:text-base transition-all shadow-2xs flex items-center justify-center space-x-2 min-h-[48px] active:scale-98"
          >
            <MessageSquare size={18} className="text-[#25D366]" />
            <span>WhatsApp Chat</span>
          </a>
        </motion.div>

        {/* Supported Formats */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-500 font-mono mb-10 sm:mb-14">
          <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] sm:text-[11px] mr-1">Dateiformate:</span>
          <span className="px-2.5 py-1 rounded-md bg-slate-200/70 text-slate-800 font-bold">.STEP</span>
          <span className="px-2.5 py-1 rounded-md bg-slate-200/70 text-slate-800 font-bold">.STL</span>
          <span className="px-2.5 py-1 rounded-md bg-slate-200/70 text-slate-800 font-bold">.3MF</span>
          <span className="px-2.5 py-1 rounded-md bg-slate-200/70 text-slate-800 font-bold">.OBJ</span>
        </div>

        {/* Value Highlights Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 p-2.5 sm:p-4 bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200/90 shadow-2xs text-left"
        >
          <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-100 flex items-center space-x-2.5 sm:space-x-3.5 shadow-2xs">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-sky-50 text-[#0096C7] flex items-center justify-center flex-shrink-0">
              <Zap size={16} className="sm:w-[18px] sm:h-[18px]" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 truncate">Express &lt; 48h</div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate">Schneller Vorlauf</div>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-100 flex items-center space-x-2.5 sm:space-x-3.5 shadow-2xs">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-sky-50 text-[#0096C7] flex items-center justify-center flex-shrink-0">
              <Layers size={16} className="sm:w-[18px] sm:h-[18px]" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 truncate">Passgenau</div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate">Hohe Maßhaltigkeit</div>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-100 flex items-center space-x-2.5 sm:space-x-3.5 shadow-2xs">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-sky-50 text-[#0096C7] flex items-center justify-center flex-shrink-0">
              <FileCode size={16} className="sm:w-[18px] sm:h-[18px]" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 truncate">CAD-Service</div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate">3D-Modellierung</div>
            </div>
          </div>

          <a 
            href={GOOGLE_MAPS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-100 hover:border-[#0096C7]/50 flex items-center space-x-2.5 sm:space-x-3.5 shadow-2xs group transition-colors"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center flex-shrink-0">
              <Star size={16} className="fill-amber-400 text-amber-400 sm:w-[18px] sm:h-[18px]" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 group-hover:text-[#0096C7] transition-colors truncate">5.0 Sterne</div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate">Google Profil</div>
            </div>
          </a>
        </motion.div>
      </div>
    </section>
  );
};
