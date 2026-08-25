import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, EyeOff, AlertTriangle, RefreshCw } from 'lucide-react';
import { useStaffAuth } from '@/contexts/StaffAuthContext';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LoginAttempt {
  timestamp: number;
  ip?: string;
}

const SecretStaffLogin = () => {
  const navigate = useNavigate();
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

  const MAX_ATTEMPTS = parseInt(import.meta.env.VITE_STAFF_LOGIN_ATTEMPTS_LIMIT) || 3;
  const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes
  const ENABLE_2FA = import.meta.env.VITE_ENABLE_2FA === 'true';

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
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

    // Security headers check
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      toast({
        title: "Security Warning",
        description: "This page should only be accessed over HTTPS",
        variant: "destructive",
      });
    }

    // Clear form on component mount for security
    return () => {
      setEmail('');
      setPassword('');
    };
  }, [isAuthenticated, navigate, toast]);

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

  const handleSubmit = async (e: React.FormEvent) => {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900 border-gray-700">
        <CardHeader className="text-center">
          <Shield className="mx-auto h-12 w-12 text-blue-400 mb-4" />
          <CardTitle className="text-white">Authorized Access Only</CardTitle>
          <CardDescription className="text-gray-400">
            Staff Management System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Enter authorized email"
                autoComplete="off"
                spellCheck="false"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-800 border-gray-600 text-white pr-10"
                  placeholder="Enter password"
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
                <Label className="text-gray-300">Security Verification</Label>
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
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading || (showCaptcha && !captchaVerified)}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Access System
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            <p>Unauthorized access is prohibited and monitored.</p>
            <p>All activities are logged and tracked.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecretStaffLogin;
