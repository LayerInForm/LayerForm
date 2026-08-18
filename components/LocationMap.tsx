import React from 'react';
import { Star, ShieldCheck, ExternalLink, Truck, MessageSquare } from 'lucide-react';
import { GOOGLE_MAPS_LINK, WHATSAPP_LINK } from '../src/constants';

export const LocationMap: React.FC = () => {
  return (
    <section id="google-profile" className="py-14 sm:py-20 md:py-28 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-8 md:p-12 shadow-2xs overflow-hidden relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          {/* Left info column */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold uppercase tracking-wider mb-3 border border-amber-200/80">
                <Star size={13} className="fill-amber-400 text-amber-400" />
                <span>5.0 Google Bewertung</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">
                Verifiziertes Google Unternehmensprofil.
              </h2>
              
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
                LayerForm ist Ihr Partner für 3D-Druck und CAD-Konstruktion mit Unternehmenssitz in Bargteheide. Wir fertigen schnell, flexibel und liefern versichert deutschlandweit.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
                  <ShieldCheck size={16} className="text-[#0096C7]" />
                  <span>Offizieller Eintrag</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Verifiziertes Google Profil</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
                  <Truck size={16} className="text-[#0096C7]" />
                  <span>Bundesweiter Versand</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Schnell &amp; transportsicher</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <a
                href={GOOGLE_MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 px-5 py-3.5 rounded-full bg-slate-900 hover:bg-[#0096C7] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs min-h-[48px] active:scale-98"
              >
                <span>Google Maps Profil öffnen</span>
                <ExternalLink size={14} />
              </a>

              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 px-5 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs min-h-[48px] active:scale-98"
              >
                <MessageSquare size={14} className="text-[#25D366]" />
                <span>WhatsApp Chat</span>
              </a>
            </div>
          </div>

          {/* Right visual map embed card */}
          <div className="lg:col-span-6 relative min-h-[260px] sm:min-h-[300px] md:min-h-[340px] rounded-2xl overflow-hidden border border-slate-200 group">
            <iframe
              title="LayerForm Google Maps Unternehmensprofil"
              src="https://maps.google.com/maps?q=LayerForm+Bargteheide&t=&z=14&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full min-h-[260px] sm:min-h-[300px] md:min-h-[340px] border-0 rounded-2xl pointer-events-none"
              loading="lazy"
            />
            
            {/* Interactive overlay linking directly to Google Maps */}
            <a 
              href={GOOGLE_MAPS_LINK} 
              target="_blank" 
              rel="noopener noreferrer"
              className="absolute inset-0 bg-slate-950/20 hover:bg-slate-950/40 transition-colors flex items-center justify-center group"
            >
              <div className="bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-full text-xs font-bold text-slate-900 shadow-md flex items-center space-x-2 group-hover:scale-105 transition-transform">
                <Star size={13} className="fill-amber-400 text-amber-400" />
                <span>Rezensionen auf Google Maps</span>
                <ExternalLink size={12} className="text-slate-400" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
