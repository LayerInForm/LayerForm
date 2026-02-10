
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Shop } from './components/Shop';
import { ProductDetail } from './components/ProductDetail';
import { InquiryForm } from './components/InquiryForm';
import { Contact } from './components/Contact';
import { Reviews } from './components/Reviews';
import { Footer } from './components/Footer';
import { Process } from './components/Process';
import { FAQ } from './components/FAQ';
import { CorporateServices } from './components/CorporateServices';
import { Impressum, AGB, Datenschutz } from './components/LegalPages';
import { ChatWidget } from './components/ChatWidget';
import { Product, ProductVariant } from './data/products';

export type View = 'home' | 'shop' | 'product-detail' | 'inquiry' | 'contact' | 'impressum' | 'agb' | 'datenschutz' | 'order-success';

interface OrderSummary {
  product: Product;
  variant: ProductVariant;
  personalization?: string;
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [lastOrder, setLastOrder] = useState<OrderSummary | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const handleDirectPurchase = (product: Product, variant: ProductVariant, personalization?: string) => {
    setLastOrder({ product, variant, personalization });
    setShowCheckoutModal(true);
  };

  const proceedToStripe = () => {
    if (lastOrder?.variant.stripeLink) {
      window.location.href = lastOrder.variant.stripeLink;
    }
  };

  const handleInquiryFromProduct = (productName: string, personalization?: string) => {
    const dummyProduct = { name: productName } as Product;
    setLastOrder({
      product: dummyProduct,
      variant: { name: '' } as ProductVariant,
      personalization
    });
    setCurrentView('inquiry');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfd] selection:bg-blue-100 selection:text-blue-900">
      <Navbar currentView={currentView} setView={setCurrentView} />
      
      <main className="flex-grow pt-16">
        {currentView === 'home' && (
          <>
            <Hero onShopClick={() => setCurrentView('shop')} onInquiryClick={() => setCurrentView('inquiry')} />
            <CorporateServices />
            <Process />
            <Reviews />
            <FAQ />
          </>
        )}
        
        {currentView === 'shop' && (
          <Shop onProductClick={(id) => { setSelectedProductId(id); setCurrentView('product-detail'); }} />
        )}
        
        {currentView === 'product-detail' && (
          <ProductDetail 
            productId={selectedProductId} 
            onBack={() => setCurrentView('shop')} 
            onDirectPurchase={handleDirectPurchase} 
            onInquiry={handleInquiryFromProduct} 
          />
        )}
        
        {currentView === 'inquiry' && (
          <InquiryForm initialProduct={lastOrder?.product.name} initialPersonalization={lastOrder?.personalization} />
        )}
        
        {currentView === 'contact' && <Contact />}
        {currentView === 'impressum' && <Impressum />}
        {currentView === 'agb' && <AGB />}
        {currentView === 'datenschutz' && <Datenschutz />}
        
        {currentView === 'order-success' && (
          <section className="max-w-4xl mx-auto px-6 py-32 text-center animate-fade-in">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-10 text-green-500 ring-8 ring-green-50/50">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-5xl font-bold tracking-tight mb-6">Vielen Dank.</h1>
            <p className="text-gray-500 text-xl mb-12 font-light">Wir beginnen sofort mit der präzisen Fertigung Ihres Unikats.</p>
            <button onClick={() => setCurrentView('home')} className="bg-black text-white px-10 py-4 rounded-full font-bold transition-soft hover:bg-gray-800">Zurück zur Startseite</button>
          </section>
        )}
      </main>

      <Footer setView={setCurrentView} />
      <ChatWidget />

      {showCheckoutModal && lastOrder && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xl animate-fade-in" onClick={() => setShowCheckoutModal(false)}></div>
          <div className="bg-white w-full max-w-[480px] rounded-[40px] p-8 md:p-12 shadow-2xl relative z-10 animate-fade-in border border-white/20">
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-8 rotate-3">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-3 tracking-tight">Bestellung abschließen.</h2>
              <p className="text-gray-500 mb-10 text-sm leading-relaxed font-light">
                Sie werden nun zu unserem sicheren Zahlungsanbieter <span className="font-semibold text-[#635BFF]">Stripe</span> weitergeleitet.
              </p>

              {lastOrder.personalization && (
                <div className="bg-[#f5f5f7] rounded-3xl p-6 mb-10 text-left border border-gray-100">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Gravur-Text:</p>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(lastOrder.personalization || '');
                        const btn = document.getElementById('copy-label');
                        if(btn) btn.innerText = 'Kopiert!';
                        setTimeout(() => { if(btn) btn.innerText = 'Kopieren'; }, 2000);
                      }}
                      className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase"
                    >
                      <span id="copy-label">Kopieren</span>
                    </button>
                  </div>
                  <p className="text-lg font-medium text-black">„{lastOrder.personalization}“</p>
                  <p className="text-[11px] text-gray-400 mt-5 leading-snug italic">
                    Bitte fügen Sie diesen Text im nächsten Schritt bei Stripe in das Feld <span className="text-black font-semibold">"Wunsch-Gravur"</span> ein.
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <button 
                  onClick={proceedToStripe}
                  className="w-full bg-[#635BFF] text-white py-5 rounded-full font-bold text-lg shadow-xl shadow-indigo-100 hover:bg-[#5a52e6] transition-soft flex items-center justify-center"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-5 mr-3 brightness-0 invert" />
                  Sicher bezahlen
                </button>
                <button 
                  onClick={() => setShowCheckoutModal(false)}
                  className="text-sm font-medium text-gray-400 hover:text-black transition-colors"
                >
                  Zurück zum Produkt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
