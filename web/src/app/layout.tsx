import { AppProvider } from '@/providers/AppProvider';
import Nav from '@/templates/Nav';
import Footer from '@/templates/Footer';
import { Flex } from '@chakra-ui/react';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <html lang="pt-BR" suppressHydrationWarning className={inter.className}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body suppressHydrationWarning>
        <AppProvider>
          <Flex direction="column" minHeight="100vh">
            <Nav />
            {/* Main content area */}
            <Flex flex={1} direction="column">
              {children}
            </Flex>
            <Footer />
          </Flex>
        </AppProvider>
      </body>
    </html>
  );
}
