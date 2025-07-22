
import React from 'react';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useHeaderState } from '@/hooks/useHeaderState';
import { useLanguage } from '@/contexts/LanguageContext';
import HeaderLogo from './header/HeaderLogo';
import NavigationItems from './header/NavigationItems';
import LanguageSelector from './header/LanguageSelector';
import MobileMenu from './header/MobileMenu';

const Header = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const {
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isScrolled,
    isInHeroSection,
    activeSection
  } = useHeaderState();

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
    if (isScrolled && !isInHeroSection) {
      return 'bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg';
    } else {
      // Glass effect when in hero section
      return 'glass border-b border-white/20 shadow-lg';
    }
  };

  const getTextStyling = (itemId: string) => {
    const isActive = activeSection === itemId;
    if (isScrolled && !isInHeroSection) {
      return isActive 
        ? 'text-blue-600 font-semibold' 
        : 'text-gray-700 hover:text-blue-600';
    } else {
      return isActive 
        ? 'text-white font-semibold' 
        : 'text-white/90 hover:text-white';
    }
  };

  const getLogoStyling = () => {
    if (isScrolled && !isInHeroSection) {
      return 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent';
    } else {
      return 'text-white';
    }
  };

  const getSelectStyling = () => {
    if (isScrolled && !isInHeroSection) {
      return 'border-gray-200 bg-white/80 backdrop-blur-sm';
    } else {
      return 'border-white/30 bg-white/10 backdrop-blur-sm text-white';
    }
  };

  const getMobileButtonStyling = () => {
    if (isScrolled && !isInHeroSection) {
      return 'border-gray-200 bg-white/80 backdrop-blur-sm';
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

            {/* Sign Up Button - hidden on small mobile */}
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden sm:flex bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover-lift touch-manipulation text-sm"
              onClick={() => navigate('/signup')}
            >
              <LogIn className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden md:inline">{t('signUp')}</span>
              <span className="md:hidden">{t('join')}</span>
            </Button>

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
