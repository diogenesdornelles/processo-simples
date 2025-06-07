'use client';

import { Flex, Text } from '@chakra-ui/react';
import { useColorModeValue } from '@/components/ui/color-mode';

export default function Footer() {
  const bgColor = useColorModeValue('purple.700', 'purple.900');
  const textColor = 'white';
  const currentYear = new Date().getFullYear();

  return (
    <Flex
      suppressHydrationWarning
      backgroundColor={bgColor}
      minHeight={10}
      px={6}
      alignItems="center"
      justifyContent="center"
    >
      <Text fontSize="sm" color={textColor} textAlign="center">
        © {currentYear} Processo Fácil - Todos os direitos reservados
      </Text>
    </Flex>
  );
}