
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
  const { isScrolled } = useHeaderState();
  const { t } = useLanguage();

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white/80 backdrop-blur-sm'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <HeaderLogo />
          
          <div className="hidden lg:flex items-center space-x-8">
            <NavigationItems />
          </div>

          <div className="flex items-center space-x-4">
            <SearchDialog>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <Search className="w-4 h-4" />
                <span className="sr-only">Search</span>
              </Button>
            </SearchDialog>
            
            <LanguageSelector />
            
            <div className="lg:hidden">
              <MobileMenu />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
