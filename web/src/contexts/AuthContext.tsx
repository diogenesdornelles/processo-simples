'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { UserProps } from '@/domain/interfaces/user.interfaces';
import { manageToken } from '@/utils/auth/manageToken';
import { manageSession } from '@/utils/session/manageSession';
import { LoginProps } from '@/domain/interfaces/login.interfaces';

interface AuthActions {
  login: (result: LoginProps) => Promise<void>;
  logout: () => void;
  refetch: () => void;
}

interface AuthValues {
  user: UserProps | null;
  loading: boolean;
  token: string | null;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthValues, AuthActions {}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  const getToken = useCallback(async () => {
    const savedToken = await manageToken.get();
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const getSession = useCallback(async () => {
    const savedUser = await manageSession.get();
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLoading(true);
      setIsClient(true);

      const initializeAuth = async () => {
        await getToken();
        await getSession();
        if (!token) {
          manageSession.clear();
        }
        setLoading(false);
      };

      initializeAuth();
    }
  }, [getToken, getSession, token]);

  const login = async (result: LoginProps) => {
    try {
      await manageToken.save(result.token);
      await manageSession.save(result.user);
      setToken(result.token);
      setUser(result.user);
    } catch (err) {
      console.error('Erro no login:', err);
    }
  };

  const logout = useCallback(async () => {
    try {
      await manageToken.remove();
      await manageSession.remove();
      setToken(null);
      setUser(null);
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } catch (err) {
      console.error('Erro no logout:', err);
    }
  }, []);

  const refetch = useCallback(async () => {
    if (typeof window !== 'undefined') {
      setLoading(true);

      try {
        const savedToken = await manageToken.get();
        const savedUser = await manageSession.get();

        setToken(savedToken);
        setUser(savedUser);
        if (!token) {
          manageSession.clear();
        }
      } catch (error) {
        console.error('Erro ao refetch:', error);
        await manageToken.remove();
        await manageSession.remove();
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
  }, []);

  const isAuthenticated = isClient && !!token && !!user;

  const value: AuthContextType = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    logout,
    refetch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
