import React from 'react';
import { PRODUCTS } from '../data/products';
import { WHATSAPP_LINK } from '../src/constants';
import { ArrowRight, MessageSquare } from 'lucide-react';

interface ShopProps {
  onProductClick: (id: string) => void;
}

export const Shop: React.FC<ShopProps> = ({ onProductClick }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 md:py-24 text-center">
      <div className="mb-10 sm:mb-14 flex flex-col items-center gap-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#0096C7] bg-sky-50 border border-sky-100 px-3.5 py-1 rounded-full inline-block">
          Portfolio &amp; Katalog
        </span>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Produkte &amp; Lösungen.
        </h2>
        <p className="text-slate-600 text-sm sm:text-base md:text-lg font-normal max-w-2xl mx-auto leading-relaxed">
          Vom hochpräzisen 3D-Druck bis zur maßgeschneiderten CAD-Konstruktion – wir realisieren Ihre Projekte als Einzelstück oder Kleinserie.
        </p>

        <div className="flex flex-wrap justify-center gap-2 pt-2">
          <span className="px-3.5 py-1.5 bg-white rounded-full text-xs font-bold uppercase tracking-wider text-slate-600 border border-slate-200 shadow-2xs">
            B2B &amp; B2C
          </span>
          <span className="px-3.5 py-1.5 bg-white rounded-full text-xs font-bold uppercase tracking-wider text-slate-600 border border-slate-200 shadow-2xs">
            Maßanfertigung
          </span>
          <a 
            href={WHATSAPP_LINK} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-1.5 bg-[#25D366] rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-2xs hover:bg-[#1ebd5a] transition-colors flex items-center gap-2"
          >
            <MessageSquare size={14} />
            <span>WhatsApp Beratung</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 text-left">
        {PRODUCTS.map((product) => (
          <div 
            key={product.id} 
            className={`group cursor-pointer bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-2xs hover:border-[#0096C7]/50 transition-colors flex flex-col justify-between ${
              product.id === 'special-projects-series' ? 'sm:col-span-2' : ''
            }`}
            onClick={() => onProductClick(product.id)}
          >
            <div className={`rounded-2xl overflow-hidden mb-4 sm:mb-5 relative bg-slate-100 ${
              product.id === 'special-projects-series' 
                ? 'aspect-[16/9] sm:aspect-[21/9]' 
                : 'aspect-[4/3]'
            }`}>
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {product.basePrice === 0 && (
                <div className="absolute top-3 right-3 bg-white/95 border border-slate-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-900 shadow-2xs">
                  Individuell
                </div>
              )}
            </div>

            <div className="flex justify-between items-start pt-1">
              <div className="max-w-[85%]">
                <h3 className="font-bold text-lg sm:text-xl md:text-2xl text-slate-900 group-hover:text-[#0096C7] transition-colors tracking-tight">
                  {product.name}
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm mt-1.5 leading-relaxed line-clamp-2">
                  {product.shortDescription}
                </p>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 group-hover:bg-[#0096C7] text-slate-600 group-hover:text-white flex items-center justify-center transition-colors flex-shrink-0 ml-3">
                <ArrowRight size={16} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
