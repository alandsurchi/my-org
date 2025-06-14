
import React, { useState } from 'react';
import { LogIn, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-bold text-gray-900">MROVDOSTAN</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('about')}
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              {t('about')}
            </button>
            <button 
              onClick={() => scrollToSection('projects')}
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              {t('projects')}
            </button>
            <button 
              onClick={() => scrollToSection('news')}
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              {t('news')}
            </button>
            <button 
              onClick={() => scrollToSection('gallery')}
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              {t('gallery')}
            </button>
            <button 
              onClick={() => scrollToSection('staff')}
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              {t('staff')}
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
              <SelectTrigger className="w-auto">
                <Globe className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
                <SelectItem value="ku">کوردی</SelectItem>
              </SelectContent>
            </Select>

            <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <LogIn className="w-4 h-4 mr-2" />
                  {t('login')}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{t('staffLogin')}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">{t('email')}</Label>
                    <Input id="email" type="email" placeholder="admin@mrovdostan.org" />
                  </div>
                  <div>
                    <Label htmlFor="password">{t('password')}</Label>
                    <Input id="password" type="password" />
                  </div>
                  <div className="flex space-x-2">
                    <Button className="flex-1">{t('loginButton')}</Button>
                    <Button variant="outline" onClick={() => setIsLoginOpen(false)}>
                      {t('cancel')}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
