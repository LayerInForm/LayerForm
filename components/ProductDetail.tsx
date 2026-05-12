
import React, { useState, useEffect } from 'react';
import { PRODUCTS, Product, ProductVariant } from '../data/products';

interface ProductDetailProps {
  productId: string | null;
  onBack: () => void;
  onInquiry: (productName: string, personalization?: string) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ productId, onBack, onInquiry }) => {
  const product = PRODUCTS.find(p => p.id === productId);
  const [personalization, setPersonalization] = useState('');
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(product ? product.variants[0] : null);

  useEffect(() => {
    if (product) setSelectedVariant(product.variants[0]);
  }, [productId, product]);

  if (!product || !selectedVariant) return null;

  const displayImage = selectedVariant.variantImageUrl || product.imageUrl;

  return (
    <section className="max-w-7xl mx-auto px-6 py-40 animate-fade-in">
      {/* Back Button */}
      <button onClick={onBack} className="group flex items-center text-xs font-bold uppercase tracking-[0.4em] text-gray-400 hover:text-[#00E5FF] transition-all mb-24">
        <svg className="w-5 h-5 mr-3 transition-transform group-hover:-translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
        Portfolio / <span className="ml-2 text-inherit">{product.name}</span>
      </button>

      <div className="flex flex-col lg:flex-row gap-24 lg:gap-40 items-start">
        {/* Gallery */}
        <div className="w-full lg:w-1/2 lg:sticky lg:top-40">
          <div className="aspect-square glass rounded-[64px] overflow-hidden shadow-2xl relative border border-white/5">
            <img 
              key={displayImage}
              src={displayImage} 
              className={`w-full h-full object-cover transition-all duration-1000 ${isImageLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
              onLoad={() => setIsImageLoading(false)}
            />
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>
          </div>
        </div>

        {/* Content */}
        <div className="w-full lg:w-1/2">
          <header className="mb-20">
            <span className="text-[12px] font-bold uppercase tracking-[0.5em] text-[#00E5FF] mb-8 block">
              Premium Fertigung
            </span>
            <h1 className="text-4xl md:text-8xl font-bold tracking-tight mb-10 leading-[0.9]">{product.name}</h1>
            <div className="inline-flex items-center px-8 py-3 rounded-full glass border-[#00E5FF]/20 text-[#00E5FF] font-bold text-sm tracking-wide">
              Sonderanfertigung: On-Demand Preisplanung
            </div>
          </header>

          <div className="space-y-24">
            <p className="text-gray-400 leading-relaxed text-xl md:text-2xl font-light tracking-tight">{product.fullDescription}</p>

            {/* Finish Selection */}
            <div className="space-y-10">
              <h3 className="text-[12px] font-bold uppercase tracking-[0.4em] text-gray-500 mb-4">Ausführung & Finish</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => { setIsImageLoading(true); setSelectedVariant(v); }}
                      className={`p-10 rounded-[48px] border-2 transition-all duration-700 text-left flex flex-col items-start group relative overflow-hidden ${
                        selectedVariant.id === v.id ? 'border-[#00E5FF] bg-[#00E5FF]/5 shadow-[0_0_40px_rgba(0,229,255,0.15)] scale-[1.02]' : 'border-white/5 hover:border-white/20 glass'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full border border-white/10 mb-8 shadow-inner" style={{ backgroundColor: v.colorCode }}></div>
                      <span className={`font-bold text-xl transition-colors ${selectedVariant.id === v.id ? 'text-[#00E5FF]' : 'text-inherit'}`}>{v.name}</span>
                      <div className="mt-4 text-xs text-gray-500 font-medium uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Auswählen →</div>
                    </button>
                  ))}
                </div>
              </div>

            {/* Personalization Section */}
            {product.isCustomizable && (
              <div className="glass rounded-[56px] p-12 md:p-16 border border-white/10 shadow-2xl relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E5FF]/5 rounded-full blur-3xl pointer-events-none"></div>
                <h3 className="text-[12px] font-bold uppercase tracking-[0.4em] text-[#00E5FF] mb-8">
                  Ihre Projekt-Details
                </h3>
                <textarea 
                  placeholder="Beschreiben Sie kurz Ihr Projekt (Maße, Wunsch-Logo, spezieller Kunststoff, Verwendungszweck)..."
                  value={personalization}
                  onChange={(e) => setPersonalization(e.target.value)}
                  className="w-full px-10 py-8 rounded-[40px] border border-white/5 focus:border-[#00E5FF] focus:ring-4 focus:ring-[#00E5FF]/10 transition-all shadow-inner text-xl bg-white/5 resize-none font-light leading-relaxed text-inherit"
                  rows={5}
                />
                <p className="text-sm text-gray-500 mt-10 leading-relaxed font-light italic">
                  Anhand Ihrer Angaben prüfen wir die optimale Fertigungsmethode und senden Ihnen eine kostenlose Einschätzung sowie den Kontakt zu Ihrem persönlichen Projektleiter.
                </p>
              </div>
            )}

            {/* Inquiry CTA */}
            <div className="pt-12">
              <button 
                onClick={() => onInquiry(product.name, personalization)}
                className="w-full bg-[#00E5FF] text-black py-8 rounded-full font-black text-2xl uppercase tracking-widest shadow-[0_20px_60px_rgba(0,229,255,0.3)] hover:scale-[1.02] transition-all duration-700 active:scale-[0.98]"
              >
                Projektanfrage starten
              </button>
              
              <div className="flex flex-col items-center gap-10 pt-16">
                <a href="https://wa.me/4915565994781" target="_blank" rel="noopener noreferrer" className="text-xl font-bold text-[#25D366] flex items-center hover:scale-105 transition-all group px-10 py-5 glass rounded-full border-green-500/20">
                  <svg className="w-8 h-8 mr-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.224-3.52c1.54.914 3.033 1.397 4.604 1.398 5.233 0 9.492-4.259 9.494-9.493.002-5.233-4.258-9.492-9.493-9.493-2.535 0-4.918.988-6.71 2.781-1.791 1.792-2.777 4.174-2.778 6.709-.001 1.664.47 3.248 1.36 4.632l-.899 3.28 3.422-.894zm11.233-6.578c-.092-.153-.339-.244-.712-.431-.372-.187-2.199-1.085-2.541-1.209-.341-.125-.59-.187-.838.187-.248.374-.959 1.209-1.176 1.458-.216.248-.433.279-.806.092-.373-.187-1.573-.581-2.996-1.851-1.107-.988-1.855-2.207-2.071-2.58-.217-.373-.023-.574.164-.76.168-.168.373-.434.56-.651.186-.217.248-.372.372-.62.124-.248.062-.465-.031-.652-.093-.187-.838-2.016-1.148-2.761-.303-.728-.61-.63-.838-.641-.216-.011-.465-.013-.713-.013-.248 0-.651.093-.991.465-.34.372-1.299 1.271-1.299 3.102 0 1.83 1.332 3.6 1.518 3.849.187.248 2.622 4.004 6.353 5.613.888.383 1.58.611 2.119.783.892.283 1.703.243 2.345.147.715-.107 2.199-.899 2.509-1.768.311-.869.311-1.613.217-1.768z"/></svg>
                   Persönlich via WhatsApp klären
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
