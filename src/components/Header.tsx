import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useHeaderState } from '@/hooks/useHeaderState';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSecretAccess } from '@/hooks/useSecretAccess';
import { cn } from '@/lib/utils';
import HeaderLogo from './header/HeaderLogo';
import NavigationItems from './header/NavigationItems';
import LanguageSelector from './header/LanguageSelector';
import MobileMenu from './header/MobileMenu';
import ThemeToggle from './ThemeToggle';
import type { HeaderTone, NavItem } from './header/types';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const {
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isScrolled,
    isInHeroSection,
    activeSection,
    setActiveSection: setActiveSectionFromHook,
  } = useHeaderState();

  const setActiveSection = useCallback((section: string) => {
    if (typeof setActiveSectionFromHook === 'function') {
      setActiveSectionFromHook(section);
    }
  }, [setActiveSectionFromHook]);

  // Hidden staff shortcut (Ctrl+Alt+A or triple-click the logo)
  useSecretAccess({
    enabled: true,
    keySequence: ['Control', 'Alt', 'KeyA'],
    clickSequence: { selector: '.logo-trigger', clicks: 3, timeWindow: 2000 },
  });

  const [pendingSection, setPendingSection] = useState<string | null>(null);

  useEffect(() => {
    if (!pendingSection) return;

    const targetHash = pendingSection === 'home' ? '' : `#${pendingSection}`;
    if (targetHash) {
      window.history.replaceState(null, '', targetHash);
    } else {
      window.history.replaceState(null, '', '/');
    }

    const element = document.getElementById(pendingSection);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (pendingSection === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    setActiveSection(pendingSection);
    setIsMobileMenuOpen(false);
    setPendingSection(null);
  }, [location.pathname, pendingSection, setActiveSection, setIsMobileMenuOpen]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (item: NavItem) => {
    if (item.id === 'home') {
      if (location.pathname !== '/') {
        setPendingSection('home');
        navigate('/');
      } else {
        window.history.replaceState(null, '', '/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveSection('home');
        setIsMobileMenuOpen(false);
      }
      return;
    }

    if (location.pathname !== '/') {
      setPendingSection(item.id);
      navigate('/');
    } else {
      window.history.replaceState(null, '', `#${item.id}`);
      scrollToSection(item.id);
      setActiveSection(item.id);
    }
  };

  // Over the hero (or the navy page band) the bar is transparent with white text;
  // once the visitor scrolls past it, it becomes a solid surface.
  const tone: HeaderTone = isScrolled && !isInHeroSection ? 'surface' : 'photo';

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-base',
        tone === 'photo'
          ? 'bg-gradient-to-b from-brand-950/70 to-transparent text-white'
          : 'border-b border-border bg-background/90 text-foreground shadow-sm backdrop-blur-md',
      )}
    >
      <a href="#main-content" className="skip-link">{t('skipToContent')}</a>
      <div className="container-site flex h-[72px] items-center justify-between md:h-20">
        <HeaderLogo tone={tone} />

        <NavigationItems activeSection={activeSection} tone={tone} handleNavigation={handleNavigation} />

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSelector tone={tone} />
          <ThemeToggle
            className={cn(
              'h-10 w-10 rounded-pill',
              tone === 'photo' ? 'border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white' : 'border-border bg-card',
            )}
          />
          <MobileMenu
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            activeSection={activeSection}
            tone={tone}
            handleNavigation={handleNavigation}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
