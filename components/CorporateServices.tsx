import React from 'react';
import { motion } from 'motion/react';
import { Layers, Cpu, Box, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

interface CorporateServicesProps {
  onInquiryClick?: () => void;
}

export const CorporateServices: React.FC<CorporateServicesProps> = ({ onInquiryClick }) => {
  return (
    <section id="services" className="py-16 md:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-14 gap-6">
        <div className="max-w-xl">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0096C7] bg-sky-50 border border-sky-100 px-3.5 py-1 rounded-full mb-3 inline-block">
            Leistungen
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-2 mt-1">
            Fertigung &amp; Engineering.
          </h2>
          <p className="text-slate-600 text-base md:text-lg font-normal">
            Präzise 3D-Drucke, CAD-Konstruktion und additive Kleinserien.
          </p>
        </div>

        {onInquiryClick && (
          <button
            onClick={onInquiryClick}
            className="self-start md:self-end px-5 py-2.5 rounded-full bg-white border border-slate-200 hover:border-[#0096C7] text-slate-800 text-xs font-bold uppercase tracking-wider transition-all shadow-2xs hover:shadow flex items-center space-x-2"
          >
            <span>Projekt anfragen</span>
            <ArrowRight size={14} className="text-[#0096C7]" />
          </button>
        )}
      </div>

      {/* Modern Bento-style Service Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Card 1: Core 3D Printing */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4 }}
          className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs hover:shadow-md hover:border-[#0096C7]/50 transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="w-11 h-11 rounded-2xl bg-sky-50 text-[#0096C7] flex items-center justify-center group-hover:bg-[#0096C7] group-hover:text-white transition-colors shadow-2xs">
                <Layers size={22} />
              </div>
              <span className="text-[11px] uppercase font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 tracking-wider">
                CoreXY
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 group-hover:text-[#0096C7] transition-colors">
              FDM 3D-Druck
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-5 font-normal">
              Präzise Fertigung mit hoher Maßhaltigkeit und Schichtstärken ab 0.08 mm. Materialien: PLA, PETG, ABS, ASA, TPU &amp; Carbon.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-xs text-slate-700 font-medium">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 size={14} className="text-[#0096C7] flex-shrink-0" />
              <span>Passgenau</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 size={14} className="text-[#0096C7] flex-shrink-0" />
              <span>Stabil</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 size={14} className="text-[#0096C7] flex-shrink-0" />
              <span>Glatt</span>
            </div>
          </div>
        </motion.div>

        {/* Card 2: CAD-Konstruktion */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="md:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs hover:shadow-md hover:border-[#0096C7]/50 transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="w-11 h-11 rounded-2xl bg-sky-50 text-[#0096C7] flex items-center justify-center group-hover:bg-[#0096C7] group-hover:text-white transition-colors shadow-2xs">
                <Cpu size={22} />
              </div>
              <span className="text-[11px] uppercase font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 tracking-wider">
                CAD
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 group-hover:text-[#0096C7] transition-colors">
              CAD-Konstruktion
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-5 font-normal">
              Von der Skizze oder dem Musterteil zum fertigungsgerechten 3D-Modell (STEP, STL, 3MF).
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Rekonstruktion &amp; Design</span>
            <ArrowRight size={14} className="text-[#0096C7]" />
          </div>
        </motion.div>

        {/* Card 3: Kleinserien */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: 0.16 }}
          className="md:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs hover:shadow-md hover:border-[#0096C7]/50 transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="w-11 h-11 rounded-2xl bg-sky-50 text-[#0096C7] flex items-center justify-center group-hover:bg-[#0096C7] group-hover:text-white transition-colors shadow-2xs">
                <Box size={22} />
              </div>
              <span className="text-[11px] uppercase font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 tracking-wider">
                Serie
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-[#0096C7] transition-colors">
              Kleinserien &amp; B2B
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-5 font-normal">
              Wirtschaftliche Produktion von 1 bis 500+ Stück ohne Werkzeugkosten für Gehäuse, Halterungen und Vorrichtungen.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Keine Mindestmenge</span>
            <span className="text-[#0096C7] font-bold">1–500+ Stück</span>
          </div>
        </motion.div>

        {/* Card 4: Rapid Prototyping */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: 0.24 }}
          className="md:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs hover:shadow-md hover:border-[#0096C7]/50 transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="w-11 h-11 rounded-2xl bg-sky-50 text-[#0096C7] flex items-center justify-center group-hover:bg-[#0096C7] group-hover:text-white transition-colors shadow-2xs">
                <Zap size={22} />
              </div>
              <span className="text-[11px] uppercase font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 tracking-wider">
                Express
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-[#0096C7] transition-colors">
              Prototypen &amp; Muster
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-5 font-normal">
              Schnelle Funktionsmuster zur Prüfung von Geometrie, Haptik und Passgenauigkeit.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Lieferzeit</span>
            <span className="text-[#0096C7] font-bold">&lt; 48h Vorlauf</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
