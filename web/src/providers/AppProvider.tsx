'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { system } from '@/theme';
import { ToastProvider } from './ToasterProvider';
import { ColorModeProvider } from '@/components/ui/color-mode';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={system}>
        <AuthProvider>
          <ColorModeProvider>
            <ToastProvider>{children}</ToastProvider>
          </ColorModeProvider>
        </AuthProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}
