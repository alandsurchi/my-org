import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '@/lib/apiClient';

interface StaffUser {
  email: string;
  name: string;
  role: string;
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
    // Check if staff user is already logged in
    const savedStaffUser = localStorage.getItem('user');
    if (savedStaffUser) {
      try {
        setStaffUser(JSON.parse(savedStaffUser));
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('🔐 Attempting staff login...');
      
      const { data, error } = await apiClient.login(email, password);
      
      if (error || !data) {
        console.error('❌ Login failed:', error);
        return false;
      }
      
      const user = {
        email: data.user.email,
        name: data.user.name,
        role: data.user.role
      };
      
      setStaffUser(user);
      console.log('✅ Login successful:', user);
      return true;
      
    } catch (error) {
      console.error('❌ Login error:', error);
      return false;
    }
  };

  const logout = () => {
    console.log('🚪 Logging out staff user...');
    setStaffUser(null);
    apiClient.logout();
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
