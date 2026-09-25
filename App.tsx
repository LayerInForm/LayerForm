import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { InquiryForm } from './components/InquiryForm';
import { Reviews } from './components/Reviews';
import { Footer } from './components/Footer';
import { CorporateServices } from './components/CorporateServices';
import { CadShowcase } from './components/CadShowcase';
import { Projects } from './components/Projects';
import { ConsultationHub } from './components/ConsultationHub';
import { Impressum, AGB, Datenschutz } from './components/LegalPages';

export type View = 'home' | 'inquiry' | 'contact' | 'impressum' | 'agb' | 'datenschutz';

interface OrderSummary {
  product?: string;
  personalization?: string;
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [lastOrder, setLastOrder] = useState<OrderSummary | null>(null);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [currentView]);

  const handleInquiryWithTopic = (topic?: string) => {
    setLastOrder({ personalization: topic ?? '' });
    setCurrentView('inquiry');
  };

  const openInquiry = () => {
    setLastOrder(null);
    setCurrentView('inquiry');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-ink selection:bg-cyan/30 font-sans">
      <motion.div style={{ scaleX: progress }} className="progress-bar fixed inset-x-0 top-0 z-50 h-[3px] origin-left" />
      <Navbar currentView={currentView} setView={setCurrentView} />

      <main className="flex-grow">
        {currentView === 'home' && (
          <>
            <Hero onInquiryClick={openInquiry} />
            <Projects onInquiry={handleInquiryWithTopic} />
            <CorporateServices onInquiryClick={openInquiry} />
            <CadShowcase onInquiryClick={openInquiry} />
            <Reviews />
            <ConsultationHub onInquiryClick={openInquiry} />
          </>
        )}

        {currentView === 'inquiry' && (
          <div className="pt-28">
            <InquiryForm
              key={lastOrder?.personalization ?? 'leer'}
              initialProduct={lastOrder?.product}
              initialPersonalization={lastOrder?.personalization}
              onBack={() => setCurrentView('home')}
              onPrivacy={() => setCurrentView('datenschutz')}
            />
          </div>
        )}

        {currentView === 'contact' && (
          <div className="pt-24">
            <ConsultationHub onInquiryClick={openInquiry} />
          </div>
        )}

        {currentView === 'impressum' && <div className="pt-28"><Impressum /></div>}
        {currentView === 'agb' && <div className="pt-28"><AGB /></div>}
        {currentView === 'datenschutz' && <div className="pt-28"><Datenschutz /></div>}
      </main>

      <Footer setView={setCurrentView} />
    </div>
  );
};

export default App;
