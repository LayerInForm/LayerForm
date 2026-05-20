
import React from 'react';

export const CorporateServices: React.FC = () => {
  const services = [
    {
      title: 'FDM Druck',
      desc: 'Präzisionsfertigung mit Filament (PLA, PETG, ABS). Ideal für funktionale Bauteile und Gehäuse.',
      icon: '⚙️',
      tag: 'Technologie'
    },
    {
      title: 'Prototypen',
      desc: 'Von der CAD-Konstruktion zum ersten physischen Modell. Wir begleiten Ihre Produktentwicklung.',
      icon: '💡',
      tag: 'Entwicklung'
    },
    {
      title: 'Kleinserien',
      desc: 'Skalierbare Produktion von 5 bis 500+ Stück. Wirtschaftliche On-Demand Fertigung.',
      icon: '📦',
      tag: 'Produktion'
    },
    {
      title: 'Nachbearbeitung',
      desc: 'Schleifen, Lackieren oder Veredeln – wir geben Ihrem Druck den letzten Schliff.',
      icon: '✨',
      tag: 'Finish'
    }
  ];

  return (
    <section id="services" className="py-24 md:py-40 px-4 md:px-6 max-w-7xl mx-auto text-center">
      <div className="flex flex-col items-center mb-16 md:mb-24 gap-6 md:gap-10">
        <div className="max-w-3xl mx-auto">
          <span className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.4em] text-[#00E5FF] mb-4 md:mb-6 block">Fähigkeiten</span>
          <h2 className="text-3xl md:text-6xl font-bold tracking-tight leading-tight">Unsere Leistungen</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-3 md:gap-6">
          <div className="glass px-6 py-2 md:px-8 md:py-3 rounded-full text-[9px] md:text-[10px] font-bold border-white/5 uppercase tracking-widest text-[#00E5FF]">Modernste Hardware</div>
          <div className="glass px-6 py-2 md:px-8 md:py-3 rounded-full text-[9px] md:text-[10px] font-bold border-white/5 uppercase tracking-widest text-[#00E5FF]">Höchste Präzision</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
        {services.map((service, idx) => (
          <div key={idx} className="group glass rounded-[24px] md:rounded-[40px] p-6 sm:p-10 md:p-12 hover:border-[#00E5FF]/40 transition-all duration-500 flex flex-col items-center">
            <div className="text-4xl md:text-6xl mb-6 md:mb-10 grayscale group-hover:grayscale-0 transition-transform duration-500 group-hover:scale-110">{service.icon}</div>
            <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-5">{service.title}</h3>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-6 md:mb-10 font-light">{service.desc}</p>
            <div className="pt-6 md:pt-10 border-t border-white/5 w-full mt-auto">
              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-[#00E5FF] group-hover:text-cyan-400 transition-colors cursor-pointer">Details anfragen →</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
