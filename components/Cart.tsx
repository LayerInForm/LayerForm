
import React from 'react';
import { Product, ProductVariant } from '../data/products';

export interface CartItem {
  cartId: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
  personalization?: string;
}

interface CartProps {
  items: CartItem[];
  isProcessing?: boolean;
  onRemove: (cartId: string) => void;
  onUpdateQuantity: (cartId: string, delta: number) => void;
  onCheckout: () => void;
  onBackToShop: () => void;
}

export const Cart: React.FC<CartProps> = ({ items, isProcessing, onRemove, onUpdateQuantity, onCheckout, onBackToShop }) => {
  const subtotal = items.reduce((acc, item) => acc + (item.product.basePrice + item.variant.priceOffset) * item.quantity, 0);
  // Versand ist nun in den Produktpreisen inkludiert
  const shipping = 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-32 text-center animate-fade-in">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold mb-4 tracking-tight">Dein Warenkorb ist leer.</h2>
        <p className="text-gray-400 mb-10 font-light">Entdecke unsere Kollektion und finde dein nächstes Unikat.</p>
        <button 
          onClick={onBackToShop}
          className="bg-black text-white px-10 py-4 rounded-full font-semibold transition-soft hover:bg-gray-800"
        >
          Zum Shop
        </button>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-40 animate-fade-in">
      <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-20 leading-[0.9]">Warenkorb.</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
        <div className="lg:col-span-2 space-y-12">
          {items.map((item) => (
            <div key={item.cartId} className="flex flex-col sm:flex-row space-y-8 sm:space-y-0 sm:space-x-10 pb-12 border-b border-white/5 group">
              <div className="w-40 h-40 glass rounded-[32px] overflow-hidden border border-white/10 flex-shrink-0 shadow-2xl">
                <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="flex-grow flex flex-col justify-between py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-2xl tracking-tight mb-2">{item.product.name}</h3>
                    <p className="text-sm text-[#00E5FF] font-black uppercase tracking-widest">{item.variant.name}</p>
                    {item.personalization && (
                      <div className="mt-4 p-4 glass rounded-2xl border-white/5 inline-block">
                        <p className="text-xs text-gray-400 font-light italic">„{item.personalization}“</p>
                      </div>
                    )}
                  </div>
                  <p className="font-black text-2xl tracking-tighter">
                    {((item.product.basePrice + item.variant.priceOffset) * item.quantity).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                  </p>
                </div>
                
                <div className="flex justify-between items-center mt-10">
                  <div className="flex items-center space-x-6 bg-white/5 px-6 py-3 rounded-full border border-white/10">
                    <button 
                      onClick={() => onUpdateQuantity(item.cartId, -1)}
                      disabled={isProcessing}
                      className="text-gray-500 hover:text-[#00E5FF] transition-all w-8 h-8 flex items-center justify-center disabled:opacity-30 hover:scale-125"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4" /></svg>
                    </button>
                    <span className="text-lg font-black w-6 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => onUpdateQuantity(item.cartId, 1)}
                      disabled={isProcessing}
                      className="text-gray-500 hover:text-[#00E5FF] transition-all w-8 h-8 flex items-center justify-center disabled:opacity-30 hover:scale-125"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                    </button>
                  </div>
                  <button 
                    onClick={() => onRemove(item.cartId)}
                    disabled={isProcessing}
                    className="text-sm text-red-500/50 hover:text-red-500 font-bold uppercase tracking-widest transition-all disabled:opacity-30 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    Entfernen
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="p-8 glass rounded-[32px] border-[#00E5FF]/10">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
              Hinweis: Alle Preise verstehen sich inklusive sicherem Versand innerhalb Deutschlands. Ihre Daten werden verschlüsselt übertragen.
            </p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="glass p-12 rounded-[56px] border-white/5 sticky top-40 shadow-2xl">
            <h2 className="text-2xl font-black mb-8 uppercase tracking-tighter">Zusammenfassung</h2>
            <div className="space-y-6 text-base mb-10 border-b border-white/5 pb-10">
              <div className="flex justify-between text-gray-400 font-light">
                <span>Zwischensumme</span>
                <span className="text-white font-bold">{subtotal.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
              </div>
              <div className="flex justify-between text-[#25D366] font-bold">
                <span>Versand</span>
                <span className="uppercase tracking-widest text-sm">Kostenlos</span>
              </div>
            </div>
            <div className="flex justify-between text-3xl font-black mb-12 tracking-tighter">
              <span>Gesamt</span>
              <span className="text-[#00E5FF] drop-shadow-[0_0_20px_rgba(0,229,255,0.3)]">{total.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
            </div>
            
            <button 
              onClick={onCheckout}
              disabled={isProcessing}
              className={`w-full bg-[#635BFF] text-white py-8 rounded-full font-black text-lg uppercase tracking-widest flex items-center justify-center space-x-4 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_20px_50px_rgba(99,91,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isProcessing ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spinner"></div>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>Sicher bezahlen</span>
                </>
              )}
            </button>
            <div className="mt-8 flex justify-center gap-6 opacity-30 invert pointer-events-none">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-6" alt="PayPal" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-6" alt="Visa" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="Mastercard" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
