
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, UserPlus, LogIn } from 'lucide-react';

const SignUp = () => {
  const navigate = useNavigate();

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
            Back to Home
          </Link>
        </div>

        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-white font-bold text-2xl">M</span>
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Join MROVDOSTAN
            </CardTitle>
            <CardDescription className="text-gray-600">
              Connect with our community and make a difference
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="signup" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100">
                <TabsTrigger value="signup" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Sign Up
                </TabsTrigger>
                <TabsTrigger value="login" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="signup" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-gray-700 font-medium">Full Name</Label>
                  <Input 
                    id="fullName" 
                    placeholder="Enter your full name"
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email"
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Create a password"
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
                <Button 
                  onClick={handleSignUp}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Join as Community Member
                </Button>
              </TabsContent>
              
              <TabsContent value="login" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="loginEmail" className="text-gray-700 font-medium">Email</Label>
                  <Input 
                    id="loginEmail" 
                    type="email" 
                    placeholder="Enter your email"
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loginPassword" className="text-gray-700 font-medium">Password</Label>
                  <Input 
                    id="loginPassword" 
                    type="password" 
                    placeholder="Enter your password"
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
                <Button 
                  onClick={handleLogin}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Login
                </Button>
                <div className="text-center">
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
                    Forgot your password?
                  </a>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-gray-600">
          By joining, you agree to our{' '}
          <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors">Privacy Policy</a>
        </div>

        <div className="text-center mt-4">
          <Link 
            to="/staff-login" 
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Staff Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
