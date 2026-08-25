import { useState, useEffect } from 'react';
import { config } from '../config/env';

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
      
      // Try to fetch the backend health check endpoint
      const rootUrl = config.apiUrl.replace(/\/api$/, '');
      const response = await fetch(`${rootUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });
      
      if (response.ok) {
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
