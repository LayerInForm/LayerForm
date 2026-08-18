import React, { useState, useEffect } from 'react';
import { PRODUCTS, ProductVariant } from '../data/products';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ProductDetailProps {
  productId: string | null;
  onBack: () => void;
  onInquiry: (productName: string, personalization?: string) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ productId, onBack, onInquiry }) => {
  const product = PRODUCTS.find(p => p.id === productId);
  const [personalization, setPersonalization] = useState('');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(product ? product.variants[0] : null);

  useEffect(() => {
    if (product) setSelectedVariant(product.variants[0]);
  }, [productId, product]);

  if (!product || !selectedVariant) return null;

  const displayImage = selectedVariant.variantImageUrl || product.imageUrl;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 md:py-20 animate-fade-in">
      {/* Back Button */}
      <button 
        onClick={onBack} 
        className="group flex items-center text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-[#0096C7] transition-colors mb-6 md:mb-10 min-h-[44px]"
      >
        <ArrowLeft size={16} className="mr-2 transition-transform group-hover:-translate-x-1" />
        <span>Zurück zum Katalog</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">
        {/* Gallery Image without effects */}
        <div className="w-full lg:sticky lg:top-28">
          <div className="aspect-square bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-2xs">
            <img 
              key={displayImage}
              src={displayImage} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Product Details & Configuration */}
        <div className="space-y-6 sm:space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#0096C7] bg-sky-50 border border-sky-100 px-3.5 py-1 rounded-full inline-block mb-3">
              Individuelle Anfertigung
            </span>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">
              {product.name}
            </h1>
            <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed font-normal">
              {product.fullDescription}
            </p>
          </div>

          {/* Variants / Materials */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Ausführung &amp; Material
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`p-3.5 sm:p-4 rounded-2xl border text-left flex items-center space-x-3 transition-colors min-h-[48px] ${
                    selectedVariant.id === v.id 
                      ? 'border-[#0096C7] bg-sky-50/60 shadow-2xs' 
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div 
                    className="w-4 h-4 rounded-full border border-slate-300 flex-shrink-0" 
                    style={{ backgroundColor: v.colorCode }}
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-xs sm:text-sm text-slate-900">{v.name}</span>
                    <span className="text-[10px] sm:text-[11px] text-slate-500">Präzisionsfertigung</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Personalization / Project Details */}
          {product.isCustomizable && (
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Ihre Projektdetails (Maße, Skizze, Anforderungen)
              </h3>
              <textarea 
                placeholder="Beschreiben Sie gewünschte Maße, Passform, Stückzahl oder Besonderheiten..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-900 text-base sm:text-xs focus:bg-white focus:outline-none focus:border-[#0096C7] transition-colors resize-none"
                rows={3}
                value={personalization}
                onChange={(e) => setPersonalization(e.target.value)}
              />
            </div>
          )}

          {/* Action CTA */}
          <div className="pt-2">
            <button 
              onClick={() => onInquiry(product.name, personalization)}
              className="w-full bg-[#0096C7] hover:bg-[#0077B6] text-white py-4 rounded-2xl font-bold text-xs sm:text-sm uppercase tracking-wider shadow-2xs transition-colors flex items-center justify-center space-x-2 min-h-[50px] active:scale-98"
            >
              <span>Jetzt Anfrage für dieses Produkt vorbereiten</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
