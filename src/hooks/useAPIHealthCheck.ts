import { useState, useEffect } from 'react';
import api from '@/lib/charityDashboardAPI';

interface HealthCheckState {
  isHealthy: boolean;
  isChecking: boolean;
  error: string | null;
  lastCheck: Date | null;
}

export const useAPIHealthCheck = () => {
  const [state, setState] = useState<HealthCheckState>({
    isHealthy: false,
    isChecking: true,
    error: null,
    lastCheck: null
  });

  const checkHealth = async () => {
    try {
      setState(prev => ({ ...prev, isChecking: true, error: null }));
      
      // Try to fetch a simple endpoint to check if API is available
      const response = await fetch('http://localhost:5000/', {
        method: 'GET',
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });
      
      if (response.ok) {
        console.log('✅ API Health Check: Backend is healthy');
        setState({
          isHealthy: true,
          isChecking: false,
          error: null,
          lastCheck: new Date()
        });
        return true;
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('❌ API Health Check Failed:', error);
      setState({
        isHealthy: false,
        isChecking: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        lastCheck: new Date()
      });
      return false;
    }
  };

  useEffect(() => {
    // Initial health check
    checkHealth();
    
    // Set up periodic health checks every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    ...state,
    checkHealth
  };
};
