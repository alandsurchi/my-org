import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAboutImage } from '@/hooks/useAboutAPI';
import { Heart } from 'lucide-react';
import { config } from '../config/env';

const AboutSection = () => {
  const { t } = useLanguage();
  const { data: aboutImage } = useAboutImage();

  return (
    <section id="about" className="py-24 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-green-200/20 to-blue-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="text-center mb-20 fade-in-on-scroll">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 mb-8 animate-scale-in shadow-2xl">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t('aboutTitle')}
            </span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="fade-in-on-scroll">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-700 leading-relaxed font-light mb-8" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.05)' }}>
                {t('aboutDescription')}
              </p>
            </div>
          </div>

          <div className="fade-in-on-scroll">
            <div className="relative">
              <img 
                src={
                  aboutImage && aboutImage.url
                    ? (aboutImage.url.startsWith('http') ? aboutImage.url : `${config.cdnUrl}${aboutImage.url}`)
                    : "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=600&h=400&fit=crop"
                }
                alt="MROVDOSTAN community work" 
                className="rounded-3xl shadow-2xl w-full h-96 object-cover hover-lift" 
              />
              
              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 animate-float"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
