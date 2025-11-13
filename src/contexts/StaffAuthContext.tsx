
import React, { createContext, useContext, useState, useEffect } from 'react';

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
      console.log('🔐 Attempting login with backend API...');
      
      // Call backend login API
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Login failed:', errorData.message);
        return false;
      }

      const data = await response.json();
      console.log('✅ Login successful:', data);

      const user: StaffUser = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name || email.split('@')[0],
        role: data.user.role,
        isSuperAdmin: data.user.isSuperAdmin || false
      };

      setStaffUser(user);
      localStorage.setItem('staffUser', JSON.stringify(user));
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('sessionTimestamp', Date.now().toString());
      
      return true;
    } catch (error) {
      console.error('❌ Login error:', error);
      return false;
    }
  };

  const logout = () => {
    console.log('🚪 Logging out - clearing all authentication data');
    setStaffUser(null);
    
    // Clear all possible authentication-related localStorage items
    localStorage.removeItem('staffUser');
    localStorage.removeItem('authToken');
    localStorage.removeItem('sessionTimestamp');
    localStorage.removeItem('staffAuthTimestamp');
    localStorage.removeItem('staffSessionExpiry');
    localStorage.removeItem('auth_token');
    
    console.log('🧹 All authentication data cleared');
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
