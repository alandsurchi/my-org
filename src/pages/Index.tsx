
import React, { Suspense, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ProjectsSection from '@/components/ProjectsSection';
import NewsSection from '@/components/NewsSection';
import GallerySection from '@/components/GallerySection';
import Footer from '@/components/Footer';
import { useProjects } from '@/hooks/useProjects';
import { useNews } from '@/hooks/useNews';

const LoadingSection = ({ name }: { name: string }) => (
  <div className="py-24 flex items-center justify-center">
    <div className="animate-pulse text-lg text-gray-600">Loading {name}...</div>
  </div>
);

const Index = () => {
  console.log('🏠 Index component rendering');
  
  // Prefetch all data immediately when the component mounts
  const queryClient = useQueryClient();
  const projectsQuery = useProjects();
  const newsQuery = useNews();
  
  useEffect(() => {
    // Force refetch all queries on component mount
    console.log('🔄 Index component mounted, ensuring fresh data...');
    
    queryClient.refetchQueries({ queryKey: ['projects'] });
    queryClient.refetchQueries({ queryKey: ['news'] });
    queryClient.refetchQueries({ queryKey: ['gallery'] });
  }, [queryClient]);
  
  console.log('📊 Index - Projects loaded:', !!projectsQuery.data?.length, projectsQuery.data?.length);
  console.log('📊 Index - News loaded:', !!newsQuery.data?.length, newsQuery.data?.length);
  
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
      <Footer />
    </div>
  );
};

export default Index;
