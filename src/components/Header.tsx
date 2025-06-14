
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
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
      navigate('/');
    } else {
      scrollToSection(item.id);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <img 
                src="/lovable-uploads/eb6198ca-261c-4e22-ba5c-9af9f83d0c52.png" 
                alt="Mrovdostan for Humanitarian Aid Logo" 
                className="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
            <span className={`text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent transition-all duration-300 ${
              !isScrolled ? 'text-white' : ''
            }`}>
              MROVDOSTAN
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button 
                  key={item.id}
                  onClick={() => handleNavigation(item)}
                  className={`relative group flex items-center font-medium transition-all duration-300 hover:scale-105 ${
                    isScrolled 
                      ? 'text-gray-700 hover:text-blue-600' 
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  <IconComponent className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110" />
                  {item.label}
                  <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300 rounded-full"></span>
                  
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
              <SelectTrigger className={`w-auto transition-all duration-300 hover:scale-105 ${
                isScrolled 
                  ? 'border-gray-200 bg-white/80 backdrop-blur-sm' 
                  : 'border-white/30 bg-white/10 backdrop-blur-sm text-white'
              }`}>
                <Globe className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ku">کوردی</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
              </SelectContent>
            </Select>

            {/* Sign Up Button */}
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden md:flex bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover-lift"
              onClick={() => navigate('/signup')}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign Up
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`md:hidden transition-all duration-300 hover:scale-105 ${
                    isScrolled 
                      ? 'border-gray-200 bg-white/80 backdrop-blur-sm' 
                      : 'border-white/30 bg-white/10 backdrop-blur-sm text-white'
                  }`}
                >
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-white/95 backdrop-blur-md">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigationItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <button 
                        key={item.id}
                        onClick={() => {
                          handleNavigation(item);
                          setIsMobileMenuOpen(false);
                        }}
                        className="text-left text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium py-3 flex items-center rounded-lg hover:bg-blue-50 px-3 group"
                      >
                        <IconComponent className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110" />
                        {item.label}
                      </button>
                    );
                  })}
                  <Button 
                    variant="outline" 
                    className="mt-6 justify-start bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 hover:from-blue-700 hover:to-purple-700 hover:scale-105 transition-all duration-300"
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
