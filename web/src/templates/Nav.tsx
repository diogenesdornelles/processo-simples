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
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { FiChevronDown, FiSearch, FiUser, FiFileText } from 'react-icons/fi';
import { useColorMode, ColorModeButton } from '@/components/ui/color-mode';

export default function Nav() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const { toggleColorMode } = useColorMode();

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
      backgroundColor="nav.bg"
      minHeight={16}
      flex="0 0 auto"
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
          color="text.color"
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
            color="link.color"
            fontWeight="medium"
            _hover={{ color: 'link.color.hover' }}
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
            color="link.color"
            fontWeight="medium"
            _hover={{ color: 'link.color.hover' }}
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
              color="link.color"
              fontWeight="medium"
              _hover={{ color: 'link.color.hover' }}
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
        <ColorModeButton onClick={toggleColorMode} />

        {/* User Menu ou Login */}
        {isAuthenticated ? (
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button
                variant="ghost"
                color="button.color"
                _hover={{ bg: 'button.bg.hover' }}
                _active={{ bg: 'button.bg.hover' }}
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
                <Menu.Item
                  value=""
                  onClick={() => handleNavigation('/perfil')}
                  color="menuItem.color"
                  _hover={{ bg: 'menuItem.color.hover' }}
                >
                  Meu Perfil
                </Menu.Item>

                <Menu.Item
                  value=""
                  color="menuItem.color"
                  _hover={{ bg: 'menuItem.color.hover' }}
                  onClick={() => handleNavigation('/configuracoes')}
                >
                  Configurações
                </Menu.Item>

                <Menu.Separator />

                <Menu.Item
                  value=""
                  onClick={handleLogout}
                  color="menuItem.color"
                  _hover={{ bg: 'menuItem.color.hover' }}
                >
                  Sair
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Menu.Root>
        ) : (
          <Button
            variant="outline"
            color="button.color"
            bg="button.bg"
            borderColor="button.borderColor"
            _hover={{ bg: 'button.bg.hover' }}
            onClick={() => handleNavigation('/login')}
          >
            Login
          </Button>
        )}
      </HStack>
    </Flex>
  );
}
