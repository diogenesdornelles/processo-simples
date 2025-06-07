"use client";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import {
  ColorModeProvider,
  ColorModeProviderProps,
} from "@/components/ui/color-mode";
import { system } from "@/theme";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        if (error?.response?.status === 401 || 
            error?.response?.status === 403 || 
            error?.response?.status === 404) {
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

import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "@/contexts/AuthContext";

export function AppProvider(props: ColorModeProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={system}>
        <AuthProvider>
          <ColorModeProvider {...props} />
        </AuthProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}
