
import React from 'react';

export const FAQ: React.FC = () => {
  const faqs = [
    { q: 'Welche Hardware kommt zum Einsatz?', a: 'Wir fertigen ausschließlich auf modernsten Bambu Lab CoreXY Systemen. Dies garantiert uns maximale Präzision bei hohen Druckgeschwindigkeiten und makellosen Oberflächen.' },
    { q: 'Welche Materialien sind möglich?', a: 'Standardmäßig bieten wir PLA, PETG und ABS an. Wir können jedoch fast jedes Spezial-Material kurzfristig für Sie beschaffen.' },
    { q: 'Wie lange dauert ein herkömmlicher Druck?', a: 'Kleinere Projekte realisieren wir oft innerhalb von 24-48 Stunden. Größere Serien dauern entsprechend der Kapazität etwas länger, werden aber priorisiert bearbeitet.' },
    { q: 'Bieten Sie auch CAD-Konstruktion an?', a: 'Ja. Wenn Sie eine Idee haben, aber kein fertiges 3D-Modell, konstruieren wir Ihr Bauteil professionell in modernen CAD-Umgebungen.' }
  ];

  return (
    <section id="faq" className="py-24 md:py-48 px-4 md:px-6 max-w-5xl mx-auto">
      <div className="text-center mb-16 md:mb-24">
        <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#00E5FF] mb-4 md:mb-6 block">Wissenstransfer</span>
        <h2 className="text-3xl md:text-6xl font-bold tracking-tight mb-4 md:mb-10 leading-tight">Häufig gestellte Fragen</h2>
        <p className="text-gray-400 text-sm md:text-lg font-light max-w-2xl mx-auto px-2">Alles Wissenswerte rund um unsere Fertigungsprozesse.</p>
      </div>
      
      <div className="space-y-6 md:space-y-8">
        {faqs.map((faq, idx) => (
          <div key={idx} className="glass rounded-[24px] md:rounded-[40px] p-6 md:p-12 border-white/5 hover:border-[#00E5FF]/20 transition-all duration-500 shadow-xl">
            <h3 className="text-lg md:text-2xl font-bold mb-4 md:mb-6 text-[#00E5FF] flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] mr-3 mt-2.5 flex-shrink-0"></span>
              {faq.q}
            </h3>
            <p className="text-gray-400 leading-relaxed font-light text-sm md:text-lg pl-4 md:pl-6 border-l border-white/5 ml-0.5">
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
