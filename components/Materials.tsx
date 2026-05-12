import React from 'react';

const materials = [
  {
    name: 'PLA (Polylactid)',
    type: 'FDM',
    props: ['Biologisch abbaubar', 'Einfach zu drucken', 'Viele Farben'],
    use: 'Hobby, Design-Modelle, Prototypen',
    color: '#00E5FF'
  },
  {
    name: 'PETG',
    type: 'FDM',
    props: ['Witterungsbeständig', 'Schlagfest', 'Lebensmittelecht'],
    use: 'Funktionsteile, Außenbereich, Halterungen',
    color: '#0288d1'
  },
  {
    name: 'ABS',
    type: 'FDM',
    props: ['Hitzebeständig', 'Sehr stabil', 'Nachbearbeitbar'],
    use: 'Gehäuse, technische Bauteile, Automotive',
    color: '#ffb300'
  }
];

export const Materials: React.FC = () => {
  return (
    <section id="materials" className="py-40 px-6 max-w-7xl mx-auto">
      <div className="mb-24 text-center max-w-3xl mx-auto">
        <span className="text-[10px] font-bold uppercase tracking-[0.43em] text-[#00E5FF] mb-6 block">Materialien</span>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">Hochleistungskunststoffe.</h2>
        <p className="text-gray-500 text-lg font-light leading-relaxed">
          Für jedes Projekt das richtige Material. Wir beraten Sie gerne bei der Auswahl der optimalen Eigenschaften für Ihre Anwendung.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
        {materials.map((m, idx) => (
          <div key={idx} className="glass rounded-[40px] p-12 flex flex-col items-center text-center hover:border-[#00E5FF]/40 transition-all duration-500 group">
            <div 
              className="w-16 h-16 rounded-2xl mb-8 flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: `${m.color}20`, color: m.color, border: `1px solid ${m.color}40` }}
            >
              {m.type}
            </div>
            <h3 className="text-2xl font-bold mb-4">{m.name}</h3>
            
            <div className="space-y-4 mb-10 flex-grow">
              {m.props.map((p, i) => (
                <div key={i} className="flex items-center justify-center text-base text-gray-400">
                  <span className="w-2 h-2 rounded-full bg-[#00E5FF] mr-4"></span>
                  {p}
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-white/5 w-full">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#00E5FF] block mb-3">Einsatzgebiete</span>
              <p className="text-sm text-gray-500 leading-relaxed font-light">{m.use}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
