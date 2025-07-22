import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthTokens, LoginCredentials, RegisterData } from '../types';
import { authAPI } from '../services/api';

interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load tokens from localStorage on app start
    const storedTokens = localStorage.getItem('authTokens');
    if (storedTokens) {
      try {
        const parsedTokens = JSON.parse(storedTokens);
        setTokens(parsedTokens);
        // TODO: Verify token validity and get user info
        loadUserProfile(parsedTokens.access);
      } catch (error) {
        console.error('Error parsing stored tokens:', error);
        localStorage.removeItem('authTokens');
      }
    }
    setIsLoading(false);
  }, []);

  const loadUserProfile = async (accessToken: string) => {
    try {
      const userProfile = await authAPI.getProfile(accessToken);
      setUser(userProfile);
    } catch (error) {
      console.error('Error loading user profile:', error);
      logout();
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const tokens = await authAPI.login(credentials); // { access, refresh }
      setTokens(tokens);
      localStorage.setItem('authTokens', JSON.stringify(tokens));
      await loadUserProfile(tokens.access);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      const tokens = await authAPI.register(data); // { access, refresh }
      setTokens(tokens);
      localStorage.setItem('authTokens', JSON.stringify(tokens));
      await loadUserProfile(tokens.access);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem('authTokens');
  };

  const value: AuthContextType = {
    user,
    tokens,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user && !!tokens,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};