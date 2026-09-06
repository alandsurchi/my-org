import { useLanguage } from '@/contexts/LanguageContext';
import { usePageMeta } from '@/hooks/usePageMeta';

import React, { Suspense, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ProjectsSection from '@/components/ProjectsSection';
import NewsSection from '@/components/NewsSection';
import GallerySection from '@/components/GallerySection';
import Footer from '@/components/Footer';
import { useAPIHealthCheck } from '@/hooks/useAPIHealthCheck';

const LoadingSection = () => {
  const { t } = useLanguage();
  return (
    <div className="py-24 flex items-center justify-center">
      <div className="animate-pulse text-lg text-gray-600 dark:text-gray-300">{t('loading')}</div>
    </div>
  );
};

const APILoadingSection = () => {
  const { t } = useLanguage();
  return (
    <div className="py-24 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <div className="text-lg text-gray-600 dark:text-gray-300">{t('connectingToServer')}</div>
      </div>
    </div>
  );
};

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
    <div id="main-content" className="min-h-screen w-full">
      <Header />
      <Suspense fallback={<LoadingSection />}>
        <HeroSection />
      </Suspense>
      <Suspense fallback={<LoadingSection />}>
        <AboutSection />
      </Suspense>
      
      {/* Only render data-dependent sections when API is healthy */}
      {isHealthy ? (
        <>
          <Suspense fallback={<LoadingSection />}>
            <ProjectsSection />
          </Suspense>
          <Suspense fallback={<LoadingSection />}>
            <NewsSection />
          </Suspense>
          <Suspense fallback={<LoadingSection />}>
            <GallerySection />
          </Suspense>
        </>
      ) : isChecking ? (
        <>
          <APILoadingSection />
          <APILoadingSection />
          <APILoadingSection />
        </>
      ) : (
        <div className="py-24 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-lg mb-2">⚠️ {t('connectionError')}</div>
            <div className="text-gray-600 dark:text-gray-300">{t('unableToConnect')}</div>
            
            {error && <div className="text-xs text-red-400 mt-2">{error}</div>}
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default Index;
