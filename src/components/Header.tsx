
import React, { useState } from 'react';
import { LogIn, Globe, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const navigationItems = [
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'news', label: 'News' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'staff', label: 'Staff' }
  ];

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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {/* Language Selector */}
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

            {/* Sign Up Dialog */}
            <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign Up
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Join MROVDOSTAN</DialogTitle>
                </DialogHeader>
                
                <Tabs defaultValue="signup" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    <TabsTrigger value="login">Login</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="signup" className="space-y-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" placeholder="Enter your full name" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Enter your email" />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" placeholder="Create a password" />
                    </div>
                    <div>
                      <Label htmlFor="userType">I am a:</Label>
                      <Select defaultValue="client">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="client">Community Member/Supporter</SelectItem>
                          <SelectItem value="staff">Staff Member</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex space-x-2">
                      <Button className="flex-1">Create Account</Button>
                      <Button variant="outline" onClick={() => setIsAuthOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="login" className="space-y-4">
                    <div>
                      <Label htmlFor="loginEmail">Email</Label>
                      <Input id="loginEmail" type="email" placeholder="Enter your email" />
                    </div>
                    <div>
                      <Label htmlFor="loginPassword">Password</Label>
                      <Input id="loginPassword" type="password" placeholder="Enter your password" />
                    </div>
                    <div className="flex space-x-2">
                      <Button className="flex-1">Login</Button>
                      <Button variant="outline" onClick={() => setIsAuthOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden">
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigationItems.map((item) => (
                    <button 
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="text-left text-gray-700 hover:text-blue-600 transition-colors font-medium py-2"
                    >
                      {item.label}
                    </button>
                  ))}
                  <Button 
                    variant="outline" 
                    className="mt-4 justify-start"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsAuthOpen(true);
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
