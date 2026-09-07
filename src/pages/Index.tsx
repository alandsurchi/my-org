import React, { Suspense, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { WifiOff } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useAPIHealthCheck } from '@/hooks/useAPIHealthCheck';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ProjectsSection from '@/components/ProjectsSection';
import NewsSection from '@/components/NewsSection';
import GallerySection from '@/components/GallerySection';
import Footer from '@/components/Footer';
import Section from '@/components/site/Section';
import SectionSkeleton from '@/components/site/SectionSkeleton';
import ErrorState from '@/components/site/ErrorState';

const Index = () => {
  const { t } = useLanguage();
  usePageMeta({ title: t('heroTitle'), description: t('metaHomeDescription') });
  const { isHealthy, isChecking, error } = useAPIHealthCheck();
  const location = useLocation();

  useEffect(() => {
    const handleHashNavigation = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    handleHashNavigation();
    window.addEventListener('hashchange', handleHashNavigation);
    return () => window.removeEventListener('hashchange', handleHashNavigation);
  }, [location.pathname, location.hash]);

  return (
    <div id="main-content" className="min-h-screen w-full overflow-x-clip">
      <Header />
      {/* The hero must stay the first <section> in the document (the header measures it). */}
      <HeroSection />
      <Suspense fallback={<SectionSkeleton cards={0} />}>
        <AboutSection />
      </Suspense>

      {/* Data-dependent sections render only when the API answers */}
      {isHealthy ? (
        <>
          <Suspense fallback={<SectionSkeleton tone="muted" />}>
            <ProjectsSection />
          </Suspense>
          <Suspense fallback={<SectionSkeleton />}>
            <NewsSection />
          </Suspense>
          <Suspense fallback={<SectionSkeleton tone="muted" />}>
            <GallerySection />
          </Suspense>
        </>
      ) : isChecking ? (
        <>
          <SectionSkeleton tone="muted" />
          <p role="status" aria-live="polite" className="sr-only">{t('connectingToServer')}</p>
        </>
      ) : (
        <Section tone="muted">
          <div className="container-site max-w-2xl">
            <ErrorState icon={WifiOff} title={t('connectionError')} detail={error ? `${t('unableToConnect')} (${error})` : t('unableToConnect')} />
          </div>
        </Section>
      )}

      <Footer />
    </div>
  );
};

export default Index;
