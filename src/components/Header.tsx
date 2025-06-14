
import React, { useState } from 'react';
import { LogIn, Globe, Menu, X, Home, Info, Briefcase, Newspaper, Image, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src="/lovable-uploads/2ba81074-4283-4f16-a659-4f4a054275fa.png" 
                alt="Mrovdostan for Humanitarian Aid Logo" 
                className="w-12 h-12 object-contain mix-blend-multiply"
                style={{ background: 'transparent' }}
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
                  className="text-gray-700 hover:text-blue-600 transition-all duration-200 font-medium relative group flex items-center"
                >
                  <IconComponent className="w-4 h-4 mr-1" />
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-200"></span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
              <SelectTrigger className="w-auto border-gray-200 bg-white/80 backdrop-blur-sm">
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
              className="hidden md:flex bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={() => navigate('/signup')}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign Up
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden border-gray-200 bg-white/80 backdrop-blur-sm">
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
                        className="text-left text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 flex items-center"
                      >
                        <IconComponent className="w-4 h-4 mr-2" />
                        {item.label}
                      </button>
                    );
                  })}
                  <Button 
                    variant="outline" 
                    className="mt-4 justify-start bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 hover:from-blue-700 hover:to-purple-700"
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
