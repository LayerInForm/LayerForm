
import React from 'react';
import { PRODUCTS } from '../data/products';

interface ShopProps {
  onProductClick: (id: string) => void;
}

export const Shop: React.FC<ShopProps> = ({ onProductClick }) => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-40 animate-fade-in text-center">
      <div className="mb-32 flex flex-col items-center gap-12">
        <div className="max-w-3xl">
          <span className="text-[12px] font-bold uppercase tracking-[0.4em] text-[#00E5FF] mb-6 block">Portfolio & Expertise</span>
          <h2 className="text-4xl md:text-7xl font-bold tracking-tight leading-tight">Was wir bewegen.</h2>
          <p className="text-gray-500 mt-8 text-xl md:text-2xl font-light max-w-2xl mx-auto leading-relaxed">
            Vom hochpräzisen FDM-Druck bis zur Textilveredelung – wir realisieren Ihre Visionen als Einzelstück oder Serie.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <span className="px-8 py-3 glass rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border border-white/5 shadow-sm">B2B & B2C Focus</span>
          <span className="px-8 py-3 glass rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border border-white/5 shadow-sm">Maßanfertigung</span>
          <span className="px-8 py-3 glass rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border border-[#00E5FF]/20 text-[#00E5FF]">On-Demand Factory</span>
          <a 
            href="https://wa.me/c/4915565994781" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-8 py-3 bg-[#25D366] rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-white border border-[#25D366] shadow-xl hover:scale-[1.05] transition-soft flex items-center gap-3"
          >
            WhatsApp Katalog
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-24 text-left">
        {PRODUCTS.map((product) => (
          <div 
            key={product.id} 
            className={`group cursor-pointer ${product.id === 'special-projects-series' ? 'sm:col-span-2 max-w-6xl mx-auto w-full' : ''}`}
            onClick={() => onProductClick(product.id)}
          >
            <div className={`glass rounded-[64px] overflow-hidden mb-12 relative transition-all duration-700 group-hover:shadow-[0_60px_100px_-20px_rgba(0,0,0,0.2)] group-hover:border-[#00E5FF]/30 ${product.id === 'special-projects-series' ? 'aspect-[21/10] md:aspect-[2.4/1]' : 'aspect-square'}`}>
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              {product.basePrice === 0 && (
                <div className="absolute top-12 right-12 glass backdrop-blur-xl px-8 py-3.5 rounded-full text-[12px] font-bold uppercase tracking-widest shadow-2xl border border-white/10">
                  Custom Strategy
                </div>
              )}
            </div>
            <div className="flex justify-between items-start px-6">
              <div className="max-w-[75%]">
                <h3 className="font-bold text-4xl group-hover:text-[#00E5FF] transition-soft tracking-tight">{product.name}</h3>
                <p className="text-gray-500 text-xl mt-5 leading-relaxed font-light line-clamp-2">{product.shortDescription}</p>
              </div>
              <div className="text-right">
                <div className="mt-8 flex items-center justify-center w-16 h-16 rounded-full border border-white/10 group-hover:bg-[#00E5FF] group-hover:border-[#00E5FF] group-hover:text-black transition-all duration-700 shadow-xl">
                  <svg className="w-7 h-7 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
