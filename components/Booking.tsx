
import React, { useState } from 'react';

export const Booking: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const meetingTypes = [
    {
      id: 'video-konferenz-video',
      title: 'Video-Konferenz',
      duration: '15-30 Min',
      desc: 'Ideal für die erste Projektbesprechung oder CAD-Reviews. Wir teilen den Bildschirm und gehen Details live durch.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'telefonat-konferenz-telefon',
      title: 'Telefonat',
      duration: '10-20 Min',
      desc: 'Kurze Klärung von Machbarkeit, Material oder Preisen. Unkompliziert, direkt und effizient.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      )
    }
  ];

  /**
   * KONFIGURATION:
   * Basierend auf deinem Screenshot ist dein Nutzername "layerform".
   */
  const CALENDLY_USER = "layerform"; 
  const CALENDLY_BASE_URL = `https://calendly.com/${CALENDLY_USER}`; 

  const handleSelectType = (typeId: string) => {
    setIsLoading(true);
    setSelectedType(typeId);
  };

  if (selectedType) {
    return (
      <section className="max-w-5xl mx-auto px-6 py-12 md:py-20 animate-fade-in">
        <button 
          onClick={() => setSelectedType(null)}
          className="group flex items-center text-sm font-bold text-gray-400 hover:text-black mb-10 transition-soft"
        >
          <svg className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
          Andere Gesprächsart wählen
        </button>

        <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden h-[750px] relative ring-1 ring-black/5">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-gray-100 border-t-[#00E5FF] rounded-full animate-spin mb-4"></div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Kalender wird geladen...</p>
              </div>
            </div>
          )}
          <iframe 
            src={`${CALENDLY_BASE_URL}/${selectedType}?embed_domain=${window.location.hostname}&embed_type=inline&hide_event_type_details=1&hide_gdpr_banner=1&primary_color=00e5ff`}
            width="100%" 
            height="100%" 
            frameBorder="0"
            title="Terminbuchung"
            className="rounded-[40px]"
            onLoad={() => setIsLoading(false)}
          ></iframe>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-6 py-12 md:py-24 animate-fade-in">
      <div className="text-center mb-20">
        <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#00E5FF] mb-4 block">Direkte Abstimmung</span>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-[#1d1d1f]">Kurze Wege. Klare Ziele.</h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
          Wählen Sie die passende Gesprächsart für Ihr Vorhaben. Ihr Projekt wird direkt in unserem Google-Kalender (<span className="text-gray-600 font-medium">layerform@web.de</span>) reserviert.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
        {meetingTypes.map((type) => (
          <div 
            key={type.id} 
            className="group bg-white rounded-[48px] p-12 shadow-sm border border-gray-100 flex flex-col items-center text-center transition-soft hover:shadow-2xl hover:border-blue-50/50 hover:scale-[1.02]"
          >
            <div className="w-24 h-24 bg-[#f5f5f7] rounded-[32px] flex items-center justify-center mb-8 text-black group-hover:bg-black group-hover:text-white transition-soft shadow-inner">
              {type.icon}
            </div>
            <h3 className="text-2xl font-bold mb-3">{type.title}</h3>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00E5FF] mb-6 px-4 py-1.5 bg-cyan-50 rounded-full">{type.duration}</span>
            <p className="text-gray-500 font-light leading-relaxed mb-12 flex-grow">
              {type.desc}
            </p>
            <button 
              onClick={() => handleSelectType(type.id)}
              className="w-full bg-[#f5f5f7] text-black py-5 rounded-full font-bold transition-soft group-hover:bg-[#00E5FF] group-hover:text-white shadow-sm"
            >
              Kalender öffnen
            </button>
          </div>
        ))}
      </div>

      {/* WhatsApp Fast-Track Banner */}
      <div className="mt-24 p-12 bg-[#001C3D] rounded-[56px] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-3xl transition-transform group-hover:scale-110"></div>
        <div className="max-w-xl relative z-10">
          <h4 className="text-2xl font-bold mb-2">Lieber sofort eine Antwort?</h4>
          <p className="text-blue-100/60 font-light leading-relaxed">
            Nutzen Sie unseren WhatsApp Fast-Track für Eiliges. Wir melden uns in der Regel innerhalb weniger Minuten zurück.
          </p>
        </div>
        <a 
          href="https://wa.me/4915565994781" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="relative z-10 whitespace-nowrap bg-[#25D366] text-white px-12 py-5 rounded-full font-bold shadow-xl shadow-green-500/20 hover:scale-105 active:scale-95 transition-soft"
        >
          WhatsApp Fast-Track
        </a>
      </div>
    </section>
  );
};
