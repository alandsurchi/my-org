import React from 'react';
import { Button } from '@/components/ui/button';
import { useStaffAuth } from '@/contexts/StaffAuthContext';
import { useToast } from '@/hooks/use-toast';

const AuthDebugPanel = () => {
  const { staffUser, logout, isAuthenticated } = useStaffAuth();
  const { toast } = useToast();

  const clearAllAuth = () => {
    // Clear all authentication data
    localStorage.removeItem('staffUser');
    localStorage.removeItem('sessionTimestamp');
    localStorage.removeItem('staffLoginAttempts');
    
    // Force logout
    logout();
    
    toast({
      title: "Authentication Cleared",
      description: "All authentication data has been cleared. You must log in again.",
    });
    
    // Force page reload to reset state
    window.location.reload();
  };

  const showAuthStatus = () => {
    const staffData = localStorage.getItem('staffUser');
    const sessionData = localStorage.getItem('sessionTimestamp');
    const attemptsData = localStorage.getItem('staffLoginAttempts');
    
    console.log('🔍 Authentication Debug Info:');
    console.log('- isAuthenticated:', isAuthenticated);
    console.log('- staffUser:', staffUser);
    console.log('- localStorage staffUser:', staffData);
    console.log('- localStorage sessionTimestamp:', sessionData);
    console.log('- localStorage staffLoginAttempts:', attemptsData);
    
    toast({
      title: "Debug Info",
      description: "Check console for authentication details",
    });
  };

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-gray-900 border border-gray-700 rounded-lg text-white z-50">
      <h3 className="text-sm font-bold mb-2">Auth Debug Panel</h3>
      <div className="space-y-2 text-xs">
        <p>Status: {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}</p>
        <p>User: {staffUser?.email || 'None'}</p>
        <div className="space-x-2">
          <Button size="sm" variant="outline" onClick={showAuthStatus}>
            Check Status
          </Button>
          <Button size="sm" variant="destructive" onClick={clearAllAuth}>
            Clear Auth
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthDebugPanel;
