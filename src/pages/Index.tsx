
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ProjectsSection from '@/components/ProjectsSection';
import NewsSection from '@/components/NewsSection';
import GallerySection from '@/components/GallerySection';
import StaffSection from '@/components/StaffSection';
import Footer from '@/components/Footer';

const Index = () => {
  console.log('Index component rendering');
  
  return (
    <div className="min-h-screen w-full">
      <Header />
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <NewsSection />
      <GallerySection />
      <StaffSection />
      <Footer />
    </div>
  );
};

export default Index;
