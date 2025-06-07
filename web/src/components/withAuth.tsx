'use client';

import { ComponentType } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';

interface WithAuthOptions {
  requireAdmin?: boolean;
  redirectTo?: string;
  fallback?: ComponentType;
}

export function withAuth<P extends object>(
  Component: ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const AuthenticatedComponent = function(props: P) {
    return (
      <ProtectedRoute 
        requireAdmin={options.requireAdmin}
        redirectTo={options.redirectTo}
        fallback={options.fallback}
      >
        <Component {...props} />
      </ProtectedRoute>
    );
  };

  AuthenticatedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;
  return AuthenticatedComponent;
}