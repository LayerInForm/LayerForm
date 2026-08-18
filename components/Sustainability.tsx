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
      description: "Wir verwenden Spulen wieder und minimieren Abfälle. Fehlgeschlagene Probedrucke werden recycelt.",
      icon: "📦",
    },
    {
      title: "Versand",
      description: "Plastikfreie, recyclingfähige Verpackung ist Standard. Wir versenden in Kartonagen aus Pappe.",
      icon: "🚚",
    }
  ];

  return (
    <section id="sustainability" className="py-20 md:py-32 px-4 md:px-6 max-w-7xl mx-auto text-center">
      <div className="flex flex-col items-center mb-14 md:mb-20 gap-4 md:gap-6">
        <div className="max-w-3xl mx-auto">
          <span className="text-[10px] font-bold text-[#00E5FF] uppercase tracking-[0.5em] mb-3 block">Philosophie</span>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight leading-tight px-2">
            Nachhaltigkeit trifft <br /> High-End Fertigung.
          </h2>
        </div>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-lg font-light leading-relaxed px-4 md:px-0">
          3D-Druck ist von Natur aus materialeffizient. Wir gestalten jeden Prozessschritt bewusst nachhaltig und ressourcenschonend.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {cards.map((card, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            viewport={{ once: true }}
            className="p-6 sm:p-8 glass rounded-[24px] md:rounded-[36px] border border-white/5 hover:border-[#00E5FF]/30 transition-all group flex flex-col items-center shadow-xl"
          >
            <div className="text-4xl md:text-5xl mb-5 group-hover:scale-110 transition-transform inline-block">
              {card.icon}
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-3 tracking-tight">{card.title}</h3>
            <p className="text-gray-400 leading-relaxed text-sm font-light">
              {card.description}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 md:mt-24 p-6 sm:p-10 md:p-14 glass rounded-[28px] md:rounded-[48px] relative overflow-hidden border border-white/5 shadow-2xl text-left">
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-[#00E5FF]/5 to-transparent pointer-events-none"></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div>
            <span className="text-[10px] font-bold text-[#00E5FF] uppercase tracking-[0.4em] mb-2 block">Individuell & Skalierbar</span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-4 leading-tight">
              B2B & B2C <span className="text-glow text-[#00E5FF]">Expertise.</span>
            </h3>
            <p className="text-gray-400 font-light mb-6 leading-relaxed text-sm md:text-base">
              Egal ob Privatkunde mit einer kreativen Idee oder Unternehmen mit Bedarf an Serienfertigung – wir konstruieren gemeinsam die perfekte Lösung. Schicken Sie uns einfach Ihre CAD-Datei oder Skizze.
            </p>
            <div className="flex flex-wrap gap-2">
              {['STL', 'STEP', 'OBJ', 'B2B', 'B2C', 'PROTOTYPING'].map((mat) => (
                <span key={mat} className="px-3.5 py-1.5 bg-white/5 rounded-full text-[#00E5FF] text-[10px] font-black tracking-wider border border-white/5 uppercase">
                  {mat}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 glass border border-white/5 rounded-2xl hover:bg-white/5 transition-colors">
              <div className="w-10 h-10 rounded-xl glass border border-white/10 flex items-center justify-center flex-shrink-0 text-[#00E5FF]">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
              </div>
              <div>
                <h4 className="font-bold mb-1 uppercase tracking-wider text-xs text-[#00E5FF]">Persönliche Beratung</h4>
                <p className="text-gray-400 text-xs md:text-sm font-light leading-relaxed">Direkter Kontakt über WhatsApp, Telefon oder vor Ort für schnelle Abstimmung.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 glass border border-white/5 rounded-2xl hover:bg-white/5 transition-colors">
              <div className="w-10 h-10 rounded-xl glass border border-white/10 flex items-center justify-center flex-shrink-0 text-[#00E5FF]">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
              </div>
              <div>
                <h4 className="font-bold mb-1 uppercase tracking-wider text-xs text-[#00E5FF]">Schnelle Umsetzung</h4>
                <p className="text-gray-400 text-xs md:text-sm font-light leading-relaxed">Kurze Vorlaufzeiten durch hochoptimierte Druckprofile und CoreXY-Geschwindigkeit.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 glass border border-white/5 rounded-2xl hover:bg-white/5 transition-colors">
              <div className="w-10 h-10 rounded-xl glass border border-white/10 flex items-center justify-center flex-shrink-0 text-[#00E5FF]">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
              </div>
              <div>
                <h4 className="font-bold mb-1 uppercase tracking-wider text-xs text-[#00E5FF]">High-End Präzision</h4>
                <p className="text-gray-400 text-xs md:text-sm font-light leading-relaxed">Modernste Bambu Lab Systeme garantieren makellose Schichten und saubere Passungen.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
