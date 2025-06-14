
import React, { useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowDown } from 'lucide-react';

const HeroSection = () => {
  console.log('HeroSection rendering');
  const { t } = useLanguage();
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

  return (
    <section 
      ref={heroRef} 
      className="relative min-h-screen h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Clear background image without overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`
        }}
      >
        {/* Floating particles - reduced for mobile performance */}
        <div className="absolute inset-0">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className="absolute w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full opacity-30 animate-float" 
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${4 + Math.random() * 4}s`
              }} 
            />
          ))}
        </div>
      </div>
      
      <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Organization name with modern styling */}
        <div className="mb-6 md:mb-8 fade-in-on-scroll">
          <div className="relative inline-block">
            <h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent"
              style={{
                WebkitTextStroke: '2px rgba(255,255,255,0.8)',
                filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.8)) drop-shadow(0 0 40px rgba(0,0,0,0.6))'
              }}
            >
              {t('orgName')}
            </h1>
            {/* Glow effect behind text */}
            <div 
              className="absolute inset-0 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight text-white opacity-20 blur-sm"
              aria-hidden="true"
            >
              {t('orgName')}
            </div>
          </div>
        </div>
        
        {/* Hero content with modern card design */}
        <div className="space-y-6 md:space-y-8 fade-in-on-scroll">
          <div className="relative">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-white leading-relaxed px-4 py-2 rounded-lg backdrop-blur-sm bg-black/20 border border-white/20 shadow-2xl">
              {t('heroTitle')}
            </h2>
          </div>
          
          <div className="relative">
            <p className="text-lg sm:text-xl md:text-2xl font-medium text-white px-8 py-4 rounded-2xl backdrop-blur-md bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 border border-white/30 shadow-2xl max-w-3xl mx-auto">
              {t('heroSubtitle')}
            </p>
            {/* Subtle glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-blue-400/10 blur-xl"></div>
          </div>
        </div>
      </div>

      {/* Centered discover more button */}
      <div className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 fade-in-on-scroll">
        <div className="flex flex-col items-center">
          {/* Animated scroll text */}
          <div className="mb-3 md:mb-4 text-center">
            <span className="text-white text-xs sm:text-sm font-medium tracking-wider uppercase px-4 py-2 rounded-full backdrop-blur-sm bg-black/20 border border-white/20">
              {t('discoverMore')}
            </span>
          </div>
          
          {/* Touch-friendly scroll button */}
          <button 
            onClick={scrollToNext} 
            className="group relative flex flex-col items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border-2 border-white/30 backdrop-blur-sm bg-white/10 hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:scale-110 active:scale-95 touch-manipulation"
          >
            {/* Pulsing ring animation */}
            <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping"></div>
            <div 
              className="absolute inset-0 rounded-full border-2 border-white/10 animate-ping" 
              style={{ animationDelay: '0.5s' }}
            ></div>
            
            {/* Arrow icon */}
            <ArrowDown className="w-5 h-5 sm:w-6 sm:h-6 text-white/90 group-hover:text-white transition-all duration-300 animate-bounce" />
            
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
          </button>
          
          {/* Scroll line indicator */}
          <div className="mt-3 md:mt-4 w-px h-6 md:h-8 bg-gradient-to-b from-white/50 to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
