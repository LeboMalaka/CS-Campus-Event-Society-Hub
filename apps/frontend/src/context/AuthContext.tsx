'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiRequest } from '@/lib/api';

export type User = {
  id: string;
  displayName: string;
  email: string;
  role: 'student' | 'society_admin';
};

type AuthContextValue = {
  user: User | null;
  status: 'loading' | 'ready';
  login: (email: string, password: string, expectedRole?: 'student' | 'society_admin') => Promise<void>;
  register: (displayName: string, email: string, password: string, role: 'student' | 'society_admin') => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready'>('loading');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('campus_user');
      const token = localStorage.getItem('campus_token');

      if (raw && token) {
        setUser(JSON.parse(raw));
      }
    } catch (_error) {
      // ignore malformed localStorage state and continue as signed out
    } finally {
      setStatus('ready');
    }
  }, []);

  const login = async (email: string, password: string, expectedRole?: 'student' | 'society_admin') => {
    const response = await apiRequest<{ data: { user: User; token: string } }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password, expectedRole }),
      }
    );

    const nextUser = response.data?.user;
    const token = response.data?.token;

    if (!nextUser || !token) {
      throw new Error('Invalid login response from server.');
    }

    if (expectedRole && nextUser.role !== expectedRole) {
      throw new Error(`This account is registered as a ${nextUser.role}, not a ${expectedRole}.`);
    }

    localStorage.setItem('campus_user', JSON.stringify(nextUser));
    localStorage.setItem('campus_token', token);
    setUser(nextUser);
  };

  const register = async (
    displayName: string,
    email: string,
    password: string,
    role: 'student' | 'society_admin'
  ) => {
    const response = await apiRequest<{ data: { user: User; token: string } }>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify({ displayName, email, password, role }),
      }
    );

    const nextUser = response.data?.user;
    const token = response.data?.token;

    if (!nextUser || !token) {
      throw new Error('Invalid registration response from server.');
    }

    localStorage.setItem('campus_user', JSON.stringify(nextUser));
    localStorage.setItem('campus_token', token);
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem('campus_user');
    localStorage.removeItem('campus_token');
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      login,
      register,
      logout,
    }),
    [user, status]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
