'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { UserProps } from '@/domain/interfaces/user.interfaces';
import { manageToken } from '@/utils/auth/manageToken';
import { LoginProps } from '@/domain/interfaces/login.interfaces';

interface AuthActions {
  login: (result: LoginProps) => void;
  logout: () => void;
  refetch: () => void;
}

interface AuthValues {
  user: UserProps | null;
  loading: boolean;
  token: string | null;
  error: Error | null;
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
  const [error, setError] = useState<Error | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClient(true);

      try {
        const savedToken = manageToken.ls.get() || manageToken.cookies.get();

        const sessionData = localStorage.getItem('session');
        let savedUser: UserProps | null = null;

        if (sessionData && sessionData !== '' && sessionData !== 'null') {
          try {
            savedUser = JSON.parse(sessionData);
          } catch (parseError) {
            console.warn('Erro ao fazer parse da sessão:', parseError);
            localStorage.removeItem('session');
          }
        }
        setToken(savedToken);
        setUser(savedUser);
      } catch (err) {
        console.error('Erro na inicialização do auth:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }
  }, []);

  const login = (result: LoginProps) => {
    try {
      manageToken.ls.save(result.token);
      manageToken.cookies.save(result.token);

      localStorage.setItem('session', JSON.stringify(result.user));

      setToken(result.token);
      setUser(result.user);
      setError(null);
    } catch (err) {
      console.error('Erro no login:', err);
      setError(err as Error);
    }
  };

  const logout = () => {
    try {
      manageToken.ls.remove();
      manageToken.cookies.remove();
      localStorage.removeItem('session');

      setToken(null);
      setUser(null);
      setError(null);

      window.location.href = '/login';
    } catch (err) {
      console.error('Erro no logout:', err);
    }
  };

  const refetch = () => {
    if (typeof window !== 'undefined') {
      setLoading(true);

      try {
        const savedToken = manageToken.ls.get() || manageToken.cookies.get();
        const sessionData = localStorage.getItem('session');
        let savedUser: UserProps | null = null;

        if (sessionData && sessionData !== '' && sessionData !== 'null') {
          savedUser = JSON.parse(sessionData);
        }

        setToken(savedToken);
        setUser(savedUser);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }
  };

  const isAuthenticated = isClient && !!token && !!user;

  const value: AuthContextType = {
    user,
    token,
    loading,
    error,
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
