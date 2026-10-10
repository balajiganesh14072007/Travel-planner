import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authAPI } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  loginDemoUser: () => Promise<void>;
  loginDemoAdmin: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('travelmate_token'));
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      const storedToken = localStorage.getItem('travelmate_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await authAPI.getCurrentUser();
        if (res.success && res.user) {
          setUser(res.user);
          setToken(storedToken);
        } else {
          localStorage.removeItem('travelmate_token');
          setToken(null);
          setUser(null);
        }
      } catch {
        localStorage.removeItem('travelmate_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    setError(null);
    try {
      const res = await authAPI.login({ email, password: pass });
      if (res.success && res.token) {
        localStorage.setItem('travelmate_token', res.token);
        setToken(res.token);
        setUser(res.user);
        return true;
      }
      return false;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(msg);
      return false;
    }
  };

  const register = async (name: string, email: string, pass: string): Promise<boolean> => {
    setError(null);
    try {
      const res = await authAPI.register({ name, email, password: pass });
      if (res.success && res.token) {
        localStorage.setItem('travelmate_token', res.token);
        setToken(res.token);
        setUser(res.user);
        return true;
      }
      return false;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed. Please check your inputs.';
      setError(msg);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('travelmate_token');
    setToken(null);
    setUser(null);
  };

  const loginDemoUser = async () => {
    await login('demo@travelmate.com', 'password123');
  };

  const loginDemoAdmin = async () => {
    await login('admin@travelmate.com', 'admin123');
  };

  const clearError = () => setError(null);

  const isAuthenticated = Boolean(user && token);
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        loading,
        error,
        login,
        register,
        logout,
        loginDemoUser,
        loginDemoAdmin,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
