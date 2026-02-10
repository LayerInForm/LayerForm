
import React from 'react';

interface NavbarProps {
  currentView: string;
  setView: (view: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: 'home', label: 'Start' },
    { id: 'shop', label: 'Shop' },
    { id: 'inquiry', label: 'Anfrage' },
    { id: 'contact', label: 'Kontakt' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 apple-blur border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <div 
          className="flex items-center cursor-pointer group space-x-2"
          onClick={() => setView('home')}
        >
          <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-soft group-hover:scale-110">
            <path d="M50 12L85 30L50 48L15 30L50 12Z" fill="#00E5FF" />
            <path d="M15 35L50 53L85 35V42L50 60L15 42V35Z" fill="#00B8D4" />
            <path d="M15 47L50 65L85 47V54L50 72L15 54V47Z" fill="#0097A7" />
            <path d="M15 59L50 77L85 59V66L50 84L15 66V59Z" fill="#006064" />
            <path d="M15 71L50 89L85 71V78L50 96L15 78V71Z" fill="#001C3D" />
            <path d="M50 48V96L85 78V30L50 48Z" fill="black" fillOpacity="0.1" />
          </svg>
          
          <div className="flex text-xl font-bold tracking-tight">
            <span className="text-[#00E5FF]">Layer</span>
            <span className="text-[#001C3D]">Form</span>
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`transition-soft hover:text-black ${
                currentView === item.id ? 'text-black font-bold' : 'text-gray-500'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="md:hidden">
             <button onClick={() => setView('shop')} className="bg-black text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full">Shop</button>
        </div>
      </div>
    </nav>
  );
};
