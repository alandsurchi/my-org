
import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { useHeaderState } from '@/hooks/useHeaderState';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSecretAccess } from '@/hooks/useSecretAccess';
import HeaderLogo from './header/HeaderLogo';
import NavigationItems from './header/NavigationItems';
import LanguageSelector from './header/LanguageSelector';
import MobileMenu from './header/MobileMenu';
import ThemeToggle from './ThemeToggle';

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
    setActiveSection: setActiveSectionFromHook
  } = useHeaderState();

  const setActiveSection = useCallback((section: string) => {
    if (typeof setActiveSectionFromHook === 'function') {
      setActiveSectionFromHook(section);
    }
  }, [setActiveSectionFromHook]);

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

  const handleNavigation = (item: { id: string }) => {
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
      const targetHash = `#${item.id}`;
      window.history.replaceState(null, '', targetHash);
      scrollToSection(item.id);
      setActiveSection(item.id);
    }
  };

  // Determine header styling based on scroll and hero section
  const getHeaderStyling = () => {
    if (isScrolled && !isInHeroSection) {
      return 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/60 shadow-lg';
    } else {
      // Glass effect when in hero section
      return 'glass border-b border-white/20 shadow-lg';
    }
  };

  const getTextStyling = (itemId: string) => {
    const isActive = activeSection === itemId;
    if (isScrolled && !isInHeroSection) {
      return isActive 
        ? 'text-blue-600 dark:text-blue-400 font-semibold' 
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
      return 'border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm';
    } else {
      return 'border-white/30 bg-white/10 backdrop-blur-sm text-white';
    }
  };

  const getMobileButtonStyling = () => {
    if (isScrolled && !isInHeroSection) {
      return 'border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm';
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

          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageSelector getSelectStyling={getSelectStyling} />
            <ThemeToggle className={getMobileButtonStyling()} />

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
