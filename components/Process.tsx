
import React from 'react';

export const Process: React.FC = () => {
  const steps = [
    {
      title: 'Anfrage',
      desc: 'Senden Sie uns Ihre STL-Datei oder Skizze. Wir prüfen Details und Materialwahl.',
      icon: '01'
    },
    {
      title: 'Kalkulation',
      desc: 'Sie erhalten ein präzises Angebot basierend auf Druckzeit und Materialaufwand.',
      icon: '02'
    },
    {
      title: 'Druck',
      desc: 'Fertigung auf industriellen Bambu Lab Systemen mit höchster Oberflächengüte.',
      icon: '03'
    },
    {
      title: 'Lieferung',
      desc: 'Sorgfältige Prüfung, ggf. Nachbearbeitung und schneller, sicherer Versand.',
      icon: '04'
    }
  ];

  return (
    <section id="process" className="py-48 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-32 max-w-3xl mx-auto">
        <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#00E5FF] mb-6 block">Der Workflow</span>
        <h2 className="text-4xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">Vom Entwurf zum fertigen Bauteil.</h2>
        <p className="text-gray-500 text-lg font-light leading-relaxed">
          Unser transparenter Prozess garantiert Ihnen beste Ergebnisse bei minimalem Aufwand.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 relative">
        <div className="hidden lg:block absolute top-[60px] left-0 w-full h-[1px] bg-white/5"></div>
        
        {steps.map((step, idx) => (
          <div key={idx} className="relative group z-10 flex flex-col items-center text-center">
            <div className="w-28 h-28 glass rounded-full flex items-center justify-center mb-12 border-white/5 transition-all duration-700 group-hover:border-[#00E5FF]/40 group-hover:scale-110 shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
              <span className="text-3xl font-black group-hover:text-[#00E5FF] tracking-tighter">{step.icon}</span>
            </div>
            <h3 className="font-bold text-2xl mb-5 tracking-tight">{step.title}</h3>
            <p className="text-gray-500 font-light leading-relaxed text-base max-w-[240px] opacity-80 group-hover:opacity-100 transition-opacity">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
