
import React from 'react';

export const FAQ: React.FC = () => {
  const faqs = [
    { q: 'Welche Hardware kommt zum Einsatz?', a: 'Wir fertigen ausschließlich auf modernsten Bambu Lab CoreXY Systemen. Dies garantiert uns maximale Präzision bei hohen Druckgeschwindigkeiten und makellosen Oberflächen.' },
    { q: 'Welche Materialien sind möglich?', a: 'Standardmäßig bieten wir PLA, PETG und ABS an. Wir können jedoch fast jedes Spezial-Material kurzfristig für Sie beschaffen.' },
    { q: 'Wie lange dauert ein herkömmlicher Druck?', a: 'Kleinere Projekte realisieren wir oft innerhalb von 24-48 Stunden. Größere Serien dauern entsprechend der Kapazität etwas länger, werden aber priorisiert bearbeitet.' },
    { q: 'Bieten Sie auch CAD-Konstruktion an?', a: 'Ja. Wenn Sie eine Idee haben, aber kein fertiges 3D-Modell, konstruieren wir Ihr Bauteil professionell in modernen CAD-Umgebungen.' }
  ];

  return (
    <section id="faq" className="py-48 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-24">
        <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#00E5FF] mb-6 block">Wissenstransfer</span>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-10 leading-tight">Häufig gestellte Fragen</h2>
        <p className="text-gray-500 text-lg font-light max-w-2xl mx-auto">Alles Wissenswerte rund um unsere Fertigungsprozesse.</p>
      </div>
      
      <div className="space-y-8">
        {faqs.map((faq, idx) => (
          <div key={idx} className="glass rounded-[40px] p-10 md:p-12 border-white/5 hover:border-[#00E5FF]/20 transition-all duration-500 shadow-xl">
            <h3 className="text-xl md:text-2xl font-bold mb-6 text-[#00E5FF] flex items-start">
              <span className="w-2 h-2 rounded-full bg-[#00E5FF] mr-4 mt-3 flex-shrink-0"></span>
              {faq.q}
            </h3>
            <p className="text-gray-400 leading-relaxed font-light text-base md:text-lg pl-6 border-l border-white/5 ml-1">
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
