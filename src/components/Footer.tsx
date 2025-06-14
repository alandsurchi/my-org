
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/lovable-uploads/2ba81074-4283-4f16-a659-4f4a054275fa.png" 
                alt="MROVDOSTAN Logo" 
                className="w-10 h-10 rounded-lg object-cover"
              />
              <span className="text-xl font-bold">MROVDOSTAN</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              {t('footerDescription')}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">{t('about')}</a></li>
              <li><a href="#projects" className="text-gray-400 hover:text-white transition-colors">{t('projects')}</a></li>
              <li><a href="#news" className="text-gray-400 hover:text-white transition-colors">{t('news')}</a></li>
              <li><a href="#gallery" className="text-gray-400 hover:text-white transition-colors">{t('gallery')}</a></li>
              <li><a href="#staff" className="text-gray-400 hover:text-white transition-colors">{t('staff')}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t('contactInfo')}</h3>
            <ul className="space-y-2 text-gray-400">
              <li>📧 info@mrovdostan.org</li>
              <li>📱 +964 750 123 4567</li>
              <li>📍 Erbil, Kurdistan Region, Iraq</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t('followUs')}</h3>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <span className="text-white font-bold">f</span>
              </a>
              <a href="#" className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                <span className="text-white font-bold">t</span>
              </a>
              <a href="#" className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
                <span className="text-white font-bold">y</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            {t('footerCopyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
