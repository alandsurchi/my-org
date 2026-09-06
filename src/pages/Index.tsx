
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

const LoadingSection = ({ name }: { name: string }) => (
  <div className="py-24 flex items-center justify-center">
    <div className="animate-pulse text-lg text-gray-600 dark:text-gray-300">Loading {name}...</div>
  </div>
);

const APILoadingSection = ({ name }: { name: string }) => (
  <div className="py-24 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <div className="text-lg text-gray-600 dark:text-gray-300">Connecting to server...</div>
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">Loading {name}</div>
    </div>
  </div>
);

const Index = () => {
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
    <div className="min-h-screen w-full">
      <Header />
      <Suspense fallback={<LoadingSection name="Hero" />}>
        <HeroSection />
      </Suspense>
      <Suspense fallback={<LoadingSection name="About" />}>
        <AboutSection />
      </Suspense>
      
      {/* Only render data-dependent sections when API is healthy */}
      {isHealthy ? (
        <>
          <Suspense fallback={<LoadingSection name="Projects" />}>
            <ProjectsSection />
          </Suspense>
          <Suspense fallback={<LoadingSection name="News" />}>
            <NewsSection />
          </Suspense>
          <Suspense fallback={<LoadingSection name="Gallery" />}>
            <GallerySection />
          </Suspense>
        </>
      ) : isChecking ? (
        <>
          <APILoadingSection name="Projects" />
          <APILoadingSection name="News" />
          <APILoadingSection name="Gallery" />
        </>
      ) : (
        <div className="py-24 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-lg mb-2">⚠️ Connection Error</div>
            <div className="text-gray-600 dark:text-gray-300">Unable to connect to server</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">Please check that the backend server is running</div>
            {error && <div className="text-xs text-red-400 mt-2">{error}</div>}
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default Index;
