import { usePageMeta } from '@/hooks/usePageMeta';

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Shield, LogIn, AlertCircle, Eye, EyeOff, AlertTriangle, RefreshCw } from 'lucide-react';
import { useStaffAuth } from '@/contexts/StaffAuthContext';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { apiClient } from '@/lib/apiClient';



const StaffLogin = () => {
  usePageMeta({ title: 'Staff login', noindex: true });
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useStaffAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [accessedViaSecret, setAccessedViaSecret] = useState(false);
  // "Forgot password" only works when the server can send email
  const [resetAvailable, setResetAvailable] = useState(false);
  useEffect(() => {
    apiClient.getAuthFeatures().then((r) => setResetAvailable(!!r.data?.passwordResetEmail));
  }, []);


  useEffect(() => {
    // Check if accessed via secret method
    const referrer = document.referrer;
    const secretPath = import.meta.env.VITE_SECRET_STAFF_PATH || 'log-org';
    
    if (referrer.includes(secretPath) || location.state?.fromSecret) {
      setAccessedViaSecret(true);
      
      // Force clear all authentication data when accessed via secret methods
      localStorage.removeItem('staffUser');
      localStorage.removeItem('staffAuthTimestamp');
      localStorage.removeItem('staffSessionExpiry');
      localStorage.removeItem('authToken');
      localStorage.removeItem('auth_token');
      
      // Clear form fields
      setEmail('');
      setPassword('');
      setError('');
      
    }

    // Only redirect if authenticated AND not accessed via secret method
    if (isAuthenticated && !referrer.includes(secretPath) && !location.state?.fromSecret) {
      navigate('/dashboard');
      return;
    }

    // Remove any lockout counter left by an older build. It lived in
    // localStorage, so it never stopped an attacker — it only locked the real
    // owner out of their own browser. The server's per-IP limiter is the
    // protection that actually works.
    localStorage.removeItem('staffLoginAttempts');

    // Clear form on component mount for security
    return () => {
      setEmail('');
      setPassword('');
    };
  }, [isAuthenticated, navigate, location]);

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setError('');

    try {
      const result = await login(email, password);

      if (result.ok) {
        toast({
          title: "Access Granted",
          description: "Welcome to the staff dashboard",
        });

        navigate('/dashboard');
        return;
      }

      // Say which of the three things actually went wrong. Reporting a rate
      // limit or an unreachable server as "invalid credentials" sends people
      // looking for a password problem they do not have.
      if (result.reason === 'rate_limited') {
        const minutes = Math.max(1, Math.ceil((result.retryAfterSeconds ?? 900) / 60));
        const message = `Too many sign-in attempts from this network. Your password may be correct — please wait about ${minutes} minute${minutes === 1 ? '' : 's'} and try again.`;
        setError(message);
        toast({ title: "Please wait", description: message, variant: "destructive" });
      } else if (result.reason === 'network') {
        setError('Could not reach the server. Check your connection and try again.');
        toast({ title: "Connection problem", description: "Could not reach the server.", variant: "destructive" });
      } else {
        setError('Invalid credentials. Access denied.');
        setPassword('');
        toast({
          title: "Access Denied",
          description: "That email and password do not match an account.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setError('System error. Please try again later.');
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
              {accessedViaSecret ? 'Secret access detected - Authorized personnel only' : 'Authorized personnel only'}
            </CardDescription>
            {accessedViaSecret && (
              <div className="mt-2 space-y-2">
                <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                  <span className="text-blue-400 text-xs">🔐 Accessed via secure method</span>
                </div>
                <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <span className="text-green-400 text-xs">🧹 Session cleared - Fresh login required</span>
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent>
            <form onSubmit={handleStaffLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
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
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="staffPassword" className="text-gray-200 font-medium">Password</Label>
                <div className="relative">
                  <Input 
                    id="staffPassword" 
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500/20 pr-10"
                    autoComplete="off"
                    spellCheck="false"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-2.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Access Staff Dashboard
                  </>
                )}
              </Button>
            </form>
            
            <div className="text-center mt-4">
              {resetAvailable ? (
                <Link to="/forgot-password" className="text-sm text-orange-400 hover:text-orange-300 transition-colors">
                  Forgot your password?
                </Link>
              ) : (
                <span className="text-sm text-gray-400">Forgot your password? Ask a super admin to reset it from the Staff tab.</span>
              )}
            </div>

            <div className="mt-4 text-center text-xs text-gray-500">
              <p>Unauthorized access is prohibited and monitored.</p>
              <p>All activities are logged and tracked.</p>
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
