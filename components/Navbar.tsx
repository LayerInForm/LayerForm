
import React, { useState, useEffect } from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { LOGO_URL, COMPANY_NAME } from '../src/constants';

interface NavbarProps {
  currentView: string;
  setView: (view: any) => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView, toggleTheme, isDarkMode }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
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
    { label: 'Leistungen', view: 'shop', href: '#services' },
    { label: 'Materialien', view: 'home', href: '#materials' },
    { label: 'Galerie', view: 'home', href: '#gallery' },
    { label: 'Kontakt', view: 'contact', href: '#contact' },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    setIsMenuOpen(false);
    if (item.view !== 'home' || currentView !== 'home') {
      setView(item.view as any);
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-4 md:py-6' : 'py-6 md:py-12'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className={`glass rounded-full px-5 md:px-10 py-3 md:py-5 flex items-center justify-between border-white/5 shadow-2xl transition-all ${scrolled ? 'scale-[0.98]' : ''}`}>
            <div 
              className="flex items-center cursor-pointer group" 
              onClick={() => {
                setView('home');
                setIsMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div className="flex items-center space-x-2 md:space-x-3">
                <img 
                  src={LOGO_URL} 
                  alt={`${COMPANY_NAME} Logo`} 
                  className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl object-cover transition-transform group-hover:rotate-12 shadow-lg"
                />
                <span className={`text-xl md:text-2xl font-bold tracking-tighter transition-colors ${isDarkMode ? 'text-white' : 'text-black'}`}>{COMPANY_NAME}</span>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-12">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    handleNavClick(item);
                  }}
                  className={`text-[12px] font-bold uppercase tracking-[0.3em] hover:text-[#00E5FF] transition-all hover:scale-110 ${currentView === item.view ? 'text-[#00E5FF]' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')}`}
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="flex items-center space-x-3 md:space-x-6">
              <button 
                onClick={toggleTheme}
                className={`p-2.5 md:p-3 rounded-full transition-all hover:bg-[#00E5FF]/20 ${isDarkMode ? 'text-[#00E5FF]' : 'text-gray-500 hover:text-black'}`}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              
              <button 
                onClick={() => setView('inquiry')}
                className="hidden sm:block bg-[#00E5FF] text-black px-6 md:px-10 py-3 md:py-4 rounded-full text-xs md:text-sm font-black uppercase tracking-widest hover:scale-[1.05] transition-soft shadow-[0_10px_30px_rgba(0,229,255,0.4)]"
              >
                Anfrage
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2.5 md:hidden rounded-full transition-all text-inherit hover:bg-white/10`}
                aria-label="Toggle mobile menu"
              >
                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Modern sliding mobile menu with glassmorphism */}
      <div 
        className={`fixed inset-0 z-40 transition-all duration-500 text-center ${
          isMenuOpen 
            ? 'opacity-100 pointer-events-auto visible' 
            : 'opacity-0 pointer-events-none invisible'
        }`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/90 backdrop-blur-md"
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Navigation contents */}
        <div className="absolute inset-x-0 top-32 px-6 flex flex-col items-center justify-center space-y-8 animate-fade-in z-50">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#00E5FF]">Navigation</span>
          <div className="w-12 h-[1px] bg-white/10 mb-4"></div>
          
          <div className="flex flex-col space-y-6 w-full max-w-sm px-4">
            {navItems.map((item, idx) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => handleNavClick(item)}
                className={`text-2xl font-black uppercase tracking-[0.2em] py-4 rounded-2xl border border-white/5 active:scale-95 transition-all transition-colors duration-300 ${
                  currentView === item.view 
                    ? 'text-[#00E5FF] bg-[#00E5FF]/5 border-[#00E5FF]/25' 
                    : 'text-gray-300 hover:text-white glass'
                }`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {item.label}
              </a>
            ))}
            
            <button 
              onClick={() => {
                setView('inquiry');
                setIsMenuOpen(false);
              }}
              className="mt-6 bg-[#00E5FF] text-black w-full py-5 rounded-2xl font-black text-base uppercase tracking-widest active:scale-95 transition-all shadow-lg"
            >
              Anfrage starten
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
