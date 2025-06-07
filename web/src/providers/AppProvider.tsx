'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import {
  ColorModeProvider,
  ColorModeProviderProps,
} from '@/components/ui/color-mode';
import { system } from '@/theme';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from '@/contexts/AuthContext';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      retry: (failureCount, error: any) => {
        if (
          error?.response?.status === 401 ||
          error?.response?.status === 403 ||
          error?.response?.status === 404
        ) {
          return false;
        }
        return failureCount < 2;
      },
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

interface AppProviderProps extends ColorModeProviderProps {
  children: React.ReactNode;
}

export function AppProvider({ children, ...props }: AppProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={system}>
        <AuthProvider>
          <ColorModeProvider {...props}>
            {children}
          </ColorModeProvider>
        </AuthProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}
