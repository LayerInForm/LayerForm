import React from 'react';
import { motion } from 'motion/react';
import { FileUp, FileCheck, Printer, PackageCheck, CheckCircle2 } from 'lucide-react';

export const Process: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'CAD- & Dateicheck',
      desc: 'Datei (STEP/STL) oder Skizze einsenden. Wir prüfen die Fertigbarkeit sofort.',
      icon: FileUp,
      tag: 'STEP, STL, 3MF'
    },
    {
      num: '02',
      title: 'Angebot',
      desc: 'Transparenter Kostenvoranschlag mit Materialempfehlung und Lieferzeit.',
      icon: FileCheck,
      tag: '< 24h Antwort'
    },
    {
      num: '03',
      title: '3D-Fertigung',
      desc: 'Produktion auf modernen CoreXY Systemen mit passgenauen Toleranzen.',
      icon: Printer,
      tag: 'CoreXY Flotte'
    },
    {
      num: '04',
      title: 'Prüfung & Versand',
      desc: 'Qualitätskontrolle jedes Bauteils und sicherer Direktversand.',
      icon: PackageCheck,
      tag: 'Schneller Versand'
    }
  ];

  return (
    <section id="process" className="py-16 md:py-24 px-4 sm:px-6 max-w-7xl mx-auto bg-slate-50/70 border-y border-slate-200/70">
      <div className="text-center mb-10 md:mb-14 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-[#0096C7] bg-sky-50 border border-sky-100 px-3.5 py-1 rounded-full mb-3 inline-block">
          Ablauf
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-2 mt-1">
          In 4 Schritten zum Bauteil.
        </h2>
        <p className="text-slate-600 text-base md:text-lg font-normal">
          Schnell, transparent und unkompliziert.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="relative bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-[#0096C7]/50 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-sky-50 text-[#0096C7] flex items-center justify-center group-hover:bg-[#0096C7] group-hover:text-white transition-colors shadow-2xs">
                    <Icon size={20} />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400 group-hover:text-[#0096C7] transition-colors tracking-wider">
                    {step.num}
                  </span>
                </div>

                <h3 className="font-bold text-base mb-1.5 text-slate-900 group-hover:text-[#0096C7] transition-colors">
                  {step.title}
                </h3>
                <p className="text-slate-600 font-normal leading-relaxed text-xs mb-4">
                  {step.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>{step.tag}</span>
                <CheckCircle2 size={13} className="text-[#0096C7]" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
