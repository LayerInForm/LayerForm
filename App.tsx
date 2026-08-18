import React, { useState, useEffect } from 'react';
import { useScroll, motion } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Shop } from './components/Shop';
import { ProductDetail } from './components/ProductDetail';
import { InquiryForm } from './components/InquiryForm';
import { LocationMap } from './components/LocationMap';
import { Reviews } from './components/Reviews';
import { Footer } from './components/Footer';
import { Process } from './components/Process';
import { CorporateServices } from './components/CorporateServices';
import { Gallery } from './components/Gallery';
import { ConsultationHub } from './components/ConsultationHub';
import { Impressum, AGB, Datenschutz } from './components/LegalPages';
import { ChatWidget } from './components/ChatWidget';
import { Product, ProductVariant } from './data/products';

export type View = 'home' | 'shop' | 'product-detail' | 'inquiry' | 'contact' | 'impressum' | 'agb' | 'datenschutz';

interface OrderSummary {
  product?: Product;
  variant?: ProductVariant;
  personalization?: string;
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [lastOrder, setLastOrder] = useState<OrderSummary | null>(null);

  const { scrollYProgress } = useScroll();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const handleInquiryFromProduct = (productName: string, personalization?: string) => {
    const dummyProduct = { name: productName } as Product;
    setLastOrder({
      product: dummyProduct,
      variant: { name: '' } as ProductVariant,
      personalization
    });
    setCurrentView('inquiry');
  };

  const handleInquiryFromGallery = (projectTitle?: string) => {
    setLastOrder({
      personalization: projectTitle ? `Anfrage bezüglich Referenzprojekt: ${projectTitle}` : ''
    });
    setCurrentView('inquiry');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-[#0f172a] selection:bg-sky-200 relative font-sans">
      {/* Scroll Progress Bar */}
      <motion.div 
        style={{ scaleX: scrollYProgress }} 
        className="fixed top-0 left-0 right-0 h-[3px] bg-[#0096C7] origin-left z-50 shadow-[0_0_8px_#0096C7]" 
      />

      <Navbar currentView={currentView} setView={setCurrentView} />
      
      <main className="flex-grow">
        {currentView === 'home' && (
          <div className="flex flex-col">
            {/* Hero: Klare 3D-Druck Proposition */}
            <Hero 
              onShopClick={() => setCurrentView('shop')} 
              onInquiryClick={() => setCurrentView('inquiry')} 
            />

            {/* Leistungen: Bento Showcase (FDM 3D-Druck, CAD, Kleinserien, Prototyping) */}
            <CorporateServices onInquiryClick={() => setCurrentView('inquiry')} />

            {/* Ablauf: Unkomplizierter 4-Schritte Workflow */}
            <Process />

            {/* Galerie: Realisierte 3D-Druck Projekte */}
            <Gallery onInquiryClick={handleInquiryFromGallery} />

            {/* Social Proof: 5.0 Google Rezensionen */}
            <Reviews />

            {/* Google Unternehmensprofil Card */}
            <LocationMap />

            {/* Kontakt & Beratung: Direkte Multi-Channel Anfragen */}
            <ConsultationHub onInquiryClick={() => setCurrentView('inquiry')} />
          </div>
        )}
        
        {currentView === 'shop' && (
          <div className="pt-20">
            <Shop onProductClick={(id) => { setSelectedProductId(id); setCurrentView('product-detail'); }} />
          </div>
        )}
        
        {currentView === 'product-detail' && (
          <div className="pt-20">
            <ProductDetail 
              productId={selectedProductId} 
              onBack={() => setCurrentView('shop')} 
              onInquiry={handleInquiryFromProduct} 
            />
          </div>
        )}
        
        {currentView === 'inquiry' && (
          <div className="pt-20">
            <InquiryForm 
              initialProduct={lastOrder?.product?.name} 
              initialPersonalization={lastOrder?.personalization} 
            />
          </div>
        )}
        
        {currentView === 'contact' && (
          <div className="pt-20">
            <ConsultationHub onInquiryClick={() => setCurrentView('inquiry')} />
            <LocationMap />
          </div>
        )}

        {currentView === 'impressum' && <div className="pt-20"><Impressum /></div>}
        {currentView === 'agb' && <div className="pt-20"><AGB /></div>}
        {currentView === 'datenschutz' && <div className="pt-20"><Datenschutz /></div>}
      </main>

      <Footer setView={setCurrentView} />
      <ChatWidget />
    </div>
  );
};

export default App;
