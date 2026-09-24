import React, { createContext, useContext, useState, useEffect } from 'react';
import { config } from '../config/env';

interface StaffUser {
  id?: string;
  email: string;
  name: string;
  role: string;
  isSuperAdmin?: boolean;
}

/**
 * Why a sign-in failed, so the page can say something true.
 * A wrong password and an IP that has hit the rate limit are very different
 * problems, and reporting both as "invalid credentials" made the second one
 * impossible to diagnose from the screen.
 */
export interface LoginResult {
  /** True when a session was established. */
  ok: boolean;
  /** Absent on success. */
  reason?: 'invalid' | 'rate_limited' | 'network';
  /** Seconds until the rate limit resets, when the server reports it. */
  retryAfterSeconds?: number;
}
// Deliberately one shape rather than a discriminated union: this project
// compiles with "strict": false, and narrowing on a discriminant needs
// strictNullChecks, so the union would not narrow at the call site.

interface StaffAuthContextType {
  staffUser: StaffUser | null;
  login: (email: string, password: string) => Promise<LoginResult>;
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

  const login = async (email: string, password: string): Promise<LoginResult> => {
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
        // The server rate-limits by IP. Reporting that as "invalid credentials"
        // sends people hunting for a password problem they do not have.
        if (response.status === 429) {
          const header = Number(response.headers.get('ratelimit-reset'));
          return {
            ok: false,
            reason: 'rate_limited',
            retryAfterSeconds: Number.isFinite(header) && header > 0 ? header : data?.retryAfter,
          };
        }
        return { ok: false, reason: 'invalid' };
      }

      // Handle both response formats:
      // Format 1: { success, token, user } (direct)
      // Format 2: { success, data: { token, user } } (wrapped)
      const token = data.token || data?.data?.token;
      const userData = data.user || data?.data?.user;

      if (!token || !userData) {
        console.error('Login response missing token or user:', data);
        return { ok: false, reason: 'invalid' };
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

      return { ok: true };
    } catch (error) {
      console.error('Login error:', error);
      return { ok: false, reason: 'network' };
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
