'use client';

import { ReactNode, ComponentType } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import CustomBackdrop from '@/components/ui/CustomBackdrop';

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
  fallback,
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push(redirectTo || '/login');
        return;
      }

      if (requireAdmin && user?.role !== 'Admin') {
        router.push('/unauthorized');
        return;
      }
    }
  }, [isAuthenticated, user, loading, router, requireAdmin, redirectTo]);

  if (loading) {
    if (fallback) {
      if (typeof fallback === 'function') {
        const FallbackComponent = fallback as ComponentType;
        return <FallbackComponent />;
      }
      return <>{fallback}</>;
    }
    return <CustomBackdrop isOpen={true} />;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requireAdmin && user?.role !== 'Admin') {
    return null;
  }

  return <>{children}</>;
}
