
import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HeaderLogo from './header/HeaderLogo';
import NavigationItems from './header/NavigationItems';
import LanguageSelector from './header/LanguageSelector';
import MobileMenu from './header/MobileMenu';
import SearchDialog from './SearchDialog';
import { useHeaderState } from '@/hooks/useHeaderState';
import { useLanguage } from '@/contexts/LanguageContext';

const Header = () => {
  const { 
    isScrolled, 
    isInHeroSection, 
    activeSection, 
    isMobileMenuOpen, 
    setIsMobileMenuOpen 
  } = useHeaderState();
  const { t } = useLanguage();

  // Styling functions based on scroll state and theme
  const getLogoStyling = () => {
    return isInHeroSection 
      ? 'text-white group-hover:text-blue-200' 
      : 'text-gray-800 group-hover:text-blue-600';
  };

  const getTextStyling = (itemId: string) => {
    const isActive = activeSection === itemId;
    const baseStyle = 'transition-colors duration-300';
    
    if (isInHeroSection) {
      return `${baseStyle} ${isActive ? 'text-blue-200' : 'text-white hover:text-blue-200'}`;
    } else {
      return `${baseStyle} ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`;
    }
  };

  const getSelectStyling = () => {
    return isInHeroSection
      ? 'border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20'
      : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50';
  };

  const getMobileButtonStyling = () => {
    return isInHeroSection
      ? 'border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20'
      : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50';
  };

  const handleNavigation = (item: { id: string }) => {
    const element = document.getElementById(item.id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else if (item.id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white/80 backdrop-blur-sm'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <HeaderLogo getLogoStyling={getLogoStyling} />
          
          <div className="hidden lg:flex items-center space-x-8">
            <NavigationItems 
              activeSection={activeSection}
              getTextStyling={getTextStyling}
              handleNavigation={handleNavigation}
            />
          </div>

          <div className="flex items-center space-x-4">
            <SearchDialog>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <Search className="w-4 h-4" />
                <span className="sr-only">Search</span>
              </Button>
            </SearchDialog>
            
            <LanguageSelector getSelectStyling={getSelectStyling} />
            
            <div className="lg:hidden">
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
      </div>
    </header>
  );
};

export default Header;
