
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Shop } from './components/Shop';
import { ProductDetail } from './components/ProductDetail';
import { InquiryForm } from './components/InquiryForm';
import { Contact } from './components/Contact';
import { Reviews } from './components/Reviews';
import { Sustainability } from './components/Sustainability';
import { Footer } from './components/Footer';
import { Process } from './components/Process';
import { FAQ } from './components/FAQ';
import { CorporateServices } from './components/CorporateServices';
import { Materials } from './components/Materials';
import { Gallery } from './components/Gallery';
import { Impressum, AGB, Datenschutz } from './components/LegalPages';
import { ChatWidget } from './components/ChatWidget';
import { Product, ProductVariant } from './data/products';

export type View = 'home' | 'shop' | 'product-detail' | 'inquiry' | 'contact' | 'impressum' | 'agb' | 'datenschutz';

interface OrderSummary {
  product: Product;
  variant: ProductVariant;
  personalization?: string;
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [lastOrder, setLastOrder] = useState<OrderSummary | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, [isDarkMode]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

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
    <div className={`min-h-screen flex flex-col transition-colors duration-400 ${isDarkMode ? 'bg-[#050505]' : 'bg-[#f8f9fa]'} selection:bg-[#00E5FF]/30`}>
      <Navbar currentView={currentView} setView={setCurrentView} toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      
      <main className="flex-grow pt-16">
        {currentView === 'home' && (
          <>
            <Hero 
              onShopClick={() => setCurrentView('shop')} 
              onInquiryClick={() => setCurrentView('inquiry')} 
            />
            <CorporateServices />
            <Materials />
            <Gallery />
            <Process />
            <Sustainability />
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
            onInquiry={handleInquiryFromProduct} 
          />
        )}
        
        {currentView === 'inquiry' && (
          <InquiryForm 
            initialProduct={lastOrder?.product.name} 
            initialPersonalization={lastOrder?.personalization} 
          />
        )}
        
        {currentView === 'contact' && <Contact />}
        {currentView === 'impressum' && <Impressum />}
        {currentView === 'agb' && <AGB />}
        {currentView === 'datenschutz' && <Datenschutz />}
      </main>

      <Footer setView={setCurrentView} />
      <ChatWidget />
    </div>
  );
};

export default App;
