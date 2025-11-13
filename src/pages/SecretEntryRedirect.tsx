import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight } from 'lucide-react';
import { useStaffAuth } from '@/contexts/StaffAuthContext';

const SecretEntryRedirect = () => {
  const navigate = useNavigate();
  const { logout } = useStaffAuth();

  useEffect(() => {
    // Log the secret access attempt for security monitoring
    console.log('🔑 Secret URL accessed - clearing session and redirecting to staff login');
    
    // Always logout first to clear any existing session
    logout();
    
    // Clear any localStorage authentication data
    localStorage.removeItem('staffUser');
    localStorage.removeItem('staffAuthTimestamp');
    localStorage.removeItem('staffSessionExpiry');
    
    // Add a small delay to show the redirect message
    const timer = setTimeout(() => {
      navigate('/staff-login', { state: { fromSecret: true }, replace: true });
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate, logout]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center p-4">
      <div className="text-center">
        <Shield className="mx-auto h-16 w-16 text-blue-400 mb-6 animate-pulse" />
        <h1 className="text-2xl font-bold text-white mb-4">
          Secret Access Detected
        </h1>
        <p className="text-gray-400 mb-6">
          Redirecting to staff authentication...
        </p>
        <div className="flex items-center justify-center space-x-2 text-blue-400">
          <span className="text-sm">Proceeding to login</span>
          <ArrowRight className="h-4 w-4 animate-bounce" />
        </div>
      </div>
    </div>
  );
};

export default SecretEntryRedirect;
