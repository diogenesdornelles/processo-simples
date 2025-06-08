'use client';

import { Flex, Text } from '@chakra-ui/react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Flex
      suppressHydrationWarning
      flex="0 0 auto"
      bg="footer.bg"
      minHeight={10}
      px={6}
      alignItems="center"
      justifyContent="center"
    >
      <Text fontSize="sm" color="text.color" textAlign="center">
        © {currentYear} Processo Fácil - Todos os direitos reservados
      </Text>
    </Flex>
  );
}
