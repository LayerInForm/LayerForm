
import React from 'react';
import { PRODUCTS } from '../data/products';

interface ShopProps {
  onProductClick: (id: string) => void;
}

export const Shop: React.FC<ShopProps> = ({ onProductClick }) => {
  return (
    <section className="max-w-5xl mx-auto px-6 py-12 animate-fade-in">
      <div className="mb-12">
        <h2 className="text-3xl font-semibold tracking-tight">Unsere Kollektion</h2>
        <p className="text-gray-500 mt-2">Präzisionsgefertigte Objekte für Ihren Alltag.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
        {PRODUCTS.map((product) => (
          <div 
            key={product.id} 
            className="group cursor-pointer"
            onClick={() => onProductClick(product.id)}
          >
            <div className="aspect-square bg-white rounded-3xl overflow-hidden mb-6 relative shadow-sm border border-gray-100 transition-soft group-hover:shadow-xl group-hover:border-cyan-100">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover transition-soft group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-soft"></div>
            </div>
            <div className="flex justify-between items-start px-2">
              <div className="max-w-[70%]">
                <h3 className="font-semibold text-xl group-hover:text-[#0047AB] transition-soft">{product.name}</h3>
                <p className="text-gray-500 text-sm mt-1 leading-relaxed line-clamp-2">{product.shortDescription}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-xl text-[#1d1d1f]">
                  ab {product.basePrice.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                </p>
                <div className="mt-4 inline-flex items-center text-xs font-semibold text-[#00E5FF] group-hover:translate-x-1 transition-transform">
                  Details ansehen
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
