
import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { LOGO_URL, COMPANY_NAME } from '../src/constants';

interface NavbarProps {
  currentView: string;
  setView: (view: any) => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView, toggleTheme, isDarkMode }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Leistungen', view: 'shop', href: '#services' },
    { label: 'Materialien', view: 'home', href: '#materials' },
    { label: 'Galerie', view: 'home', href: '#gallery' },
    { label: 'Kontakt', view: 'contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-6' : 'py-12'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`glass rounded-full px-10 py-5 flex items-center justify-between border-white/5 shadow-2xl transition-all ${scrolled ? 'scale-[0.98]' : ''}`}>
          <div 
            className="flex items-center cursor-pointer group" 
            onClick={() => {
              setView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="flex items-center space-x-3">
              <img 
                src={LOGO_URL} 
                alt={`${COMPANY_NAME} Logo`} 
                className="w-12 h-12 rounded-2xl object-cover transition-transform group-hover:rotate-12 shadow-lg"
              />
              <span className={`text-2xl font-bold tracking-tighter transition-colors ${isDarkMode ? 'text-white' : 'text-black'}`}>{COMPANY_NAME}</span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-12">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  if (item.view !== 'home' || currentView !== 'home') {
                    setView(item.view as any);
                  }
                }}
                className={`text-[12px] font-bold uppercase tracking-[0.3em] hover:text-[#00E5FF] transition-all hover:scale-110 ${currentView === item.view ? 'text-[#00E5FF]' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')}`}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center space-x-6">
            <button 
              onClick={toggleTheme}
              className={`p-3 rounded-full transition-all hover:bg-[#00E5FF]/20 ${isDarkMode ? 'text-[#00E5FF]' : 'text-gray-500 hover:text-black'}`}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={() => setView('inquiry')}
              className="bg-[#00E5FF] text-black px-10 py-4 rounded-full text-sm font-black uppercase tracking-widest hover:scale-[1.05] transition-soft shadow-[0_10px_30px_rgba(0,229,255,0.4)]"
            >
              Anfrage
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
