
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

  const isCustomService = product.basePrice === 0;
  const currentPrice = product.basePrice + selectedVariant.priceOffset;
  const displayImage = selectedVariant.variantImageUrl || product.imageUrl;

  return (
    <section className="max-w-6xl mx-auto px-6 py-12 md:py-24 animate-fade-in">
      {/* Back Button */}
      <button onClick={onBack} className="group flex items-center text-sm text-gray-400 hover:text-black transition-soft mb-16">
        <svg className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
        Alle Leistungen & Produkte
      </button>

      <div className="flex flex-col lg:flex-row gap-20 lg:gap-32 items-start justify-center">
        {/* Gallery */}
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

        {/* Content */}
        <div className="w-full lg:w-[45%]">
          <header className="mb-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#00E5FF] mb-4 block">
              {isCustomService ? 'Full-Service Manufaktur' : 'Präzisions-Handwerk'}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1d1d1f] mb-4">{product.name}</h1>
            <p className="text-2xl font-normal text-[#1d1d1f]">
              {isCustomService ? 'Preis nach Aufwand' : currentPrice.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
            </p>
          </header>

          <div className="space-y-12">
            <p className="text-gray-500 leading-relaxed text-lg font-light">{product.fullDescription}</p>

            {/* Finish Selection - Only show if more than one variant or not a placeholder */}
            {!isCustomService && (
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
            )}

            {/* Personalization Section */}
            {product.isCustomizable && (
              <div className="bg-gray-50 rounded-[32px] p-8 border border-gray-100">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">
                  {isCustomService ? 'Was haben Sie vor?' : 'Gravur & Personalisierung'}
                </h3>
                <textarea 
                  placeholder={isCustomService ? "Beschreiben Sie kurz Ihr Projekt oder laden Sie uns ein Logo hoch..." : "Dein Wunschtext (z.B. Namen, Daten)"}
                  value={personalization}
                  onChange={(e) => setPersonalization(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner text-base bg-white resize-none"
                  rows={isCustomService ? 4 : 1}
                />
                {isCustomService && (
                   <p className="text-[11px] text-gray-400 mt-4 leading-relaxed italic">
                    Wir prüfen die Machbarkeit und melden uns mit einer Einschätzung bei Ihnen. Alles ist möglich!
                  </p>
                )}
              </div>
            )}

            {/* Purchase / Inquiry CTA */}
            <div className="pt-6 space-y-4">
              {isCustomService ? (
                <button 
                  onClick={() => onInquiry(product.name, personalization)}
                  className="w-full bg-[#1d1d1f] text-white py-6 rounded-full font-bold text-lg shadow-2xl shadow-black/10 hover:bg-[#00E5FF] transition-soft active:scale-[0.98]"
                >
                  Kostenlose Projektanfrage starten
                </button>
              ) : (
                <button 
                  onClick={() => onDirectPurchase(product, selectedVariant, personalization)}
                  className="w-full bg-[#0071e3] text-white py-6 rounded-full font-bold text-lg shadow-2xl shadow-blue-500/10 hover:bg-[#0077ed] transition-soft active:scale-[0.98]"
                >
                  Direkt kaufen
                </button>
              )}
              
              <div className="flex flex-col items-center gap-4 pt-4">
                <a href="https://wa.me/4915565994781" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[#25D366] flex items-center hover:underline">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.224-3.52c1.54.914 3.033 1.397 4.604 1.398 5.233 0 9.492-4.259 9.494-9.493.002-5.233-4.258-9.492-9.493-9.493-2.535 0-4.918.988-6.71 2.781-1.791 1.792-2.777 4.174-2.778 6.709-.001 1.664.47 3.248 1.36 4.632l-.899 3.28 3.422-.894zm11.233-6.578c-.092-.153-.339-.244-.712-.431-.372-.187-2.199-1.085-2.541-1.209-.341-.125-.59-.187-.838.187-.248.374-.959 1.209-1.176 1.458-.216.248-.433.279-.806.092-.373-.187-1.573-.581-2.996-1.851-1.107-.988-1.855-2.207-2.071-2.58-.217-.373-.023-.574.164-.76.168-.168.373-.434.56-.651.186-.217.248-.372.372-.62.124-.248.062-.465-.031-.652-.093-.187-.838-2.016-1.148-2.761-.303-.728-.61-.63-.838-.641-.216-.011-.465-.013-.713-.013-.248 0-.651.093-.991.465-.34.372-1.299 1.271-1.299 3.102 0 1.83 1.332 3.6 1.518 3.849.187.248 2.622 4.004 6.353 5.613.888.383 1.58.611 2.119.783.892.283 1.703.243 2.345.147.715-.107 2.199-.899 2.509-1.768.311-.869.311-1.613.217-1.768z"/></svg>
                  Lieber per WhatsApp klären?
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
