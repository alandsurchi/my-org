
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useHeaderState } from '@/hooks/useHeaderState';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSecretAccess } from '@/hooks/useSecretAccess';
import HeaderLogo from './header/HeaderLogo';
import NavigationItems from './header/NavigationItems';
import LanguageSelector from './header/LanguageSelector';
import MobileMenu from './header/MobileMenu';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const isHomePage = location.pathname === '/';
  const {
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isScrolled,
    isInHeroSection,
    activeSection
  } = useHeaderState();

  // Initialize secret access (Ctrl+Alt+A or triple-click logo)
  useSecretAccess({
    enabled: true,
    keySequence: ['Control', 'Alt', 'KeyA'],
    clickSequence: {
      selector: '.logo-trigger',
      clicks: 3,
      timeWindow: 2000
    }
  });

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (item: any) => {
    if (item.id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      scrollToSection(item.id);
    }
  };

  // Determine header styling based on scroll and hero section
  const getHeaderStyling = () => {
    // On non-home pages, always use white background
    if (!isHomePage) {
      return 'bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg';
    }
    
    if (isScrolled && !isInHeroSection) {
      return 'bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg';
    } else {
      // Glass effect when in hero section
      return 'glass border-b border-white/20 shadow-lg';
    }
  };

  const getTextStyling = (itemId: string) => {
    const isActive = activeSection === itemId;
    
    // On non-home pages, always use black/dark text
    if (!isHomePage) {
      return isActive 
        ? 'text-blue-600 font-bold' 
        : 'text-gray-900 font-semibold hover:text-blue-600';
    }
    
    if (isScrolled && !isInHeroSection) {
      return isActive 
        ? 'text-blue-600 font-bold' 
        : 'text-gray-900 font-semibold hover:text-blue-600';
    } else {
      return isActive 
        ? 'text-white font-bold' 
        : 'text-white font-semibold hover:text-white';
    }
  };

  const getLogoStyling = () => {
    // On non-home pages, always use gradient
    if (!isHomePage) {
      return 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent';
    }
    
    if (isScrolled && !isInHeroSection) {
      return 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent';
    } else {
      return 'text-white';
    }
  };

  const getSelectStyling = () => {
    // On non-home pages, always use white background
    if (!isHomePage) {
      return 'border-gray-200 bg-white/80 backdrop-blur-sm text-gray-900';
    }
    
    if (isScrolled && !isInHeroSection) {
      return 'border-gray-200 bg-white/80 backdrop-blur-sm text-gray-900';
    } else {
      return 'border-white/30 bg-white/10 backdrop-blur-sm text-white';
    }
  };

  const getMobileButtonStyling = () => {
    // On non-home pages, always use white background
    if (!isHomePage) {
      return 'border-gray-200 bg-white/80 backdrop-blur-sm text-gray-900';
    }
    
    if (isScrolled && !isInHeroSection) {
      return 'border-gray-200 bg-white/80 backdrop-blur-sm text-gray-900';
    } else {
      return 'border-white/30 bg-white/10 backdrop-blur-sm text-white';
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${getHeaderStyling()}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <HeaderLogo getLogoStyling={getLogoStyling} />

          <NavigationItems 
            activeSection={activeSection}
            getTextStyling={getTextStyling}
            handleNavigation={handleNavigation}
          />

          <div className="flex items-center space-x-2 sm:space-x-4">
            <LanguageSelector getSelectStyling={getSelectStyling} />

            <MobileMenu 
              isMobileMenuOpen={isMobileMenuOpen}
              setIsMobileMenuOpen={setIsMobileMenuOpen}
              activeSection={activeSection}
              handleNavigation={handleNavigation}
              getMobileButtonStyling={getMobileButtonStyling}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
