
import React from 'react';
import { CONTACT_EMAIL } from '../src/constants';

export const Contact: React.FC = () => {
  const whatsAppLink = "https://wa.me/4915565994781";
  
  return (
    <section id="contact" className="max-w-7xl mx-auto px-4 md:px-6 py-24 md:py-48 text-center">
      <div className="mb-16 md:mb-32">
        <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#00E5FF] mb-4 md:mb-8 block">In Verbindung bleiben</span>
        <h2 className="text-3xl sm:text-5xl md:text-8xl font-black tracking-tight md:tracking-tighter mb-6 md:mb-10 leading-[0.95] md:leading-[0.9]">Ihre Idee. <br className="hidden md:block" /> Unser Handwerk.</h2>
        <p className="text-gray-450 text-sm md:text-xl font-light max-w-3xl mx-auto leading-relaxed px-2">
          Ob Textildruck, 3D-Präzisionsteile oder komplexe Spezialanfertigungen – wir realisieren Einzelstücke und Serienproduktion nach Ihren Wünschen. Lassen Sie uns gemeinsam die perfekte Lösung konstruieren.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
        <div className="glass p-6 sm:p-10 md:p-12 rounded-[28px] md:rounded-[56px] border-white/5 transition-all duration-500 hover:border-[#00E5FF]/20 hover:scale-[1.05] flex flex-col items-center group text-inherit shadow-2xl">
          <div className="w-14 h-14 md:w-16 md:h-16 glass rounded-2xl flex items-center justify-center mb-6 md:mb-8 border-white/10 group-hover:bg-[#00E5FF]/20 transition-all duration-500 group-hover:rotate-12">
            <svg className="w-6 h-6 md:w-7 md:h-7 text-[#00E5FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="font-bold mb-2 md:mb-3 text-lg md:text-xl uppercase tracking-widest">E-Mail</h3>
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-gray-400 hover:text-[#00E5FF] transition-soft text-base md:text-lg font-light">
            {CONTACT_EMAIL}
          </a>
        </div>

        <div className="glass p-6 sm:p-10 md:p-12 rounded-[28px] md:rounded-[56px] border-white/5 transition-all duration-500 hover:border-[#00E5FF]/20 hover:scale-[1.05] flex flex-col items-center group text-inherit shadow-2xl">
          <div className="w-14 h-14 md:w-16 md:h-16 glass rounded-2xl flex items-center justify-center mb-6 md:mb-8 border-white/10 group-hover:bg-[#00E5FF]/20 transition-all duration-500 group-hover:rotate-12 font-black">
            <svg className="w-6 h-6 md:w-7 md:h-7 text-[#00E5FF]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.224-3.52c1.54.914 3.033 1.397 4.604 1.398 5.233 0 9.492-4.259 9.494-9.493.002-5.233-4.258-9.492-9.493-9.493-2.535 0-4.918.988-6.71 2.781-1.791 1.792-2.777 4.174-2.778 6.709-.001 1.664.47 3.248 1.36 4.632l-.899 3.28 3.422-.894zm11.233-6.578c-.092-.153-.339-.244-.712-.431-.372-.187-2.199-1.085-2.541-1.209-.341-.125-.59-.187-.838.187-.248.374-.959 1.209-1.176 1.458-.216.248-.433.279-.806.092-.373-.187-1.573-.581-2.996-1.851-1.107-.988-1.855-2.207-2.071-2.58-.217-.373-.023-.574.164-.76.168-.168.373-.434.56-.651.186-.217.248-.372.372-.62.124-.248.062-.465-.031-.652-.093-.187-.838-2.016-1.148-2.761-.303-.728-.61-.63-.838-.641-.216-.011-.465-.013-.713-.013-.248 0-.651.093-.991.465-.34.372-1.299 1.271-1.299 3.102 0 1.83 1.332 3.6 1.518 3.849.187.248 2.622 4.004 6.353 5.613.888.383 1.58.611 2.119.783.892.283 1.703.243 2.345.147.715-.107 2.199-.899 2.509-1.768.311-.869.311-1.613.217-1.768z"/>
            </svg>
          </div>
          <h3 className="font-bold mb-2 md:mb-3 text-lg md:text-xl uppercase tracking-widest">WhatsApp</h3>
          <a href={whatsAppLink} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#00E5FF] transition-soft text-base md:text-lg font-light">
            Chat starten
          </a>
        </div>

        <div className="glass p-6 sm:p-10 md:p-12 rounded-[28px] md:rounded-[56px] border-white/5 transition-all duration-500 hover:border-[#00E5FF]/20 hover:scale-[1.05] flex flex-col items-center group text-inherit shadow-2xl">
          <div className="w-14 h-14 md:w-16 md:h-16 glass rounded-2xl flex items-center justify-center mb-6 md:mb-8 border-white/10 group-hover:bg-[#00E5FF]/20 transition-all duration-500 group-hover:rotate-12">
            <svg className="w-6 h-6 md:w-7 md:h-7 text-[#00E5FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <h3 className="font-bold mb-2 md:mb-3 text-lg md:text-xl uppercase tracking-widest">Telefon</h3>
          <a href="tel:+4915565994781" className="text-gray-400 hover:text-[#00E5FF] transition-soft text-base md:text-lg font-light">
            +49 155 65994781
          </a>
        </div>

        <div className="glass p-6 sm:p-10 md:p-12 rounded-[28px] md:rounded-[56px] border-white/5 transition-all duration-500 hover:border-[#00E5FF]/20 hover:scale-[1.05] flex flex-col items-center group text-inherit shadow-2xl">
          <div className="w-14 h-14 md:w-16 md:h-16 glass rounded-2xl flex items-center justify-center mb-6 md:mb-8 border-white/10 group-hover:bg-[#00E5FF]/20 transition-all duration-500 group-hover:rotate-12">
            <svg className="w-6 h-6 md:w-7 md:h-7 text-[#00E5FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="font-bold mb-2 md:mb-3 text-lg md:text-xl uppercase tracking-widest">Standort</h3>
          <p className="text-gray-400 text-base md:text-lg font-light">Bargteheide, DE</p>
        </div>
      </div>
    </section>
  );
};
