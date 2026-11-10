import React, { Suspense, lazy, useState, useEffect } from 'react';
import { ServicePage, ServiceLinks } from './components/ServicePage';
import { SERVICE_PAGES, PAGE_META, SITE_URL, structuredData } from './src/seo';
import { Analytics } from '@vercel/analytics/react';
import { PREISRECHNER_AKTIV } from './src/features';
import { motion, useScroll, useSpring } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { InquiryForm } from './components/InquiryForm';
import { Reviews } from './components/Reviews';
import { Footer } from './components/Footer';
import { CorporateServices } from './components/CorporateServices';
import { Automation } from './components/Automation';
import { CadShowcase } from './components/CadShowcase';
import { Projects } from './components/Projects';
import { ConsultationHub } from './components/ConsultationHub';
import { Impressum, AGB, Datenschutz, Widerruf } from './components/LegalPages';

// Preisrechner wird erst geladen, wenn er geöffnet wird (3D-Bibliothek ist groß)
const PriceCalculator = lazy(() => import('./components/calculator/PriceCalculator'));
// Interne Umgebung liegt unter layer-form.de/intern (public/intern.html, nicht verlinkt)
const InternRedirect = lazy(() => import('./components/internal/InternRedirect'));

export type View = 'home' | 'inquiry' | 'contact' | 'impressum' | 'agb' | 'datenschutz' | 'widerruf' | 'rechner' | 'kalkulation' | '3d-druck' | 'cad-konstruktion' | 'automatisierung';

// Direkt aufrufbar: layer-form.de/#preisrechner und layer-form.de/#kalk (intern)
// #intern, #kalk und #kalkulation leiten zu layer-form.de/intern weiter
const HASH_VIEW: Record<string, View> = {
  ...(PREISRECHNER_AKTIV ? { '#preisrechner': 'rechner' as View } : {}),
  '#intern': 'kalkulation', '#kalk': 'kalkulation', '#kalkulation': 'kalkulation',
};
// Seitenaufrufe für Vercel Web Analytics (ohne Cookies). Die Ansichten heißen dort wie eigene Seiten.
const VIEW_PATH: Partial<Record<View, string>> = {
  '3d-druck': '/3d-druck', 'cad-konstruktion': '/cad-konstruktion', automatisierung: '/automatisierung',
  home: '/', rechner: '/preisrechner', inquiry: '/anfrage', contact: '/kontakt',
  impressum: '/impressum', agb: '/agb', datenschutz: '/datenschutz', widerruf: '/widerruf',
};
const VIEW_HASH: Partial<Record<View, string>> = { rechner: '#preisrechner', kalkulation: '#intern' };

interface OrderSummary {
  product?: string;
  personalization?: string;
}

