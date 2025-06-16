
import React, { Suspense } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ProjectsSection from '@/components/ProjectsSection';
import NewsSection from '@/components/NewsSection';
import GallerySection from '@/components/GallerySection';
import StaffSection from '@/components/StaffSection';
import Footer from '@/components/Footer';

const LoadingSection = ({ name }: { name: string }) => (
  <div className="py-24 flex items-center justify-center">
    <div className="animate-pulse text-lg text-gray-600">Loading {name}...</div>
  </div>
);

const Index = () => {
  console.log('🏠 Index component rendering');
  
  return (
    <div className="min-h-screen w-full">
      <Header />
      <Suspense fallback={<LoadingSection name="Hero" />}>
        <HeroSection />
      </Suspense>
      <Suspense fallback={<LoadingSection name="About" />}>
        <AboutSection />
      </Suspense>
      <Suspense fallback={<LoadingSection name="Projects" />}>
        <ProjectsSection />
      </Suspense>
      <Suspense fallback={<LoadingSection name="News" />}>
        <NewsSection />
      </Suspense>
      <Suspense fallback={<LoadingSection name="Gallery" />}>
        <GallerySection />
      </Suspense>
      <Suspense fallback={<LoadingSection name="Staff" />}>
        <StaffSection />
      </Suspense>
      <Footer />
    </div>
  );
};

export default Index;
