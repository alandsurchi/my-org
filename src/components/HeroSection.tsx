
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowDown, Sparkles } from 'lucide-react';

const HeroSection = () => {
  const { t } = useLanguage();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

  return (
    <section 
      ref={heroRef} 
      className="relative min-h-screen h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Responsive background with optimized image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-purple-900/60 to-black/50"></div>
        
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
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 md:mb-6 fade-in-on-scroll bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-tight">
          MROVDOSTAN
        </h1>
        
        <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-6 md:mb-8 leading-relaxed fade-in-on-scroll glass px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl">
          <span className="block mb-1 md:mb-2">{t('heroTitle')}</span>
          <span className="text-blue-200 text-base sm:text-lg">{t('heroSubtitle')}</span>
        </div>

        {/* Call to action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 fade-in-on-scroll">
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            {t('donateNow')}
          </Button>
          <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105">
            {t('learnMore')}
          </Button>
        </div>
      </div>

      {/* Enhanced responsive scroll indicator */}
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
