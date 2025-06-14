
import React, { useState, useEffect } from 'react';
import { LogIn, Globe, Menu, X, Home, Info, Briefcase, Newspaper, Image, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isInHeroSection, setIsInHeroSection] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);
      
      // Check if we're in the hero section (top of the page)
      const heroSection = document.querySelector('section');
      if (heroSection) {
        const heroHeight = heroSection.offsetHeight;
        setIsInHeroSection(scrollY < heroHeight - 100); // Give some buffer
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            if (sectionId) {
              setActiveSection(sectionId);
            } else {
              // If no id, assume it's the hero section (home)
              setActiveSection('home');
            }
          }
        });
      },
      {
        threshold: 0.3, // Section needs to be 30% visible to be considered active
        rootMargin: '-100px 0px -100px 0px' // Offset to account for header height
      }
    );

    // Observe all sections
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
      if (index === 0 && !section.id) {
        // First section without ID is assumed to be hero/home
        observer.observe(section);
      } else if (section.id) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'about', label: 'About', icon: Info },
    { id: 'projects', label: 'Activities', icon: Briefcase },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'staff', label: 'Staff', icon: Users }
  ];

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
          <div className="flex items-center space-x-2 md:space-x-3 group">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
              <img 
                src="/lovable-uploads/eb6198ca-261c-4e22-ba5c-9af9f83d0c52.png" 
                alt="Mrovdostan for Humanitarian Aid Logo" 
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
            <span className={`text-lg sm:text-xl font-bold transition-all duration-300 ${getLogoStyling()}`}>
              MROVDOSTAN
            </span>
          </div>

          {/* Desktop Navigation - hidden on mobile */}
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
                  <span className="text-sm xl:text-base">{item.label}</span>
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

          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Language Selector */}
            <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
              <SelectTrigger className={`w-auto min-w-[80px] sm:min-w-[100px] transition-all duration-300 hover:scale-105 touch-manipulation ${getSelectStyling()}`}>
                <Globe className="w-4 h-4 mr-1 sm:mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ku">کوردی</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
              </SelectContent>
            </Select>

            {/* Sign Up Button - hidden on small mobile */}
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden sm:flex bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover-lift touch-manipulation text-sm"
              onClick={() => navigate('/signup')}
            >
              <LogIn className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden md:inline">Sign Up</span>
              <span className="md:hidden">Join</span>
            </Button>

            {/* Mobile Menu */}
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
                        {item.label}
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
                    Sign Up
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
