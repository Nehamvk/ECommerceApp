import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { api } from '../api/client';
import { AuthResponse } from '../types';

interface StoredUser {
  email: string;
  fullName: string;
  roles: string[];
}

interface AuthContextValue {
  user: StoredUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredUser(): StoredUser | null {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(readStoredUser());

  const persist = (data: AuthResponse) => {
    localStorage.setItem('token', data.token);
    const storedUser: StoredUser = { email: data.email, fullName: data.fullName, roles: data.roles };
    localStorage.setItem('user', JSON.stringify(storedUser));
    setUser(storedUser);
  };

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
    persist(data);
  }, []);

  const register = useCallback(async (fullName: string, email: string, password: string) => {
    const { data } = await api.post<AuthResponse>('/auth/register', { fullName, email, password });
    persist(data);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isAdmin: !!user?.roles.includes('Admin'),
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
