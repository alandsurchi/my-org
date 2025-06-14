
import React, { createContext, useContext, useState, useEffect } from 'react';

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

// Staff credentials
const STAFF_CREDENTIALS = {
  email: 'aland.surchi456@gmail.com',
  password: 'Aa11don.,',
  name: 'Aland Surchi',
  role: 'Admin'
};

export const StaffAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [staffUser, setStaffUser] = useState<StaffUser | null>(null);

  useEffect(() => {
    // Check if staff user is already logged in
    const savedStaffUser = localStorage.getItem('staffUser');
    if (savedStaffUser) {
      setStaffUser(JSON.parse(savedStaffUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Validate credentials
    if (email === STAFF_CREDENTIALS.email && password === STAFF_CREDENTIALS.password) {
      const user = {
        email: STAFF_CREDENTIALS.email,
        name: STAFF_CREDENTIALS.name,
        role: STAFF_CREDENTIALS.role
      };
      setStaffUser(user);
      localStorage.setItem('staffUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setStaffUser(null);
    localStorage.removeItem('staffUser');
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
