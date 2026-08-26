import React, { createContext, useContext, useState, useEffect } from 'react';
import { config } from '../config/env';

interface StaffUser {
  id?: string;
  email: string;
  name: string;
  role: string;
  isSuperAdmin?: boolean;
}

interface StaffAuthContextType {
  staffUser: StaffUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const StaffAuthContext = createContext<StaffAuthContextType | undefined>(undefined);

export const StaffAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [staffUser, setStaffUser] = useState<StaffUser | null>(null);

  useEffect(() => {
    // Check for existing session
    const savedStaffUser = localStorage.getItem('staffUser');
    const authToken = localStorage.getItem('authToken');
    
    if (savedStaffUser && authToken) {
      try {
        const user = JSON.parse(savedStaffUser);
        const sessionTimestamp = localStorage.getItem('sessionTimestamp');
        const currentTime = Date.now();
        const sessionTimeout = 60 * 60 * 1000; // 1 hour
        
        if (sessionTimestamp && (currentTime - parseInt(sessionTimestamp)) < sessionTimeout) {
          setStaffUser(user);
        } else {
          // Session expired, clear it
          localStorage.removeItem('staffUser');
          localStorage.removeItem('authToken');
          localStorage.removeItem('sessionTimestamp');
        }
      } catch (error) {
        // Invalid session data, clear it
        localStorage.removeItem('staffUser');
        localStorage.removeItem('authToken');
        localStorage.removeItem('sessionTimestamp');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Call backend login API
      const response = await fetch(`${config.apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => null);
      
      if (!response.ok) {
        console.error('Login failed:', response.status, data);
        return false;
      }

      // Handle both response formats:
      // Format 1: { success, token, user } (direct)
      // Format 2: { success, data: { token, user } } (wrapped)
      const token = data.token || data?.data?.token;
      const userData = data.user || data?.data?.user;

      if (!token || !userData) {
        console.error('Login response missing token or user:', data);
        return false;
      }

      const user: StaffUser = {
        id: userData.id?.toString(),
        email: userData.email,
        name: userData.name || email.split('@')[0],
        role: userData.role,
        isSuperAdmin: userData.isSuperAdmin || false
      };

      setStaffUser(user);
      localStorage.setItem('staffUser', JSON.stringify(user));
      localStorage.setItem('authToken', token);
      localStorage.setItem('sessionTimestamp', Date.now().toString());
      // Clear any stale lockout data
      localStorage.removeItem('staffLoginAttempts');
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setStaffUser(null);
    
    // Clear all possible authentication-related localStorage items
    localStorage.removeItem('staffUser');
    localStorage.removeItem('authToken');
    localStorage.removeItem('sessionTimestamp');
    localStorage.removeItem('staffAuthTimestamp');
    localStorage.removeItem('staffSessionExpiry');
    localStorage.removeItem('auth_token');
  };

  const isAuthenticated = !!staffUser;

  return (
    <StaffAuthContext.Provider value={{ staffUser, login, logout, isAuthenticated }}>
      {children}
    </StaffAuthContext.Provider>
  );
};

export const useStaffAuth = () => {
  const context = useContext(StaffAuthContext);
  if (context === undefined) {
    throw new Error('useStaffAuth must be used within a StaffAuthProvider');
  }
  return context;
};
