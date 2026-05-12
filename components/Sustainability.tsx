
import React from 'react';
import { motion } from 'motion/react';

export const Sustainability: React.FC = () => {
  const cards = [
    {
      title: "Verantwortung",
      description: "Wir arbeiten bewusst ressourcenschonend. Durch On-Demand-Produktion vermeiden wir Überbestände.",
      icon: "🌱",
    },
    {
      title: "Materialien",
      description: "Einsatz von Filamenten auf Basis nachwachsender Rohstoffe (z. B. PLA) und Recycling von Testdrucken.",
      icon: "♻️",
    },
    {
      title: "Kreislauf",
      description: "Wir verwenden Spulen wieder und minimieren Plastikmüll. Fehlgeschlagene Drucke werden dem Recycling zugeführt.",
      icon: "📦",
    },
    {
      title: "Versand",
      description: "Plastikfreie Verpackung ist Standard. Wir versenden überwiegend in Kartonagen aus Pappe.",
      icon: "🚚",
    }
  ];

  return (
    <section id="sustainability" className="py-40 px-6 max-w-7xl mx-auto text-center">
      <div className="flex flex-col items-center mb-24 gap-10">
        <div className="max-w-3xl mx-auto">
          <span className="text-[10px] font-bold text-[#00E5FF] uppercase tracking-[0.5em] mb-6 block">Philosophie</span>
          <h2 className="text-4xl md:text-7xl font-bold tracking-tight leading-tight">
            Nachhaltigkeit trifft <br /> High-End Fertigung.
          </h2>
        </div>
        <p className="text-gray-500 max-w-3xl mx-auto text-lg md:text-xl font-light leading-relaxed">
          3D-Druck ist von Natur aus effizient. Wir gehen einen Schritt weiter und gestalten jeden Prozessschritt bewusst nachhaltig, um Ressourcen für die Zukunft zu schonen.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {cards.map((card, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="p-12 glass rounded-[48px] border-white/5 hover:border-[#00E5FF]/20 transition-all group flex flex-col items-center shadow-xl"
          >
            <div className="text-5xl mb-10 group-hover:scale-110 transition-transform inline-block">
              {card.icon}
            </div>
            <h3 className="text-2xl font-bold mb-5 tracking-tight">{card.title}</h3>
            <p className="text-gray-500 leading-relaxed text-base font-light">
              {card.description}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-32 p-16 glass rounded-[64px] relative overflow-hidden border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.4)] text-left">
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-[#00E5FF]/5 to-transparent pointer-events-none"></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h3 className="text-3xl md:text-5xl font-bold mb-8 underline decoration-[#00E5FF]/30 underline-offset-12 decoration-4">B2B & B2C Expertise</h3>
            <p className="text-gray-400 font-light mb-10 leading-relaxed text-lg md:text-xl">
              Egal ob Privatkunde mit einer kreativen Idee oder Unternehmen mit Bedarf an Serienproduktion – wir konstruieren gemeinsam die perfekte Lösung. Schicken Sie uns einfach Ihre Datei oder Vision. In einem persönlichen Gespräch finden wir den optimalen Weg für Ihr Projekt.
            </p>
            <div className="flex flex-wrap gap-4">
              {['STL', 'STEP', 'OBJ', 'B2B', 'B2C', 'PROTOTYPING'].map((mat) => (
                <span key={mat} className="px-6 py-3 bg-white/5 rounded-full text-[#00E5FF] text-[11px] font-black tracking-widest border border-white/5 uppercase">
                  {mat}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-8">
            <div className="flex items-start gap-8 p-6 glass border-white/5 rounded-[32px] hover:bg-white/5 transition-colors">
              <div className="w-14 h-14 rounded-2xl glass border-white/10 flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#00E5FF]/10">
                <svg className="w-6 h-6 text-[#00E5FF]" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
              </div>
              <div>
                <h4 className="font-bold mb-2 uppercase tracking-widest text-xs text-[#00E5FF]">Persönliche Beratung</h4>
                <p className="text-gray-500 text-sm font-light leading-relaxed text-base">Direkter Kontakt über WhatsApp oder Telefon für maximale Transparenz und Geschwindigkeit.</p>
              </div>
            </div>
            <div className="flex items-start gap-8 p-6 glass border-white/5 rounded-[32px] hover:bg-white/5 transition-colors">
              <div className="w-14 h-14 rounded-2xl glass border-white/10 flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#00E5FF]/10">
                <svg className="w-6 h-6 text-[#00E5FF]" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
              </div>
              <div>
                <h4 className="font-bold mb-2 uppercase tracking-widest text-xs text-[#00E5FF]">WhatsApp Katalog</h4>
                <p className="text-gray-500 text-sm font-light leading-relaxed text-base">Stöbern Sie bequem in unserem Katalog nach Inspiration oder bereits fertigen Produktlösungen.</p>
              </div>
            </div>
            <div className="flex items-start gap-8 p-6 glass border-white/5 rounded-[32px] hover:bg-white/5 transition-colors">
              <div className="w-14 h-14 rounded-2xl glass border-white/10 flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#00E5FF]/10">
                <svg className="w-6 h-6 text-[#00E5FF]" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
              </div>
              <div>
                <h4 className="font-bold mb-2 uppercase tracking-widest text-xs text-[#00E5FF]">High-End Präzision</h4>
                <p className="text-gray-500 text-sm font-light leading-relaxed text-base">Modernste Bambu Lab CoreXY Systeme garantieren perfekte Schichten und bestechende Oberflächendetails.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
