
import React from 'react';
import { PRODUCTS } from '../data/products';

interface ShopProps {
  onProductClick: (id: string) => void;
}

export const Shop: React.FC<ShopProps> = ({ onProductClick }) => {
  return (
    <section className="max-w-5xl mx-auto px-6 py-12 animate-fade-in">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f]">Leistungen & Kollektion</h2>
          <p className="text-gray-500 mt-2 font-light">Maßgeschneiderte Fertigung für Business, Events und Individualisten.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="px-4 py-1.5 bg-gray-50 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-400 border border-gray-100">B2B Ready</span>
          <span className="px-4 py-1.5 bg-gray-50 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-400 border border-gray-100">Kleinserien</span>
          <span className="px-4 py-1.5 bg-blue-50 rounded-full text-[10px] font-bold uppercase tracking-widest text-blue-500 border border-blue-100">Alles möglich</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
        {PRODUCTS.map((product) => (
          <div 
            key={product.id} 
            className={`group cursor-pointer ${product.id === 'custom-manufacturing-service' ? 'sm:col-span-2' : ''}`}
            onClick={() => onProductClick(product.id)}
          >
            <div className={`bg-white rounded-[40px] overflow-hidden mb-6 relative shadow-sm border border-gray-100 transition-soft group-hover:shadow-2xl group-hover:border-[#00E5FF]/30 ${product.id === 'custom-manufacturing-service' ? 'aspect-[21/10] md:aspect-[21/8]' : 'aspect-square'}`}>
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover transition-soft group-hover:scale-105 grayscale-[0.3] group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-soft"></div>
              {product.basePrice === 0 && (
                <div className="absolute top-8 right-8 bg-[#00E5FF] text-white px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                  Top Leistung
                </div>
              )}
            </div>
            <div className="flex justify-between items-start px-4">
              <div className="max-w-[75%]">
                <h3 className="font-semibold text-2xl group-hover:text-[#00B8D4] transition-soft">{product.name}</h3>
                <p className="text-gray-500 text-sm mt-2 leading-relaxed font-light line-clamp-2">{product.shortDescription}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-xl text-[#1d1d1f]">
                  {product.basePrice > 0 
                    ? `${product.basePrice.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}` 
                    : 'Anfrage'}
                </p>
                <div className="mt-4 inline-flex items-center text-[11px] font-bold text-[#00E5FF] uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                  {product.basePrice === 0 ? 'Jetzt anfragen' : 'Details'}
                  <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
