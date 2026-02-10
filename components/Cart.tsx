
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
    <section className="max-w-5xl mx-auto px-6 py-12 md:py-20 animate-fade-in">
      <h1 className="text-4xl font-bold tracking-tight mb-12">Warenkorb.</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-8">
          {items.map((item) => (
            <div key={item.cartId} className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 pb-8 border-b border-gray-100 group">
              <div className="w-24 h-24 bg-white rounded-2xl overflow-hidden border border-gray-50 flex-shrink-0">
                <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{item.product.name}</h3>
                    <p className="text-sm text-gray-400 font-light">{item.variant.name}</p>
                    {item.personalization && (
                      <p className="text-xs text-cyan-600 mt-1 font-medium italic">„{item.personalization}“</p>
                    )}
                  </div>
                  <p className="font-semibold text-lg">
                    {((item.product.basePrice + item.variant.priceOffset) * item.quantity).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                  </p>
                </div>
                
                <div className="flex justify-between items-center mt-6">
                  <div className="flex items-center space-x-4 bg-gray-50 px-3 py-1 rounded-full">
                    <button 
                      onClick={() => onUpdateQuantity(item.cartId, -1)}
                      disabled={isProcessing}
                      className="text-gray-400 hover:text-black transition-colors w-6 h-6 flex items-center justify-center disabled:opacity-30"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
                    </button>
                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => onUpdateQuantity(item.cartId, 1)}
                      disabled={isProcessing}
                      className="text-gray-400 hover:text-black transition-colors w-6 h-6 flex items-center justify-center disabled:opacity-30"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    </button>
                  </div>
                  <button 
                    onClick={() => onRemove(item.cartId)}
                    disabled={isProcessing}
                    className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors disabled:opacity-30"
                  >
                    Entfernen
                  </button>
                </div>
              </div>
            </div>
          ))}
          <p className="text-xs text-gray-400 italic mt-4">
            Hinweis: Alle Preise verstehen sich inklusive sicherem Versand innerhalb Deutschlands.
          </p>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-[#f5f5f7] p-8 rounded-[32px] sticky top-32">
            <h2 className="text-xl font-bold mb-6">Zusammenfassung</h2>
            <div className="space-y-4 text-sm mb-8 border-b border-gray-200 pb-8">
              <div className="flex justify-between text-gray-500">
                <span>Zwischensumme</span>
                <span>{subtotal.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
              </div>
              <div className="flex justify-between text-green-600 font-medium">
                <span>Versand</span>
                <span>Kostenlos</span>
              </div>
            </div>
            <div className="flex justify-between text-xl font-bold mb-10">
              <span>Gesamtsumme</span>
              <span>{total.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
            </div>
            
            <button 
              onClick={onCheckout}
              disabled={isProcessing}
              className={`w-full bg-[#635BFF] text-white py-5 rounded-full font-bold flex items-center justify-center space-x-3 transition-soft active:scale-95 shadow-xl shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spinner"></div>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>Sicher mit Stripe bezahlen</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
