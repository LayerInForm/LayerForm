
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
          {/* Layered Cube Logo SVG inspired by the screenshot */}
          <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-soft group-hover:scale-110">
            {/* Top Layer */}
            <path d="M50 15L80 30L50 45L20 30L50 15Z" fill="#00E5FF" />
            {/* Middle Layers */}
            <path d="M20 35L50 50L80 35V42L50 57L20 42V35Z" fill="#00B8D4" />
            <path d="M20 48L50 63L80 48V55L50 70L20 55V48Z" fill="#0097A7" />
            <path d="M20 61L50 76L80 61V68L50 83L20 68V61Z" fill="#006064" />
            {/* Bottom Layer / Foundation */}
            <path d="M20 74L50 89L80 74V81L50 96L20 81V74Z" fill="#001C3D" />
            {/* Depth shading */}
            <path d="M50 45V96L80 81V30L50 45Z" fill="black" fillOpacity="0.08" />
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
