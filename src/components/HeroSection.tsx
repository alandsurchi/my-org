import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowDown, Sparkles } from 'lucide-react';
const HeroSection = () => {
  const {
    t
  } = useLanguage();
  const heroRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, {
      threshold: 0.1
    });
    const elements = document.querySelectorAll('.fade-in-on-scroll');
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  const scrollToNext = () => {
    const nextSection = document.getElementById('about');
    if (nextSection) {
      nextSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background with parallax effect */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000" style={{
      backgroundImage: `url('https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`
    }}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-purple-900/60 to-black/50"></div>
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => <div key={i} className="absolute w-2 h-2 bg-white rounded-full opacity-30 animate-float" style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 6}s`,
          animationDuration: `${4 + Math.random() * 4}s`
        }} />)}
        </div>
      </div>
      
      <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4">
        <h1 className="text-6xl md:text-8xl font-bold mb-6 fade-in-on-scroll bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
          MROVDOSTAN
        </h1>
        
        <div className="text-xl md:text-3xl mb-8 leading-relaxed fade-in-on-scroll glass px-8 py-4 rounded-2xl">
          <span className="block mb-2">Building Hope, Transforming Lives</span>
          <span className="text-blue-200 text-lg">Humanitarian Aid for Kurdistan</span>
        </div>
      </div>

      {/* Enhanced scroll indicator */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 fade-in-on-scroll">
        <div className="flex flex-col items-center">
          {/* Animated scroll text */}
          <div className="mb-4 text-center">
            <span className="text-white/80 text-sm font-medium tracking-wider uppercase">
              Discover More
            </span>
          </div>
          
          {/* Beautiful scroll button */}
          <button onClick={scrollToNext} className="group relative flex flex-col items-center justify-center w-16 h-16 rounded-full border-2 border-white/30 backdrop-blur-sm bg-white/10 hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:scale-110">
            {/* Pulsing ring animation */}
            <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping"></div>
            <div className="absolute inset-0 rounded-full border-2 border-white/10 animate-ping" style={{
            animationDelay: '0.5s'
          }}></div>
            
            {/* Arrow icon */}
            <ArrowDown className="w-6 h-6 text-white/90 group-hover:text-white transition-all duration-300 animate-bounce" />
            
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
          </button>
          
          {/* Scroll line indicator */}
          <div className="mt-4 w-px h-8 bg-gradient-to-b from-white/50 to-transparent"></div>
        </div>
      </div>

      {/* Animated waves */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        
      </div>
    </section>;
};
export default HeroSection;