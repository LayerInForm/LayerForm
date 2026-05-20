
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
    <section id="sustainability" className="py-24 md:py-40 px-4 md:px-6 max-w-7xl mx-auto text-center">
      <div className="flex flex-col items-center mb-16 md:mb-24 gap-6 md:gap-10">
        <div className="max-w-3xl mx-auto">
          <span className="text-[10px] font-bold text-[#00E5FF] uppercase tracking-[0.5em] mb-4 md:mb-6 block">Philosophie</span>
          <h2 className="text-3xl sm:text-4xl md:text-7xl font-bold tracking-tight leading-tight px-2">
            Nachhaltigkeit trifft <br /> High-End Fertigung.
          </h2>
        </div>
        <p className="text-gray-400 max-w-3xl mx-auto text-sm md:text-xl font-light leading-relaxed px-4 md:px-0">
          3D-Druck ist von Natur aus effizient. Wir gehen einen Schritt weiter und gestalten jeden Prozessschritt bewusst nachhaltig, um Ressourcen für die Zukunft zu schonen.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
        {cards.map((card, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="p-6 sm:p-10 md:p-12 glass rounded-[28px] md:rounded-[48px] border-white/5 hover:border-[#00E5FF]/20 transition-all group flex flex-col items-center shadow-xl"
          >
            <div className="text-4xl md:text-5xl mb-6 md:mb-10 group-hover:scale-110 transition-transform inline-block">
              {card.icon}
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-5 tracking-tight">{card.title}</h3>
            <p className="text-gray-500 leading-relaxed text-sm md:text-base font-light">
              {card.description}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 md:mt-32 p-6 sm:p-12 md:p-16 glass rounded-[32px] md:rounded-[64px] relative overflow-hidden border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.4)] text-left">
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-[#00E5FF]/5 to-transparent pointer-events-none"></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          <div>
            <span className="text-[10px] font-bold text-[#00E5FF] uppercase tracking-[0.4em] mb-3 block">Individuell & Skalierbar</span>
            <h3 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight mb-6 md:mb-8 leading-tight">
              B2B & B2C <span className="text-glow text-[#00E5FF]">Expertise.</span>
            </h3>
            <p className="text-gray-400 font-light mb-8 md:mb-10 leading-relaxed text-sm md:text-lg">
              Egal ob Privatkunde mit einer kreativen Idee oder Unternehmen mit Bedarf an Serienproduktion – wir konstruieren gemeinsam die perfekte Lösung. Schicken Sie uns einfach Ihre Datei oder Vision. In einem persönlichen Gespräch finden wir den optimalen Weg für Ihr Projekt.
            </p>
            <div className="flex flex-wrap gap-2 md:gap-4">
              {['STL', 'STEP', 'OBJ', 'B2B', 'B2C', 'PROTOTYPING'].map((mat) => (
                <span key={mat} className="px-4 py-2 md:px-6 md:py-3 bg-white/5 rounded-full text-[#00E5FF] text-[9px] md:text-[11px] font-black tracking-widest border border-white/5 uppercase">
                  {mat}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-6 md:space-y-8">
            <div className="flex items-start gap-4 md:gap-8 p-4 md:p-6 glass border-white/5 rounded-[24px] md:rounded-[32px] hover:bg-white/5 transition-colors">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl glass border-white/10 flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#00E5FF]/10">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-[#00E5FF]" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
              </div>
              <div>
                <h4 className="font-bold mb-1 md:mb-2 uppercase tracking-widest text-[10px] md:text-xs text-[#00E5FF]">Persönliche Beratung</h4>
                <p className="text-gray-500 text-xs md:text-sm font-light leading-relaxed">Direkter Kontakt über WhatsApp oder Telefon für maximale Transparenz und Geschwindigkeit.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 md:gap-8 p-4 md:p-6 glass border-white/5 rounded-[24px] md:rounded-[32px] hover:bg-white/5 transition-colors">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl glass border-white/10 flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#00E5FF]/10">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-[#00E5FF]" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
              </div>
              <div>
                <h4 className="font-bold mb-1 md:mb-2 uppercase tracking-widest text-[10px] md:text-xs text-[#00E5FF]">WhatsApp Katalog</h4>
                <p className="text-gray-500 text-xs md:text-sm font-light leading-relaxed">Stöbern Sie bequem in unserem Katalog nach Inspiration oder bereits fertigen Produktlösungen.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 md:gap-8 p-4 md:p-6 glass border-white/5 rounded-[24px] md:rounded-[32px] hover:bg-white/5 transition-colors">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl glass border-white/10 flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#00E5FF]/10">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-[#00E5FF]" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
              </div>
              <div>
                <h4 className="font-bold mb-1 md:mb-2 uppercase tracking-widest text-[10px] md:text-xs text-[#00E5FF]">High-End Präzision</h4>
                <p className="text-gray-500 text-xs md:text-sm font-light leading-relaxed">Modernste Bambu Lab CoreXY Systeme garantieren perfekte Schichten und bestechende Oberflächendetails.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
