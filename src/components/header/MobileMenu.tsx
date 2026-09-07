import React from 'react';
import { Menu, Home, Info, Briefcase, Newspaper, Image, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { NAV_ITEMS, type HeaderTone, type NavItem } from './types';

interface MobileMenuProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  activeSection: string;
  tone: HeaderTone;
  handleNavigation: (item: NavItem) => void;
}

const ICONS: Record<NavItem['id'], LucideIcon> = { home: Home, about: Info, projects: Briefcase, news: Newspaper, gallery: Image };

const MobileMenu: React.FC<MobileMenuProps> = ({ isMobileMenuOpen, setIsMobileMenuOpen, activeSection, tone, handleNavigation }) => {
  const { t, language } = useLanguage();
  const isRtl = language !== 'en';

  return (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            'rounded-pill lg:hidden',
            tone === 'photo' ? 'border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white' : 'border-border bg-card',
          )}
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side={isRtl ? 'left' : 'right'} className="w-[300px] bg-background">
        <SheetTitle className="sr-only">{t('mainNavigation')}</SheetTitle>
        <nav aria-label={t('mainNavigation')} className="mt-10 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = ICONS[item.id];
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => { handleNavigation(item); setIsMobileMenuOpen(false); }}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-3 text-start text-base font-medium transition-colors',
                  isActive ? 'bg-accent font-semibold text-accent-foreground' : 'text-foreground hover:bg-muted',
                )}
              >
                <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                {t(item.labelKey)}
              </button>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
