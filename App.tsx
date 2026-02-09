
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
import { Impressum, AGB, Datenschutz } from './components/LegalPages';
import { Cart, CartItem } from './components/Cart';
import { ChatWidget } from './components/ChatWidget';
import { Product, ProductVariant } from './data/products';

export type View = 'home' | 'shop' | 'product-detail' | 'inquiry' | 'contact' | 'impressum' | 'agb' | 'datenschutz' | 'cart' | 'order-success';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckoutProcessing, setIsCheckoutProcessing] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const addToCart = (product: Product, variant: ProductVariant, personalization?: string) => {
    const currentTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (currentTotalItems >= 10) {
      alert("Hinweis: Um unsere Manufaktur-Qualität zu garantieren, ist die Bestellmenge pro Auftrag auf maximal 10 Einheiten begrenzt.");
      return;
    }

    const cartId = `${product.id}-${variant.id}-${personalization || ''}`;
    
    setCart(prev => {
      const existing = prev.find(item => item.cartId === cartId);
      if (existing) {
        return prev.map(item => item.cartId === cartId ? { ...item, quantity: Math.min(item.quantity + 1, 10) } : item);
      }
      return [...prev, { cartId, product, variant, quantity: 1, personalization }];
    });
    
    setCurrentView('cart');
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, delta: number) => {
    const currentTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    setCart(prev => prev.map(item => {
      if (item.cartId === cartId) {
        const newQty = Math.max(1, item.quantity + delta);
        const projectedTotal = currentTotalItems - item.quantity + newQty;
        if (projectedTotal > 10) {
          alert("Maximale Bestellmenge von 10 Einheiten erreicht.");
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleStripeCheckout = async () => {
    const itemWithLink = cart.find(item => item.product.stripeLink);
    setIsCheckoutProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (itemWithLink && itemWithLink.product.stripeLink) {
      window.location.href = itemWithLink.product.stripeLink;
    } else {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsCheckoutProcessing(false);
      setCart([]);
      setCurrentView('order-success');
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <>
            <Hero 
              onShopClick={() => setCurrentView('shop')} 
              onInquiryClick={() => setCurrentView('inquiry')} 
            />
            <Process />
            <Reviews />
            <FAQ />
          </>
        );
      case 'shop':
        return <Shop onProductClick={(id) => { setSelectedProductId(id); setCurrentView('product-detail'); }} />;
      case 'product-detail':
        return (
          <ProductDetail 
            productId={selectedProductId} 
            onBack={() => setCurrentView('shop')} 
            onAddToCart={addToCart}
            onInquiry={(name) => setCurrentView('inquiry')}
          />
        );
      case 'cart':
        return (
          <Cart 
            items={cart} 
            isProcessing={isCheckoutProcessing}
            onRemove={removeFromCart} 
            onUpdateQuantity={updateQuantity} 
            onCheckout={handleStripeCheckout} 
            onBackToShop={() => setCurrentView('shop')}
          />
        );
      case 'order-success':
        return (
          <div className="max-w-2xl mx-auto px-6 py-32 text-center animate-fade-in">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 text-green-500">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-4 tracking-tight">Vielen Dank für Ihre Bestellung!</h1>
            <p className="text-gray-500 text-lg mb-12 font-light leading-relaxed">
              Ihre Zahlung war erfolgreich. Wir beginnen in Kürze mit der präzisen Fertigung Ihrer Bauteile in unserer Manufaktur.
            </p>
            <button 
              onClick={() => setCurrentView('home')}
              className="bg-black text-white px-10 py-4 rounded-full font-semibold transition-soft hover:bg-gray-800"
            >
              Zurück zur Startseite
            </button>
          </div>
        );
      case 'inquiry':
        return <InquiryForm />;
      case 'contact':
        return <Contact />;
      case 'impressum':
        return <Impressum />;
      case 'agb':
        return <AGB />;
      case 'datenschutz':
        return <Datenschutz />;
      default:
        return <Hero onShopClick={() => setCurrentView('shop')} onInquiryClick={() => setCurrentView('inquiry')} />;
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfd]">
      <Navbar currentView={currentView} setView={setCurrentView} cartCount={cartCount} />
      <main className="flex-grow pt-16">
        {renderContent()}
      </main>
      <Footer setView={setCurrentView} />
      
      <ChatWidget />

      {isCheckoutProcessing && (
        <div className="fixed inset-0 z-[150] bg-white/90 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in">
          <div className="w-16 h-16 border-4 border-gray-100 border-t-[#635BFF] rounded-full animate-spinner mb-8"></div>
          <p className="text-xl font-medium tracking-tight text-[#1d1d1f]">Sichere Verbindung zu Stripe...</p>
          <p className="text-sm text-gray-400 mt-2">Ihre Zahlungsdaten werden verschlüsselt übertragen.</p>
        </div>
      )}
    </div>
  );
};

export default App;
