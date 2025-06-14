
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
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold">MROVDOSTAN</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Building hope for tomorrow through sustainable development, education, and healthcare initiatives.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">{t('about')}</a></li>
              <li><a href="#projects" className="text-gray-400 hover:text-white transition-colors">{t('projects')}</a></li>
              <li><a href="#team" className="text-gray-400 hover:text-white transition-colors">{t('team')}</a></li>
              <li><a href="#news" className="text-gray-400 hover:text-white transition-colors">{t('news')}</a></li>
              <li><a href="#gallery" className="text-gray-400 hover:text-white transition-colors">{t('gallery')}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-2 text-gray-400">
              <li>📧 info@mrovdostan.org</li>
              <li>📱 +964 750 123 4567</li>
              <li>📍 Erbil, Kurdistan Region, Iraq</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
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
            © 2024 MROVDOSTAN. All rights reserved. | Built with ❤️ for making a difference.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
