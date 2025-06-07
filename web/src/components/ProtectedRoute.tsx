'use client';

import { ReactNode, ComponentType } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  redirectTo?: string;
  fallback?: ReactNode | ComponentType;
}

export function ProtectedRoute({ 
  children, 
  requireAdmin = false,
  redirectTo,
  fallback 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo || '/login');
      return;
    }

    if (!loading && user && requireAdmin && user.role !== 'Admin') {
      router.push(redirectTo || '/unauthorized');
      return;
    }
  }, [user, loading, router, requireAdmin, redirectTo]);

  if (loading) {
    if (fallback) {
      if (typeof fallback === 'function') {
        const FallbackComponent = fallback as ComponentType;
        return <FallbackComponent />;
      }
      return <>{fallback}</>;
    }
    return <>Loading usando CHAKRA</>;
  }

  if (!user) {
    return null;
  }

  if (requireAdmin && user.role !== 'Admin') {
    return null;
  }

  return <>{children}</>;
}