import React, { Suspense, lazy, useState, useEffect } from 'react';
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

// Preisrechner wird erst geladen, wenn er geöffnet wird (3D-Bibliothek ist groß)
const PriceCalculator = lazy(() => import('./components/calculator/PriceCalculator'));

export type View = 'home' | 'inquiry' | 'contact' | 'impressum' | 'agb' | 'datenschutz' | 'rechner';

// Direkt verlinkbar: layer-form.de/#preisrechner
const HASH_VIEW: Record<string, View> = { '#preisrechner': 'rechner' };

interface OrderSummary {
  product?: string;
  personalization?: string;
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(() => HASH_VIEW[window.location.hash] ?? 'home');
  const [lastOrder, setLastOrder] = useState<OrderSummary | null>(null);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  useEffect(() => {
    window.scrollTo({ top: 0 });
    const hash = currentView === 'rechner' ? '#preisrechner' : '';
    if (window.location.hash !== hash) history.replaceState(null, '', window.location.pathname + hash);
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
    <div className="grain flex min-h-[100dvh] flex-col">
      <a
        href="#main"
        className="sr-only z-nav rounded-full bg-cyan px-4 py-2 font-semibold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Zum Inhalt springen
      </a>
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-progress h-[2px] origin-left bg-cyan"
        aria-hidden="true"
      />
      <Navbar currentView={currentView} setView={setCurrentView} />

      <main id="main" className="flex-grow">
        {currentView === 'home' && (
          <>
            <Hero onInquiryClick={openInquiry} onCalculatorClick={() => setCurrentView('rechner')} />
            <Projects onInquiry={handleInquiryWithTopic} />
            <CorporateServices onInquiryClick={openInquiry} />
            <CadShowcase onInquiry={handleInquiryWithTopic} />
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

        {currentView === 'rechner' && (
          <div className="pt-28">
            <Suspense fallback={<p className="px-5 py-24 text-center text-fg-muted">Preisrechner wird geladen …</p>}>
              <PriceCalculator onBack={() => setCurrentView('home')} onPrivacy={() => setCurrentView('datenschutz')} />
            </Suspense>
          </div>
        )}

        {currentView === 'contact' && (
          <div className="pt-24">
            <ConsultationHub onInquiryClick={openInquiry} />
          </div>
        )}

        {currentView === 'impressum' && <div className="legal pt-28"><Impressum /></div>}
        {currentView === 'agb' && <div className="legal pt-28"><AGB /></div>}
        {currentView === 'datenschutz' && <div className="legal pt-28"><Datenschutz /></div>}
      </main>

      <Footer setView={setCurrentView} />
    </div>
  );
};

export default App;
