'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { UserProps } from '@/domain/interfaces/user.interfaces';
import { removeTokenFromCookies } from '@/utils/auth/removeTokenFromCookies';
import { removeTokenFromLs } from '@/utils/auth/removeTokenFromLs';
import { Api } from '@/api/Api';
import { saveTokenOnCookies } from '@/utils/auth/saveTokenOnCookies';
import { saveTokenOnLs } from '@/utils/auth/saveTokenOnLs';
import { getTokenFromLs } from '@/utils/auth/getTokenFromLs';
import { getTokenFromCookies } from '@/utils/auth/getTokenFromCookies';

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
  const [mounted, setMounted] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  
  useEffect(() => {
    const checkToken = () => {
      if (typeof window === 'undefined') return false;
      const cookieToken = getTokenFromCookies();
      if (cookieToken) {
        setHasToken(true);
        setMounted(true);
        return true;
      }
      const localToken = getTokenFromLs();
      if (localToken) {
        saveTokenOnCookies(localToken);
        setHasToken(true);
        setMounted(true);
        return true;
      }
      
      setHasToken(false);
      setMounted(true);
      return false;
    };

    checkToken();
  }, []);

  const { 
    data: user, 
    isLoading: loading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => Api.auth.me(),
    enabled: hasToken && mounted,
    retry: false,
    refetchOnWindowFocus: false,
  });


  const login = (token: string) => {
    saveTokenOnCookies(token);
    saveTokenOnLs(token);
    refetch();
    setHasToken(true);
    localStorage.setItem('session', JSON.stringify(user));
  };

  const logout = () => {
    removeTokenFromCookies();
    localStorage.removeItem("session");
    removeTokenFromLs();
    setHasToken(false);

    window.location.href = '/login';
  };

  if (!mounted) {
    return <>Spinner CHAKRA</>;
  }

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