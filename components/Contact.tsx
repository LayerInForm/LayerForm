
import React from 'react';

export const Contact: React.FC = () => {
  const whatsAppLink = "https://wa.me/4915565994781";
  
  return (
    <section className="max-w-5xl mx-auto px-6 py-20 text-center">
      <h2 className="text-4xl font-semibold mb-6 tracking-tight text-[#001C3D]">Lassen Sie uns sprechen.</h2>
      <p className="text-xl text-gray-500 mb-12 max-w-xl mx-auto leading-relaxed">
        Haben Sie Fragen zu unseren Prozessen, Materialien oder einem speziellen Projekt? Wir sind für Sie da.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm transition-soft hover:shadow-md flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 bg-cyan-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5 text-[#00B8D4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-1 text-[#001C3D]">E-Mail</h3>
          </div>
          <a href="mailto:layerform@web.de" className="text-[#0047AB] hover:underline transition-soft text-sm truncate">
            layerform@web.de
          </a>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm transition-soft hover:shadow-md flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.224-3.52c1.54.914 3.033 1.397 4.604 1.398 5.233 0 9.492-4.259 9.494-9.493.002-5.233-4.258-9.492-9.493-9.493-2.535 0-4.918.988-6.71 2.781-1.791 1.792-2.777 4.174-2.778 6.709-.001 1.664.47 3.248 1.36 4.632l-.899 3.28 3.422-.894zm11.233-6.578c-.092-.153-.339-.244-.712-.431-.372-.187-2.199-1.085-2.541-1.209-.341-.125-.59-.187-.838.187-.248.374-.959 1.209-1.176 1.458-.216.248-.433.279-.806.092-.373-.187-1.573-.581-2.996-1.851-1.107-.988-1.855-2.207-2.071-2.58-.217-.373-.023-.574.164-.76.168-.168.373-.434.56-.651.186-.217.248-.372.372-.62.124-.248.062-.465-.031-.652-.093-.187-.838-2.016-1.148-2.761-.303-.728-.61-.63-.838-.641-.216-.011-.465-.013-.713-.013-.248 0-.651.093-.991.465-.34.372-1.299 1.271-1.299 3.102 0 1.83 1.332 3.6 1.518 3.849.187.248 2.622 4.004 6.353 5.613.888.383 1.58.611 2.119.783.892.283 1.703.243 2.345.147.715-.107 2.199-.899 2.509-1.768.311-.869.311-1.613.217-1.768z"/>
              </svg>
            </div>
            <h3 className="font-semibold mb-1 text-[#001C3D]">WhatsApp</h3>
          </div>
          <a href={whatsAppLink} target="_blank" rel="noopener noreferrer" className="text-[#25D366] font-bold hover:underline transition-soft text-sm">
            Chat starten
          </a>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm transition-soft hover:shadow-md flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 bg-cyan-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5 text-[#00B8D4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-1 text-[#001C3D]">Telefon</h3>
          </div>
          <a href="tel:+4915565994781" className="text-[#0047AB] hover:underline transition-soft text-sm">
            +49 155 65994781
          </a>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm transition-soft hover:shadow-md flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 bg-cyan-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5 text-[#00B8D4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-1 text-[#001C3D]">Standort</h3>
          </div>
          <p className="text-gray-500 text-sm">Bargteheide, Deutschland</p>
        </div>
      </div>
    </section>
  );
};
