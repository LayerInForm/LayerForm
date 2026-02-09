
import React from 'react';
import { View } from '../App';

interface FooterProps {
  setView: (view: View) => void;
}

export const Footer: React.FC<FooterProps> = ({ setView }) => {
  const currentYear = new Date().getFullYear();
  const whatsAppLink = "https://wa.me/4915565994781";
  const instagramLink = "https://www.instagram.com/layerform_3d/";
  const tikTokLink = "https://www.tiktok.com/@layerform";

  return (
    <footer className="border-t border-gray-100 py-20 bg-white">
      <div className="max-w-5_5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-xl font-bold tracking-tight">
              <span className="text-[#00E5FF]">Layer</span>
              <span className="text-[#001C3D]">Form</span>
            </div>
            <p className="text-gray-400 max-w-xs text-sm leading-relaxed">
              Präzisionsgefertigte 3D-Lösungen für anspruchsvolle Projekte. Wir vereinen technisches Know-how mit minimalistischem Design.
            </p>
            <div className="flex items-center space-x-6">
              {/* WhatsApp */}
              <a href={whatsAppLink} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#25D366] transition-soft" title="WhatsApp">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.224-3.52c1.54.914 3.033 1.397 4.604 1.398 5.233 0 9.492-4.259 9.494-9.493.002-5.233-4.258-9.492-9.493-9.493-2.535 0-4.918.988-6.71 2.781-1.791 1.792-2.777 4.174-2.778 6.709-.001 1.664.47 3.248 1.36 4.632l-.899 3.28 3.422-.894zm11.233-6.578c-.092-.153-.339-.244-.712-.431-.372-.187-2.199-1.085-2.541-1.209-.341-.125-.59-.187-.838.187-.248.374-.959 1.209-1.176 1.458-.216.248-.433.279-.806.092-.373-.187-1.573-.581-2.996-1.851-1.107-.988-1.855-2.207-2.071-2.58-.217-.373-.023-.574.164-.76.168-.168.373-.434.56-.651.186-.217.248-.372.372-.62.124-.248.062-.465-.031-.652-.093-.187-.838-2.016-1.148-2.761-.303-.728-.61-.63-.838-.641-.216-.011-.465-.013-.713-.013-.248 0-.651.093-.991.465-.34.372-1.299 1.271-1.299 3.102 0 1.83 1.332 3.6 1.518 3.849.187.248 2.622 4.004 6.353 5.613.888.383 1.58.611 2.119.783.892.283 1.703.243 2.345.147.715-.107 2.199-.899 2.509-1.768.311-.869.311-1.613.217-1.768z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a href={instagramLink} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#E1306C] transition-soft" title="Instagram">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              {/* TikTok */}
              <a href={tikTokLink} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black transition-soft" title="TikTok">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.103-.104z"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-12 gap-y-6 md:justify-end">
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-black">Rechtliches</h4>
              <nav className="flex flex-col space-y-2">
                <button onClick={() => setView('impressum')} className="text-gray-400 hover:text-black transition-soft text-left text-sm">Impressum</button>
                <button onClick={() => setView('datenschutz')} className="text-gray-400 hover:text-black transition-soft text-left text-sm">Datenschutz</button>
                <button onClick={() => setView('agb')} className="text-gray-400 hover:text-black transition-soft text-left text-sm">AGB</button>
              </nav>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-black">Shop</h4>
              <nav className="flex flex-col space-y-2">
                <button onClick={() => setView('shop')} className="text-gray-400 hover:text-black transition-soft text-left text-sm">Produkte</button>
                <button onClick={() => setView('inquiry')} className="text-gray-400 hover:text-black transition-soft text-left text-sm">Sonderanfertigung</button>
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center text-[11px] text-gray-400 border-t border-gray-50 pt-8">
          <span>© {currentYear} LayerForm Manufaktur.</span>
          <span className="uppercase tracking-[0.2em] font-bold mt-4 md:mt-0">Premium Additive Manufacturing</span>
        </div>
      </div>
    </footer>
  );
};
