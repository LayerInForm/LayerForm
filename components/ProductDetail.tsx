
import React, { useState } from 'react';
import { PRODUCTS, Product, ProductVariant } from '../data/products';

interface ProductDetailProps {
  productId: string | null;
  onBack: () => void;
  onAddToCart: (product: Product, variant: ProductVariant, personalization?: string) => void;
  onInquiry: (productName: string) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ productId, onBack, onAddToCart, onInquiry }) => {
  const product = PRODUCTS.find(p => p.id === productId);
  const [personalization, setPersonalization] = useState('');
  
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product ? product.variants[0] : null
  );

  if (!product || !selectedVariant) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <p>Produkt nicht gefunden.</p>
        <button onClick={onBack} className="mt-4 text-blue-600">Zurück zum Shop</button>
      </div>
    );
  }

  const currentPrice = product.basePrice + selectedVariant.priceOffset;

  return (
    <section className="max-w-6xl mx-auto px-6 py-12 md:py-20 animate-fade-in">
      <button 
        onClick={onBack}
        className="flex items-center text-gray-400 hover:text-black transition-soft mb-12 group"
      >
        <svg className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        Zurück zur Übersicht
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
        <div className="aspect-square bg-white rounded-[40px] overflow-hidden shadow-2xl shadow-gray-200/50 border border-gray-100">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover transition-soft hover:scale-105"
          />
        </div>

        <div className="flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1d1d1f] mb-4">
              {product.name}
            </h1>
            <p className="text-2xl font-light text-[#1d1d1f]">
              {currentPrice.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
            </p>
          </div>

          <div className="prose prose-gray mb-10">
            <p className="text-gray-500 leading-relaxed text-lg font-light">
              {product.fullDescription}
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4">Farbe / Material</h3>
            <div className="flex flex-wrap gap-3">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  className={`px-5 py-2.5 rounded-2xl border transition-soft flex items-center space-x-3 ${
                    selectedVariant.id === variant.id 
                      ? 'border-[#001C3D] bg-[#001C3D] text-white shadow-md' 
                      : 'border-gray-200 hover:border-gray-400 bg-white text-gray-700'
                  }`}
                >
                  {variant.colorCode && (
                    <span 
                      className="w-4 h-4 rounded-full border border-gray-300" 
                      style={{ backgroundColor: variant.colorCode }}
                    />
                  )}
                  <span className="font-medium text-sm">{variant.name}</span>
                </button>
              ))}
            </div>
          </div>

          {product.isCustomizable && (
            <div className="mb-10">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4">Personalisierung</h3>
              <input 
                type="text"
                placeholder="Namen & Datum eingeben..."
                value={personalization}
                onChange={(e) => setPersonalization(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00E5FF] transition-soft bg-[#f5f5f7] focus:bg-white"
              />
            </div>
          )}

          <div className="space-y-4">
            <button 
              onClick={() => onAddToCart(product, selectedVariant, personalization)}
              className="w-full bg-black text-white py-5 rounded-full font-bold text-lg shadow-xl shadow-gray-200 hover:bg-gray-800 active:scale-95 transition-soft"
            >
              In den Warenkorb
            </button>
            <button 
              onClick={() => onInquiry(product.name)}
              className="w-full text-[#0047AB] font-semibold py-2 hover:underline transition-soft text-sm"
            >
              Sonderwunsch oder Frage? Jetzt anfragen
            </button>
            <div className="flex justify-center space-x-6 text-[11px] text-gray-400 uppercase tracking-widest font-medium pt-4">
              <span>Einzelanfertigung</span>
              <span>•</span>
              <span>Handgeprüft</span>
              <span>•</span>
              <span>Präzisionsdruck</span>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-100 grid grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-cyan-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              <div>
                <h4 className="text-sm font-semibold">Qualität</h4>
                <p className="text-xs text-gray-400">Geprüfte Manufakturqualität.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-cyan-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <div>
                <h4 className="text-sm font-semibold">Versand</h4>
                <p className="text-xs text-gray-400">Bereit in 48h.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
