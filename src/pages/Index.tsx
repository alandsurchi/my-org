
import React from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ProjectsSection from '@/components/ProjectsSection';
import NewsSection from '@/components/NewsSection';
import GallerySection from '@/components/GallerySection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <LanguageProvider>
      <div className="min-h-screen">
        <Header />
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <NewsSection />
        <GallerySection />
        <Footer />
      </div>
    </LanguageProvider>
  );
};

export default Index;
