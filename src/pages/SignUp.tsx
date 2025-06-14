
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, UserPlus, LogIn } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const SignUp = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSignUp = () => {
    // Simulate customer sign up - in real app, this would call your auth service
    navigate('/dashboard');
  };

  const handleLogin = () => {
    // Simulate customer login - in real app, this would call your auth service
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('backToHome')}
          </Link>
        </div>

        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-white font-bold text-2xl">M</span>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>
              {t('joinTitle')}
            </CardTitle>
            <CardDescription className="text-gray-600" style={{ textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.05)' }}>
              {t('joinSubtitle')}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="signup" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100">
                <TabsTrigger value="signup" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <UserPlus className="w-4 h-4 mr-2" />
                  {t('signUp')}
                </TabsTrigger>
                <TabsTrigger value="login" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <LogIn className="w-4 h-4 mr-2" />
                  {t('loginTab')}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="signup" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-gray-700 font-medium">{t('fullName')}</Label>
                  <Input 
                    id="fullName" 
                    placeholder={t('fullNamePlaceholder')}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">{t('email')}</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder={t('emailPlaceholder')}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium">{t('password')}</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder={t('passwordPlaceholder')}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
                <Button 
                  onClick={handleSignUp}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {t('joinAsMember')}
                </Button>
              </TabsContent>
              
              <TabsContent value="login" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="loginEmail" className="text-gray-700 font-medium">{t('email')}</Label>
                  <Input 
                    id="loginEmail" 
                    type="email" 
                    placeholder={t('emailPlaceholder')}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loginPassword" className="text-gray-700 font-medium">{t('password')}</Label>
                  <Input 
                    id="loginPassword" 
                    type="password" 
                    placeholder={t('loginPasswordPlaceholder')}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
                <Button 
                  onClick={handleLogin}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {t('loginButton')}
                </Button>
                <div className="text-center">
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
                    {t('forgotPassword')}
                  </a>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-gray-600" style={{ textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.05)' }}>
          {t('termsAgreement')}{' '}
          <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors">
            {t('termsOfService')}
          </a>
          {' '}{t('and')}{' '}
          <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors">
            {t('privacyPolicy')}
          </a>
        </div>

        <div className="text-center mt-4">
          <Link 
            to="/staff-login" 
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            style={{ textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.05)' }}
          >
            {t('staffLogin')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
