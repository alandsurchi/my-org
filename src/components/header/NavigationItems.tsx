
import React from 'react';
import { Home, Info, Briefcase, Newspaper, Image } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface NavigationItemsProps {
  activeSection: string;
  getTextStyling: (itemId: string) => string;
  handleNavigation: (item: { id: string }) => void;
}

const NavigationItems: React.FC<NavigationItemsProps> = ({
  activeSection,
  getTextStyling,
  handleNavigation
}) => {
  const { t } = useLanguage();

  const navigationItems = [
    { id: 'home', labelKey: 'home', icon: Home },
    { id: 'about', labelKey: 'about', icon: Info },
    { id: 'projects', labelKey: 'projects', icon: Briefcase },
    { id: 'news', labelKey: 'news', icon: Newspaper },
    { id: 'gallery', labelKey: 'gallery', icon: Image }
  ];

  return (
    <nav className="hidden lg:flex items-center space-x-4 xl:space-x-8">
      {navigationItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = activeSection === item.id;
        return (
          <button 
            key={item.id}
            onClick={() => handleNavigation(item)}
            className={`relative group flex items-center font-medium transition-all duration-300 hover:scale-105 touch-manipulation ${getTextStyling(item.id)}`}
          >
            <IconComponent className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110" />
            <span className="text-sm xl:text-base">{t(item.labelKey)}</span>
            <span className={`absolute -bottom-2 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 rounded-full ${
              isActive ? 'w-full' : 'w-0 group-hover:w-full'
            }`}></span>
            
            {/* Glow effect */}
            <div className={`absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600/10 to-purple-600/10 transition-opacity duration-300 -z-10 ${
              isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}></div>
          </button>
        );
      })}
    </nav>
  );
};

export default NavigationItems;
