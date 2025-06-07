'use client';

import {
  Flex,
  Box,
  HStack,
  Link,
  Button,
  Avatar,
  Text,
} from '@chakra-ui/react';
import { Menu } from '@chakra-ui/react';
import { ColorModeButton, useColorModeValue } from '@/components/ui/color-mode';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { FiChevronDown, FiSearch, FiUser, FiFileText } from 'react-icons/fi';

export default function Nav() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  const bgColor = useColorModeValue('purple.700', 'purple.900');
  const textColor = 'white';
  const hoverBg = useColorModeValue('purple.600', 'purple.800');

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleLogout = () => {
    if (confirm('Tem certeza que deseja sair?')) {
      logout();
    }
  };

  return (
    <Flex
      suppressHydrationWarning
      backgroundColor={bgColor}
      minHeight={16}
      px={6}
      alignItems="center"
      justifyContent="space-between"
      boxShadow="md"
    >
      {/* Logo/Brand */}
      <Box suppressHydrationWarning>
        <Text
          fontSize="xl"
          fontWeight="bold"
          color={textColor}
          cursor="pointer"
          onClick={() => handleNavigation('/home')}
        >
          Processo Fácil
        </Text>
      </Box>

      {/* Navigation Links */}
      {isAuthenticated && (
        <HStack gap={6}>
          {/* Processos */}
          <Link
            color={textColor}
            fontWeight="medium"
            _hover={{ color: 'blue.200' }}
            onClick={() => handleNavigation('/processos')}
            cursor="pointer"
            display="flex"
            alignItems="center"
            gap={2}
          >
            <FiFileText />
            Processos
          </Link>

          {/* Pesquisar */}
          <Link
            color={textColor}
            fontWeight="medium"
            _hover={{ color: 'blue.200' }}
            onClick={() => handleNavigation('/pesquisar')}
            cursor="pointer"
            display="flex"
            alignItems="center"
            gap={2}
          >
            <FiSearch />
            Pesquisar
          </Link>

          {/* Registrar (se for admin) */}
          {user?.role === 'Admin' && (
            <Link
              color={textColor}
              fontWeight="medium"
              _hover={{ color: 'blue.200' }}
              onClick={() => handleNavigation('/registrar')}
              cursor="pointer"
              display="flex"
              alignItems="center"
              gap={2}
            >
              <FiUser />
              Registrar
            </Link>
          )}
        </HStack>
      )}

      {/* Right Side - User Menu & Theme Toggle */}
      <HStack gap={4}>
        {/* Theme Toggle */}
        <ColorModeButton />

        {/* User Menu ou Login */}
        {isAuthenticated ? (
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button
                variant="ghost"
                color={textColor}
                _hover={{ bg: hoverBg }}
                _active={{ bg: hoverBg }}
              >
                <HStack gap={2}>
                  <Avatar.Root>
                    <Avatar.Fallback name={user?.name} />
                    <Avatar.Image src="https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/user-profile-icon.png" />
                  </Avatar.Root>
                  <Text display={{ base: 'none', md: 'block' }}>
                    {user?.name}
                  </Text>
                  <FiChevronDown />
                </HStack>
              </Button>
            </Menu.Trigger>

            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item value="" onClick={() => handleNavigation('/perfil')}>
                  Meu Perfil
                </Menu.Item>

                <Menu.Item
                  value=""
                  onClick={() => handleNavigation('/configuracoes')}
                >
                  Configurações
                </Menu.Item>

                <Menu.Separator />

                <Menu.Item
                  value=""
                  onClick={handleLogout}
                  color="red.500"
                  _hover={{ bg: 'red.50' }}
                >
                  Sair
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Menu.Root>
        ) : (
          <Button
            variant="outline"
            color={textColor}
            borderColor={textColor}
            _hover={{ bg: 'whiteAlpha.200' }}
            onClick={() => handleNavigation('/login')}
          >
            Login
          </Button>
        )}
      </HStack>
    </Flex>
  );
}
