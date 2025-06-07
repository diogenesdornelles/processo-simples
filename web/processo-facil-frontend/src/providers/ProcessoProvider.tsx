'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { ThemeProvider } from 'next-themes';

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ChakraProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        {children}
      </ThemeProvider>
    </ChakraProvider>
  );
}
export default AppProvider;