export const viewForPath = (path: string): View => (Object.entries(VIEW_PATH).find(([, value]) => value === path.replace(/\/$/, '') || (path === '/' && value === '/'))?.[0] as View) ?? 'home';
const App: React.FC<{ initialPath?: string }> = ({ initialPath = '/' }) => {
  const [currentView, updateView] = useState<View>(() => typeof window === 'undefined' ? viewForPath(initialPath) : HASH_VIEW[window.location.hash] ?? viewForPath(window.location.pathname));
  const setCurrentView = (view: View) => {
    const path = VIEW_PATH[view] ?? '/';
    history.pushState(null, '', path + (VIEW_HASH[view] ?? ''));
    updateView(view);
  };
  const [lastOrder, setLastOrder] = useState<OrderSummary | null>(() => typeof window !== 'undefined' && window.location.pathname === '/anfrage' ? { personalization: new URLSearchParams(window.location.search).get('thema') ?? '' } : null);
  const [analyticsAllowed, setAnalyticsAllowed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const saved = JSON.parse(localStorage.getItem('layerform:privacy:v3') || 'null');
      return saved?.version === 3 && saved.analytics === true &&
        Date.now() - saved.timestamp < 180 * 86400000;
    } catch { return false; }
  });
  useEffect(() => {
    const onConsent = (event: Event) => {
      const data = (event as CustomEvent<{ analytics: boolean }>).detail;
      setAnalyticsAllowed(Boolean(data?.analytics));
    };
    window.addEventListener('layerform:consent-changed', onConsent);
    return () => window.removeEventListener('layerform:consent-changed', onConsent);
  }, []);
  useEffect(() => {
    const openPrivacy = () => setCurrentView('datenschutz');
    window.addEventListener('layerform:open-privacy', openPrivacy);
    return () => window.removeEventListener('layerform:open-privacy', openPrivacy);
  }, []);


  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  useEffect(() => {
    window.scrollTo({ top: 0 });
    const path = VIEW_PATH[currentView];
    const meta = path && PAGE_META[path];
    if (meta) {
      document.title = meta.title;
      document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
      document.querySelector('link[rel="canonical"]')?.setAttribute('href', SITE_URL + path);
      for (const [name, value] of Object.entries({ title: meta.title, description: meta.description, url: SITE_URL + path })) document.querySelector(`meta[property="og:${name}"]`)?.setAttribute('content', value);
      const schema = document.getElementById('page-schema');
      if (schema) schema.textContent = JSON.stringify(structuredData(path));
    }
  }, [currentView]);

  useEffect(() => {
    const onBack = () => { setLastOrder(window.location.pathname === '/anfrage' ? { personalization: new URLSearchParams(window.location.search).get('thema') ?? '' } : null); updateView(HASH_VIEW[window.location.hash] ?? viewForPath(window.location.pathname)); };
    window.addEventListener('popstate', onBack);
    return () => window.removeEventListener('popstate', onBack);
  }, []);

  // Adresse mit #… bei bereits geöffneter Seite eingeben
  useEffect(() => {
    const onHash = () => { const v = HASH_VIEW[window.location.hash]; if (v) updateView(v); };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const handleInquiryWithTopic = (topic?: string) => {
    setLastOrder({ personalization: topic ?? '' });
    setCurrentView('inquiry');
    if (topic) history.replaceState(null, '', '/anfrage?thema=' + encodeURIComponent(topic));
  };

  const openInquiry = () => {
    setLastOrder(null);
    setCurrentView('inquiry');
  };

  return (
    <div className="grain flex min-h-[100dvh] flex-col">
      {/* Besucherstatistik ohne Cookies; die interne Weiterleitung wird nicht gezählt */}
      {analyticsAllowed && VIEW_PATH[currentView] && <Analytics route={VIEW_PATH[currentView]} path={VIEW_PATH[currentView]} />}
      <a
        href="#main"
        className="sr-only z-nav rounded-full bg-cyan px-4 py-2 font-semibold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Zum Inhalt springen
      </a>
      {/* Interner Kalkulator: eigene App-Ansicht ohne Navigation und Footer */}
      {currentView === 'kalkulation' && (
        <Suspense fallback={null}>
          <InternRedirect />
        </Suspense>
      )}
      {currentView !== 'kalkulation' && (
        <>
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-progress h-[2px] origin-left bg-cyan"
        aria-hidden="true"
      />
      <Navbar currentView={currentView} setView={setCurrentView} />

      <main id="main" className="flex-grow">
        {currentView === 'home' && (
          <>
            <Hero onInquiryClick={openInquiry} onCalculatorClick={PREISRECHNER_AKTIV ? () => setCurrentView('rechner') : undefined} />
            <ServiceLinks />
            <Projects onInquiry={handleInquiryWithTopic} />
            <CorporateServices onInquiryClick={openInquiry} />
            <CadShowcase onInquiry={handleInquiryWithTopic} />
            <Automation onInquiry={handleInquiryWithTopic} />
            <Reviews />
            <ConsultationHub onInquiryClick={openInquiry} />
          </>
        )}

        {SERVICE_PAGES.filter(page => page.path === VIEW_PATH[currentView]).map(page => <ServicePage key={page.path} page={page} onInquiry={handleInquiryWithTopic} />)}

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

        {PREISRECHNER_AKTIV && currentView === 'rechner' && (
          <div className="pt-28">
            <Suspense fallback={<p className="px-5 py-24 text-center text-fg-muted">Preisrechner wird geladen …</p>}>
              <PriceCalculator onBack={() => setCurrentView('home')} onPrivacy={() => setCurrentView('datenschutz')} />
            </Suspense>
          </div>
        )}

        {currentView === 'contact' && (
          <div className="pt-28">
            <h1 className="mx-auto max-w-7xl px-5 text-4xl font-semibold md:px-8">Kontakt zu LayerForm</h1>
            <ConsultationHub onInquiryClick={openInquiry} />
          </div>
        )}

        {currentView === 'impressum' && <div className="legal pt-28"><Impressum /></div>}
        {currentView === 'agb' && <div className="legal pt-28"><AGB /></div>}
        {currentView === 'datenschutz' && <div className="legal pt-28"><Datenschutz /></div>}
        {currentView === 'widerruf' && <div className="legal pt-28"><Widerruf /></div>}
      </main>

      <Footer setView={setCurrentView} />
        </>
      )}
    </div>
  );
};

export default App;
