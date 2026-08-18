import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, MessageSquare, Phone } from 'lucide-react';
import { LOGO_URL, COMPANY_NAME, WHATSAPP_LINK, CONTACT_PHONE } from '../src/constants';

interface NavbarProps {
  currentView: string;
  setView: (view: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const navItems = [
    { label: 'Leistungen', view: 'home', href: '#services' },
    { label: 'Ablauf', view: 'home', href: '#process' },
    { label: 'Galerie', view: 'home', href: '#gallery' },
    { label: 'Bewertungen', view: 'home', href: '#reviews' },
    { label: 'Kontakt', view: 'home', href: '#consultation' },
    { label: 'Katalog', view: 'shop', href: '#shop' },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    setIsMenuOpen(false);
    if (item.view === 'shop') {
      setView('shop');
      return;
    }
    if (currentView !== 'home') {
      setView('home');
      setTimeout(() => {
        const el = document.querySelector(item.href);
        if (el) {
          const navOffset = 80;
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }, 100);
    } else {
      const el = document.querySelector(item.href);
      if (el) {
        const navOffset = 80;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled 
          ? 'py-2.5 sm:py-3 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-2xs' 
          : 'py-3.5 sm:py-5 bg-white/60 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            {/* Brand Logo & Name */}
            <div 
              className="flex items-center cursor-pointer group select-none" 
              onClick={() => {
                setView('home');
                setIsMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div className="flex items-center space-x-2.5 sm:space-x-3">
                <img 
                  src={LOGO_URL} 
                  alt={`${COMPANY_NAME} Logo`} 
                  className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl object-cover shadow-2xs transition-transform duration-300 group-hover:scale-105"
                />
                <div className="flex flex-col">
                  <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 leading-none">
                    {COMPANY_NAME}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-[#0096C7] tracking-widest uppercase mt-0.5">
                    3D Manufaktur
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1 bg-slate-100/90 p-1.5 rounded-full border border-slate-200/80 shadow-inner">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item);
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                    currentView === item.view && item.view === 'shop' 
                      ? 'bg-white text-[#0096C7] shadow-2xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* Right Action CTA & Mobile Menu Toggle */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button 
                onClick={() => setView('inquiry')}
                className="hidden sm:inline-flex items-center space-x-2 bg-slate-900 text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#0096C7] transition-all shadow-2xs active:scale-95 hover:shadow-sm"
              >
                <span>Anfrage senden</span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2.5 lg:hidden rounded-2xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 transition-colors shadow-2xs flex items-center justify-center min-w-[42px] min-h-[42px] active:scale-95"
                aria-label={isMenuOpen ? "Menü schließen" : "Menü öffnen"}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      <div 
        className={`fixed inset-0 z-50 transition-all duration-300 lg:hidden ${
          isMenuOpen 
            ? 'opacity-100 pointer-events-auto visible' 
            : 'opacity-0 pointer-events-none invisible'
        }`}
      >
        <div 
          className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity"
          onClick={() => setIsMenuOpen(false)}
        />
        
        <div className="absolute top-0 right-0 w-full max-w-[320px] h-full bg-white shadow-2xl p-6 flex flex-col justify-between z-10 overflow-y-auto">
          <div>
            <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
              <div className="flex items-center space-x-2.5">
                <img src={LOGO_URL} alt="Logo" className="w-8 h-8 rounded-xl object-cover" />
                <span className="font-black text-slate-900">{COMPANY_NAME}</span>
              </div>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 min-w-[40px] min-h-[40px] flex items-center justify-center"
                aria-label="Schließen"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col space-y-1.5">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item);
                  }}
                  className={`text-sm font-bold px-4 py-3.5 rounded-2xl transition-colors min-h-[46px] flex items-center ${
                    currentView === item.view && item.view === 'shop'
                      ? 'bg-sky-50 text-[#0096C7]'
                      : 'text-slate-700 hover:bg-slate-50 active:bg-slate-100'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 space-y-3">
            <button 
              onClick={() => {
                setView('inquiry');
                setIsMenuOpen(false);
              }}
              className="w-full bg-[#0096C7] text-white py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-2xs hover:bg-[#0077B6] transition-colors flex items-center justify-center space-x-2 min-h-[48px] active:scale-98"
            >
              <span>Projekt anfragen</span>
              <ArrowRight size={14} />
            </button>

            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-50 text-emerald-700 border border-emerald-200 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 min-h-[44px]"
            >
              <MessageSquare size={15} className="text-[#25D366]" />
              <span>WhatsApp Chat</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
