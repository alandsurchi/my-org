import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { NAV_ITEMS, type HeaderTone, type NavItem } from './types';

interface NavigationItemsProps {
  activeSection: string;
  tone: HeaderTone;
  handleNavigation: (item: NavItem) => void;
}

/** Desktop navigation: text links with an animated underline for the active section. */
const NavigationItems: React.FC<NavigationItemsProps> = ({ activeSection, tone, handleNavigation }) => {
  const { t } = useLanguage();
  const onPhoto = tone === 'photo';

  return (
    <nav aria-label={t('mainNavigation')} className="hidden items-center gap-6 lg:flex xl:gap-8">
      {NAV_ITEMS.map((item) => {
        const isActive = activeSection === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => handleNavigation(item)}
            aria-current={isActive ? 'true' : undefined}
            className={cn(
              'relative py-2 text-sm font-medium transition-colors duration-base',
              'after:absolute after:inset-inline-0 after:-bottom-0.5 after:h-0.5 after:origin-center after:scale-x-0 after:rounded-full after:transition-transform after:duration-base',
              'hover:after:scale-x-100 aria-[current=true]:after:scale-x-100',
              onPhoto
                ? 'text-white/85 after:bg-white hover:text-white aria-[current=true]:text-white'
                : 'text-muted-foreground after:bg-primary hover:text-foreground aria-[current=true]:font-semibold aria-[current=true]:text-foreground',
            )}
          >
            {t(item.labelKey)}
          </button>
        );
      })}
    </nav>
  );
};

export default NavigationItems;
