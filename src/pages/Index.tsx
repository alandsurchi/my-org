
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ProjectsSection from '@/components/ProjectsSection';
import NewsSection from '@/components/NewsSection';
import GallerySection from '@/components/GallerySection';
import StaffSection from '@/components/StaffSection';
import Footer from '@/components/Footer';
import SEOHelmet from '@/components/SEOHelmet';
import NewsletterSubscription from '@/components/NewsletterSubscription';

const Index = () => {
  console.log('Index component rendering');
  
  return (
    <div className="min-h-screen w-full">
      <SEOHelmet />
      <Header />
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      
      {/* Newsletter Subscription Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50/50 to-purple-50/30">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <NewsletterSubscription />
          </div>
        </div>
      </section>
      
      <NewsSection />
      <GallerySection />
      <StaffSection />
      <Footer />
    </div>
  );
};

export default Index;
