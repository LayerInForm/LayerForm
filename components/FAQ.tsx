import React from 'react';

export const FAQ: React.FC = () => {
  const faqs = [
    { 
      q: 'Welche Hardware kommt zum Einsatz?', 
      a: 'Wir fertigen ausschließlich auf modernsten Bambu Lab CoreXY Systemen. Dies garantiert uns maximale Präzision bei hohen Druckgeschwindigkeiten und makellosen Oberflächen.' 
    },
    { 
      q: 'Welche Materialien sind möglich?', 
      a: 'Standardmäßig bieten wir PLA, PETG und ABS/ASA an. Weitere technische Filamente (z. B. TPU, PA-CF / Carbon) können wir kurzfristig für Sie verarbeiten.' 
    },
    { 
      q: 'Wie lange dauert ein herkömmlicher Druckauftrag?', 
      a: 'Prototypen und kleinere Aufträge realisieren wir meist innerhalb von 24–48 Stunden. Größere Serien staffeln wir transparent nach Ihrem Zeitplan.' 
    },
    { 
      q: 'Bieten Sie auch 3D-CAD-Konstruktion an?', 
      a: 'Ja. Wenn Sie eine Idee, Skizze oder ein defektes Bauteil haben, konstruieren wir Ihr 3D-Modell passgenau in modernen CAD-Umgebungen.' 
    }
  ];

  return (
    <section id="faq" className="py-20 md:py-32 px-4 md:px-6 max-w-5xl mx-auto">
      <div className="text-center mb-14 md:mb-20">
        <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#00E5FF] mb-3 block">Wissenstransfer</span>
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-4 leading-tight">Häufig gestellte Fragen</h2>
        <p className="text-gray-400 text-sm md:text-lg font-light max-w-2xl mx-auto px-2">Alles Wissenswerte rund um unsere Fertigungsprozesse.</p>
      </div>
      
      <div className="space-y-4 md:space-y-6">
        {faqs.map((faq, idx) => (
          <div key={idx} className="glass rounded-[24px] md:rounded-[32px] p-6 md:p-8 border border-white/5 hover:border-[#00E5FF]/20 transition-all duration-300 shadow-lg">
            <h3 className="text-base md:text-xl font-bold mb-3 text-[#00E5FF] flex items-start">
              <span className="w-2 h-2 rounded-full bg-[#00E5FF] mr-3 mt-2 flex-shrink-0"></span>
              {faq.q}
            </h3>
            <p className="text-gray-400 leading-relaxed font-light text-sm md:text-base pl-5 border-l border-white/10 ml-1">
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
