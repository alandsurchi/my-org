
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface HeaderLogoProps {
  isScrolled: boolean;
  handleNavigation: (item: { id: string }) => void;
}

const HeaderLogo: React.FC<HeaderLogoProps> = ({ isScrolled, handleNavigation }) => {
  const { t } = useLanguage();

  const getLogoStyling = () => {
    if (isScrolled) {
      return "text-gray-800 hover:text-blue-600";
    }
    return "text-white hover:text-blue-200";
  };

  return (
    <button 
      onClick={() => handleNavigation({ id: 'home' })}
      className="flex items-center space-x-2 md:space-x-3 group cursor-pointer"
    >
      <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
        <img 
          src="/lovable-uploads/eb6198ca-261c-4e22-ba5c-9af9f83d0c52.png" 
          alt="Mrovdostan for Humanitarian Aid Logo" 
          className="w-10 h-10 sm:w-12 sm:h-12 object-contain transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
      </div>
      <span className={`text-lg sm:text-xl font-bold transition-all duration-300 ${getLogoStyling()}`}>
        {t('orgName')}
      </span>
    </button>
  );
};

export default HeaderLogo;
