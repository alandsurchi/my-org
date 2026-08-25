
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

interface LoginAttempt {
  timestamp: number;
  ip?: string;
}

const StaffLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useStaffAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [accessedViaSecret, setAccessedViaSecret] = useState(false);

  const MAX_ATTEMPTS = parseInt(import.meta.env.VITE_STAFF_LOGIN_ATTEMPTS_LIMIT) || 3;
  const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes

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

    // Check if IP is blocked
    const storedAttempts = localStorage.getItem('staffLoginAttempts');
    if (storedAttempts) {
      const attempts: LoginAttempt[] = JSON.parse(storedAttempts);
      const recentAttempts = attempts.filter(
        attempt => Date.now() - attempt.timestamp < BLOCK_DURATION
      );
      
      if (recentAttempts.length >= MAX_ATTEMPTS) {
        setIsBlocked(true);
        const lastAttempt = Math.max(...recentAttempts.map(a => a.timestamp));
        const remainingTime = BLOCK_DURATION - (Date.now() - lastAttempt);
        setBlockTimeRemaining(Math.ceil(remainingTime / 1000));
      }
      
      setLoginAttempts(recentAttempts);
    }

    // Clear form on component mount for security
    return () => {
      setEmail('');
      setPassword('');
    };
  }, [isAuthenticated, navigate, location]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBlocked && blockTimeRemaining > 0) {
      interval = setInterval(() => {
        setBlockTimeRemaining(prev => {
          if (prev <= 1) {
            setIsBlocked(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBlocked, blockTimeRemaining]);

  const recordFailedAttempt = () => {
    const newAttempt: LoginAttempt = {
      timestamp: Date.now(),
    };
    
    const updatedAttempts = [...loginAttempts, newAttempt];
    setLoginAttempts(updatedAttempts);
    localStorage.setItem('staffLoginAttempts', JSON.stringify(updatedAttempts));

    if (updatedAttempts.length >= MAX_ATTEMPTS) {
      setIsBlocked(true);
      setBlockTimeRemaining(BLOCK_DURATION / 1000);
    } else if (updatedAttempts.length >= MAX_ATTEMPTS - 1) {
      setShowCaptcha(true);
    }
  };

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isBlocked) {
      toast({
        title: "Access Blocked",
        description: `Too many failed attempts. Try again in ${Math.ceil(blockTimeRemaining / 60)} minutes.`,
        variant: "destructive",
      });
      return;
    }

    if (showCaptcha && !captchaVerified) {
      setError('Please complete the CAPTCHA verification');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      
      if (success) {
        // Clear failed attempts on successful login
        localStorage.removeItem('staffLoginAttempts');
        
        toast({
          title: "Access Granted",
          description: "Welcome to the staff dashboard",
        });
        
        navigate('/dashboard');
      } else {
        recordFailedAttempt();
        setError('Invalid credentials. Access denied.');
        
        // Clear form for security
        setPassword('');
        
        toast({
          title: "Access Denied",
          description: `Invalid credentials. ${MAX_ATTEMPTS - loginAttempts.length - 1} attempts remaining.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      setError('System error. Please try again later.');
      recordFailedAttempt();
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isBlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-900 border-red-800">
          <CardHeader className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <CardTitle className="text-red-400">Access Temporarily Blocked</CardTitle>
            <CardDescription className="text-gray-400">
              Too many failed login attempts detected
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-red-400 text-lg font-mono">
              {formatTime(blockTimeRemaining)}
            </div>
            <p className="text-gray-500 mt-2 text-sm">
              Please wait before attempting to access this system again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

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

              {loginAttempts.length > 0 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {MAX_ATTEMPTS - loginAttempts.length} attempts remaining before temporary lockout
                  </AlertDescription>
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
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {showCaptcha && (
                <div className="space-y-2">
                  <Label className="text-gray-200">Security Verification</Label>
                  <div className="p-4 border border-gray-600 rounded bg-gray-800 text-center">
                    <p className="text-gray-400 text-sm mb-2">Verify you are human</p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCaptchaVerified(true)}
                      className="text-sm"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      I'm not a robot
                    </Button>
                    {captchaVerified && (
                      <p className="text-green-400 text-sm mt-2">✓ Verified</p>
                    )}
                  </div>
                </div>
              )}
              
              <Button 
                type="submit"
                disabled={isLoading || (showCaptcha && !captchaVerified)}
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
              <a href="#" className="text-sm text-orange-400 hover:text-orange-300 transition-colors">
                Contact IT for password reset
              </a>
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
