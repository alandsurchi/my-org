
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
        {/* Organization name with improved Arabic/Kurdish text styling */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 md:mb-8 fade-in-on-scroll leading-tight">
          <span className="block text-white drop-shadow-2xl" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(255,255,255,0.3)' }}>
            {t('orgName')}
          </span>
        </h1>
        
        {/* Hero content with better structure and visibility */}
        <div className="space-y-4 md:space-y-6 fade-in-on-scroll">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-white leading-relaxed">
            {t('heroTitle')}
          </h2>
          
          <p className="text-lg sm:text-xl md:text-2xl text-blue-200 font-medium glass px-6 py-3 rounded-xl inline-block">
            {t('heroSubtitle')}
          </p>
        </div>
      </div>

      {/* Centered discover more button */}
      <div className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 fade-in-on-scroll">
        <div className="flex flex-col items-center">
          {/* Animated scroll text */}
          <div className="mb-3 md:mb-4 text-center">
            <span className="text-white/80 text-xs sm:text-sm font-medium tracking-wider uppercase">
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
