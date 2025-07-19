
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Shield, LogIn, AlertCircle } from 'lucide-react';
import { useStaffAuth } from '@/contexts/StaffAuthContext';
import { useToast } from '@/hooks/use-toast';

const StaffLogin = () => {
  const navigate = useNavigate();
  const { login } = useStaffAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      
      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome to the staff dashboard!",
        });
        navigate('/dashboard');
      } else {
        setError('Invalid email or password. Please check your credentials.');
        toast({
          title: "Login Failed",
          description: "Invalid email or password.",
          variant: "destructive",
        });
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      toast({
        title: "Login Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <Card className="border-0 shadow-2xl bg-white/10 backdrop-blur-md border border-white/20">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-4">
              <Shield className="text-white w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Staff Access
            </CardTitle>
            <CardDescription className="text-gray-300">
              Authorized personnel only
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleStaffLogin} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="staffEmail" className="text-gray-200 font-medium">Staff Email</Label>
                <Input 
                  id="staffEmail" 
                  type="email" 
                  placeholder="Enter your staff email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="staffPassword" className="text-gray-200 font-medium">Password</Label>
                <Input 
                  id="staffPassword" 
                  type="password" 
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500/20"
                />
              </div>
              <Button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-2.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                <LogIn className="w-4 h-4 mr-2" />
                {isLoading ? 'Signing In...' : 'Access Staff Dashboard'}
              </Button>
            </form>
            <div className="text-center mt-4 space-y-2">
              <a href="#" className="text-sm text-orange-400 hover:text-orange-300 transition-colors">
                Contact IT for password reset
              </a>
              <div>
                <Link 
                  to="/signup" 
                  className="text-xs text-gray-500 hover:text-gray-400 transition-colors opacity-30 hover:opacity-100"
                >
                  staff.reg
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-gray-400">
          This area is restricted to authorized MROVDOSTAN staff members only.
        </div>
      </div>
    </div>
  );
};

export default StaffLogin;
