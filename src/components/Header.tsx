
import React from 'react';
import { useHeaderState } from '@/hooks/useHeaderState';
import HeaderLogo from './header/HeaderLogo';
import NavigationItems from './header/NavigationItems';
import LanguageSelector from './header/LanguageSelector';
import AuthButton from './AuthButton';
import MobileMenu from './header/MobileMenu';

const Header = () => {
  const { 
    isScrolled, 
    activeSection, 
    isMobileMenuOpen, 
    setIsMobileMenuOpen, 
    handleNavigation 
  } = useHeaderState();

  const getHeaderStyling = () => {
    if (isScrolled) {
      return "bg-white/95 backdrop-blur-lg shadow-2xl border-b border-white/20";
    }
    return "bg-white/10 backdrop-blur-md";
  };

  const getTextStyling = (itemId?: string) => {
    if (isScrolled) {
      if (itemId && activeSection === itemId) {
        return "text-blue-600 font-semibold";
      }
      return "text-gray-800 hover:text-blue-600";
    }
    if (itemId && activeSection === itemId) {
      return "text-blue-200 font-semibold";
    }
    return "text-white hover:text-blue-200";
  };

  const getSelectStyling = () => {
    if (isScrolled) {
      return "border-gray-200 bg-white/80 text-gray-800 hover:bg-white";
    }
    return "border-white/30 bg-white/20 text-white hover:bg-white/30";
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${getHeaderStyling()}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <HeaderLogo 
            isScrolled={isScrolled} 
            handleNavigation={handleNavigation} 
          />
          
          <NavigationItems 
            activeSection={activeSection}
            getTextStyling={getTextStyling}
            handleNavigation={handleNavigation}
          />
          
          <div className="flex items-center space-x-4">
            <LanguageSelector getSelectStyling={getSelectStyling} />
            <AuthButton />
            <MobileMenu 
              isMobileMenuOpen={isMobileMenuOpen}
              setIsMobileMenuOpen={setIsMobileMenuOpen}
              isScrolled={isScrolled}
              activeSection={activeSection}
              getTextStyling={getTextStyling}
              handleNavigation={handleNavigation}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
