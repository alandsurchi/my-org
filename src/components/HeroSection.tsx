
import React, { useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHeroImage } from '@/hooks/useHeroAPI';
import { ArrowDown } from 'lucide-react';

const HeroSection = () => {
  console.log('HeroSection rendering');
  const { t } = useLanguage();
  const { data: heroImage } = useHeroImage();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('HeroSection useEffect running');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.fade-in-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const scrollToNext = () => {
    const nextSection = document.getElementById('about');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  console.log('Organization name from translation:', t('orgName'));
  console.log('Hero image data:', heroImage);

  // Determine the background image URL
  const getBackgroundImageUrl = () => {
    if (heroImage && heroImage.url) {
      // If the URL is relative, prepend the API base URL
      return heroImage.url.startsWith('http') 
        ? heroImage.url 
        : `http://localhost:5000${heroImage.url}`;
    }
    // Fallback to default image if no hero image is set
    return 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';
  };

  return (
    <section 
      ref={heroRef} 
      className="relative min-h-screen h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Enhanced background with animated overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000"
        style={{
          backgroundImage: `url('${getBackgroundImageUrl()}')`
        }}
      >
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-pink-900/30 animate-pulse"></div>
        
        {/* Enhanced floating particles */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              className="absolute w-1 h-1 md:w-2 md:h-2 bg-white rounded-full opacity-40 animate-float" 
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
                boxShadow: '0 0 10px rgba(255,255,255,0.5)'
              }} 
            />
          ))}
        </div>

        {/* Floating geometric shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 border border-white/10 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
          <div className="absolute bottom-32 right-20 w-24 h-24 border border-white/10 rounded-lg rotate-45 animate-pulse"></div>
          <div className="absolute top-1/2 left-10 w-16 h-16 border border-white/10 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>
      
      <div className="relative z-10 text-center text-white max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Organization name with enhanced glass card */}
        <div className="mb-8 md:mb-12 fade-in-on-scroll">
          <div className="relative group">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight px-8 py-6 rounded-3xl backdrop-blur-lg bg-gradient-to-r from-blue-500/25 via-purple-500/25 to-blue-500/25 border border-white/40 shadow-2xl transition-all duration-500 group-hover:shadow-blue-500/25 group-hover:shadow-2xl group-hover:border-white/60">
              {t('orgName')}
            </h1>
            
            {/* Animated glow effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Floating sparkles around the title */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-full opacity-60 animate-ping"></div>
            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-blue-300 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 -right-4 w-2 h-2 bg-purple-300 rounded-full opacity-40 animate-bounce" style={{ animationDelay: '2s' }}></div>
          </div>
        </div>
        
        {/* Hero title with matching enhanced design */}
        <div className="space-y-6 md:space-y-8 fade-in-on-scroll">
          <div className="relative group">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-white leading-relaxed px-8 py-6 rounded-3xl backdrop-blur-lg bg-gradient-to-r from-blue-500/25 via-purple-500/25 to-blue-500/25 border border-white/40 shadow-2xl max-w-4xl mx-auto transition-all duration-500 group-hover:shadow-purple-500/25 group-hover:shadow-2xl group-hover:border-white/60">
              {t('heroTitle')}
            </h2>
            
            {/* Matching glow effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-400/20 via-blue-400/20 to-pink-400/20 blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Decorative elements */}
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-70 animate-pulse"></div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-70 animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>

      {/* Enhanced discover more button */}
      <div className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 fade-in-on-scroll">
        <div className="flex flex-col items-center">
          {/* Enhanced animated scroll text */}
          <div className="mb-4 md:mb-6 text-center">
            <span className="text-white text-xs sm:text-sm font-medium tracking-wider uppercase px-6 py-3 rounded-full backdrop-blur-lg bg-gradient-to-r from-white/10 to-white/5 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-white/50">
              {t('discoverMore')}
            </span>
          </div>
          
          {/* Enhanced scroll button with multiple effects */}
          <button 
            onClick={scrollToNext} 
            className="group relative flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-full border-2 border-white/40 backdrop-blur-lg bg-gradient-to-r from-white/15 to-white/5 hover:from-white/25 hover:to-white/10 hover:border-white/60 transition-all duration-500 hover:scale-110 active:scale-95 touch-manipulation shadow-2xl hover:shadow-blue-500/25"
          >
            {/* Multiple pulsing rings */}
            <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping"></div>
            <div className="absolute inset-0 rounded-full border-2 border-blue-300/20 animate-ping" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute inset-0 rounded-full border-2 border-purple-300/20 animate-ping" style={{ animationDelay: '1s' }}></div>
            
            {/* Enhanced arrow icon */}
            <ArrowDown className="w-6 h-6 sm:w-7 sm:h-7 text-white/90 group-hover:text-white transition-all duration-300 animate-bounce drop-shadow-lg" />
            
            {/* Enhanced glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
          </button>
          
          {/* Enhanced scroll line indicator */}
          <div className="mt-4 md:mt-6 w-px h-8 md:h-10 bg-gradient-to-b from-white/60 via-blue-300/40 to-transparent shadow-lg"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
