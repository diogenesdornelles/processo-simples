'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useQuery } from '@tanstack/react-query';
import { UserProps } from '@/domain/interfaces/user.interfaces';
import { manageToken } from '@/utils/auth/manageToken';
import { Api } from '@/api/Api';

interface AuthContextType {
  user: UserProps | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  refetch: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [hasToken, setHasToken] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    if (typeof window !== 'undefined') {
      const token = manageToken.ls.get() || manageToken.cookies.get();
      setHasToken(!!token);
    }
  }, []);

  const {
    data: user,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => Api.auth.me(),
    enabled: hasToken && isClient,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const login = (token: string) => {
    manageToken.ls.save(token);
    manageToken.cookies.save(token);
    setHasToken(true);
    refetch();
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem('session', JSON.stringify(user));
    }
  }, [user]);

  const logout = () => {
    manageToken.ls.remove();
    manageToken.cookies.remove();
    localStorage.removeItem('session');
    setHasToken(false);
    window.location.href = '/login';
  };

  const value: AuthContextType = {
    user: user || null,
    loading: hasToken ? loading : false,
    error: error as Error | null,
    isAuthenticated: !!user && hasToken,
    login,
    logout,
    refetch,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}