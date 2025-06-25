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
import { useGetMe } from '@/services';

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
  error: {
    status: boolean;
    message: string | null;
  };
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { refetch: refetchMe } = useGetMe();
  const [error, setError] = useState<AuthValues['error']>({
    status: false,
    message: null,
  });

  // verifica se existe token em cookies
  const getToken = useCallback(async () => {
    const savedToken = await manageToken.get();
    if (savedToken) {
      setToken(savedToken);
    } else {
      setToken(null)
    }
    return savedToken;
  }, []);

  // garante que o usuário esteja na sessão (ls) ou faz fetch na API, com token
  const getUser = useCallback(async () => {
    const savedUser = await manageSession.getUser();
    if (savedUser) {
      setUser(savedUser);
    } else {
      refetchMe()
        .then(response => {
          if (response.data) {
            setUser(response.data);
            manageSession.saveUser(response.data);
            return response.data;
          } else {
            setUser(null);
            manageSession.clearUser();
            return null;
          }
        })
        .catch(err => {
          console.error('Erro ao obter usuário:', err);
          setError({
            status: true,
            message: err.message || 'Erro ao obter usuário',
          });
          setUser(null);
          return null;
        });
    }
    return savedUser;
  }, [refetchMe]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLoading(true);
      const initializeAuth = async () => {
        await getToken();
        if (token) {
          await getUser();
        } else {
          setUser(null);
          manageSession.clearUser();
        }
      };
      initializeAuth();
      if (error.status) {
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
      setLoading(false);
    }
  }, [getToken, getUser, token, error.status]);

  const login = async (result: LoginProps) => {
    try {
      setLoading(true);
      await manageToken.save(result.token);
      await manageSession.saveUser(result.user);
      setToken(result.token);
      setUser(result.user);
      setIsAuthenticated(true);
      setError({ status: false, message: null });
    } catch (err) {
      console.error('Erro no login:', err);
      await manageToken.remove();
      await manageSession.removeUser();
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setError({ status: true, message: 'Ocorreu um erro ao logar' });
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await manageToken.remove();
      await manageSession.removeUser();
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setError({ status: false, message: null });
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } catch (err) {
      console.error('Erro no logout:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    if (typeof window !== 'undefined') {
      setLoading(true);
      const reInitializeAuth = async () => {
        await getToken();
        if (token) {
          await getUser();
        }
      };
      reInitializeAuth();
      if (error.status) {
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
      setLoading(false);
    }
  }, [token, getToken, getUser, error.status]);

  const value: AuthContextType = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    logout,
    refetch,
    error,
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
