
import React from 'react';

export const CorporateServices: React.FC = () => {
  const services = [
    {
      title: 'Individualisierte Objekte',
      desc: 'Ob personalisierte Logos, Namensschilder oder Dekorelemente: Wir fertigen Einzelstücke (1-5) oder Branding-Pakete – perfekt für Office-Design oder Premium-Präsente.',
      img: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Maßgeschneiderte Bauteile',
      desc: 'Technische Prototypen und Spezialanfertigungen. Wir realisieren Ihre CAD-Daten als präzises Unikat oder in funktionalen Test-Serien ab 6 Stück.',
      img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Events & Kleinserien',
      desc: 'Einzigartige Pokale oder Merchandise in passgenauen Mengen (1 bis 500+ Stück). Wir skalieren unsere Produktion effizient für Ihr spezifisches Vorhaben.',
      img: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800'
    }
  ];

  const b2bFeatures = [
    { title: 'NDA & Vertraulichkeit', desc: 'Sichere Abwicklung Ihrer Prototypen und Designs.' },
    { title: 'CAD Optimierung', desc: 'Wir prüfen Ihre Daten auf Druckbarkeit und Funktion.' },
    { title: 'Maximale Flexibilität', desc: 'Von 1 Unikat bis zur 500er Serie in Rekordzeit.' }
  ];

  return (
    <section className="py-24 bg-white border-t border-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-20">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#00E5FF] mb-4 block">Full-Service Manufaktur</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1d1d1f]">Alles ist möglich. Von 1 bis 500+.</h2>
          <p className="text-gray-500 mt-6 text-xl font-light max-w-3xl leading-relaxed">
            Wir sind Ihr Partner für On-Demand Fertigung. Ob exklusives Einzelstück oder durchdachte Kleinserie – wir liefern Präzision in jeder Größenordnung.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {services.map((service, idx) => (
            <div key={idx} className="group">
              <div className="aspect-[4/3] rounded-[32px] overflow-hidden mb-8 border border-gray-100 shadow-sm">
                <img src={service.img} alt={service.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
              <p className="text-gray-500 font-light leading-relaxed">{service.desc}</p>
            </div>
          ))}
        </div>

        {/* B2B Partner Section */}
        <div className="mt-32 pt-24 border-t border-gray-50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-8">Ihr B2B-Partner für additive Fertigung.</h3>
              <div className="space-y-8">
                {b2bFeatures.map((f, i) => (
                  <div key={i} className="flex items-start space-x-6">
                    <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-3 h-3 text-[#00E5FF]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{f.title}</h4>
                      <p className="text-gray-500 font-light">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#001C3D] p-12 rounded-[48px] text-white shadow-2xl">
              <h4 className="text-2xl font-bold mb-6">Projekt direkt besprechen?</h4>
              <p className="text-blue-100/70 mb-10 font-light leading-relaxed text-lg">
                Wir verstehen, dass Business-Projekte oft eine direkte Abstimmung erfordern. Nutzen Sie unseren Fast-Track für Firmenanfragen.
              </p>
              <div className="flex flex-col gap-4">
                <a href="https://wa.me/4915565994781" target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white px-8 py-5 rounded-full font-bold text-center hover:scale-[1.03] transition-soft shadow-lg">
                  WhatsApp Fast-Track
                </a>
                <a href="mailto:layerform@web.de" className="bg-white text-[#001C3D] px-8 py-5 rounded-full font-bold text-center hover:bg-[#00E5FF] hover:text-white transition-soft shadow-lg">
                  Offizielle Anfrage per Mail
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
