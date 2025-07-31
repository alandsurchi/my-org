
import React from 'react';
import { LogIn, Menu } from 'lucide-react';
import { Home, Info, Briefcase, Newspaper, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface MobileMenuProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  activeSection: string;
  handleNavigation: (item: any) => void;
  getMobileButtonStyling: () => string;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  activeSection,
  handleNavigation,
  getMobileButtonStyling
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const navigationItems = [
    { id: 'home', labelKey: 'home', icon: Home },
    { id: 'about', labelKey: 'about', icon: Info },
    { id: 'projects', labelKey: 'projects', icon: Briefcase },
    { id: 'news', labelKey: 'news', icon: Newspaper },
    { id: 'gallery', labelKey: 'gallery', icon: Image }
  ];

  return (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`lg:hidden transition-all duration-300 hover:scale-105 touch-manipulation p-2 ${getMobileButtonStyling()}`}
        >
          <Menu className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] sm:w-[300px] bg-white/95 backdrop-blur-md">
        <div className="flex flex-col space-y-4 mt-8">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button 
                key={item.id}
                onClick={() => {
                  handleNavigation(item);
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left transition-all duration-300 font-medium py-3 flex items-center rounded-lg px-3 group touch-manipulation ${
                  isActive 
                    ? 'text-blue-600 bg-blue-50 font-semibold' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <IconComponent className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110" />
                {t(item.labelKey)}
              </button>
            );
          })}
          <Button 
            variant="outline" 
            className="mt-6 justify-start bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 hover:from-blue-700 hover:to-purple-700 hover:scale-105 transition-all duration-300 touch-manipulation"
            onClick={() => {
              setIsMobileMenuOpen(false);
              navigate('/signup');
            }}
          >
            <LogIn className="w-4 h-4 mr-2" />
            {t('signUp')}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
