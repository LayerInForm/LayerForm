
import React, { useState, useEffect } from 'react';
import { PRODUCTS, Product, ProductVariant } from '../data/products';

interface ProductDetailProps {
  productId: string | null;
  onBack: () => void;
  onDirectPurchase: (product: Product, variant: ProductVariant, personalization?: string) => void;
  onInquiry: (productName: string, personalization?: string) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ productId, onBack, onDirectPurchase, onInquiry }) => {
  const product = PRODUCTS.find(p => p.id === productId);
  const [personalization, setPersonalization] = useState('');
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(product ? product.variants[0] : null);

  useEffect(() => {
    if (product) setSelectedVariant(product.variants[0]);
  }, [productId, product]);

  if (!product || !selectedVariant) return null;

  const currentPrice = product.basePrice + selectedVariant.priceOffset;
  const displayImage = selectedVariant.variantImageUrl || product.imageUrl;

  return (
    <section className="max-w-6xl mx-auto px-6 py-12 md:py-24 animate-fade-in">
      {/* Back Button */}
      <button onClick={onBack} className="group flex items-center text-sm text-gray-400 hover:text-black transition-soft mb-16">
        <svg className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
        Alle Produkte
      </button>

      <div className="flex flex-col lg:flex-row gap-20 lg:gap-32 items-start justify-center">
        {/* Gallery - 35% Width fixed on scroll */}
        <div className="w-full lg:w-[35%] lg:sticky lg:top-32">
          <div className="aspect-square bg-white rounded-[40px] overflow-hidden shadow-sm border border-gray-100/60 relative">
            <img 
              key={displayImage}
              src={displayImage} 
              className={`w-full h-full object-cover transition-opacity duration-700 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
              onLoad={() => setIsImageLoading(false)}
            />
          </div>
        </div>

        {/* Content - 45% Width */}
        <div className="w-full lg:w-[45%]">
          <header className="mb-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#00E5FF] mb-4 block">Präzisions-Handwerk</span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1d1d1f] mb-4">{product.name}</h1>
            <p className="text-2xl font-normal text-[#1d1d1f]">
              {currentPrice.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
            </p>
          </header>

          <div className="space-y-12">
            <p className="text-gray-500 leading-relaxed text-lg font-light">{product.fullDescription}</p>

            {/* Finish Selection */}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-6">Ausführung wählen</h3>
              <div className="grid grid-cols-2 gap-4">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => { setIsImageLoading(true); setSelectedVariant(v); }}
                    className={`p-6 rounded-[24px] border-2 transition-soft text-left flex flex-col items-start ${
                      selectedVariant.id === v.id ? 'border-black bg-white shadow-xl' : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full border border-gray-100 mb-4" style={{ backgroundColor: v.colorCode }}></div>
                    <span className="font-bold text-sm">{v.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Personalization Section */}
            {product.isCustomizable && (
              <div className="bg-gray-50 rounded-[32px] p-8 border border-gray-100">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Gravur & Personalisierung</h3>
                <input 
                  type="text"
                  placeholder="Dein Wunschtext (z.B. Namen, Daten)"
                  value={personalization}
                  onChange={(e) => setPersonalization(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner text-base"
                />
              </div>
            )}

            {/* Purchase CTA */}
            <div className="pt-6 space-y-4">
              <button 
                onClick={() => onDirectPurchase(product, selectedVariant, personalization)}
                className="w-full bg-[#0071e3] text-white py-6 rounded-full font-bold text-lg shadow-2xl shadow-blue-500/10 hover:bg-[#0077ed] transition-soft active:scale-[0.98]"
              >
                Direkt kaufen
              </button>
              <button 
                onClick={() => onInquiry(product.name, personalization)}
                className="w-full py-4 text-sm font-bold text-[#0071e3] hover:underline"
              >
                Frage zum Produkt stellen
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
