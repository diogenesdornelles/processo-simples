'use client';

import {
  Flex,
  Box,
  HStack,
  Link,
  Button,
  Avatar,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { Menu } from '@chakra-ui/react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { FiChevronDown, FiSearch, FiFileText, FiUsers } from 'react-icons/fi';
import { useColorMode, ColorModeButton } from '@/components/ui/color-mode';
import { UserViewModal } from '@/components/modals/UserViewModal';

export default function Nav() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const { toggleColorMode } = useColorMode();
  const viewModal = useDisclosure();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleLogout = () => {
    if (confirm('Tem certeza que deseja sair?')) {
      logout();
    }
  };

  const handleView = () => {
    viewModal.onOpen();
  };

  return (
    <Flex
      suppressHydrationWarning
      bg="primary.gray.bg"
      color="primary.gray.color"
      minHeight={16}
      flex="0 0 auto"
      px={6}
      alignItems="center"
      justifyContent="space-between"
      boxShadow="md"
      borderBottom="1px"
      borderColor="secondary.gray.bg"
    >
      <Box suppressHydrationWarning>
        <Text
          fontSize="xl"
          fontWeight="bold"
          cursor="pointer"
          color="primary.purple.color"
          _hover={{
            color: 'primary.purple.color.hover',
            transform: 'scale(1.05)',
            transition: 'all 0.2s',
          }}
          onClick={() => handleNavigation('/home')}
        >
          Processo Fácil
        </Text>
      </Box>

      {isAuthenticated && (
        <HStack gap={6}>
          <Link
            color="secondary.gray.color"
            fontWeight="medium"
            _hover={{
              color: 'secondary.gray.color.hover',
              bg: 'secondary.gray.bg.hover',
              borderRadius: 'md',
              transition: 'all 0.2s',
            }}
            onClick={() => handleNavigation('/processos')}
            cursor="pointer"
            display="flex"
            alignItems="center"
            gap={2}
            px={3}
            py={2}
          >
            <FiFileText />
            Processos
          </Link>
          <Link
            color="secondary.gray.color"
            fontWeight="medium"
            _hover={{
              color: 'secondary.gray.color.hover',
              bg: 'secondary.gray.bg.hover',
              borderRadius: 'md',
              transition: 'all 0.2s',
            }}
            onClick={() => handleNavigation('/pesquisar')}
            cursor="pointer"
            display="flex"
            alignItems="center"
            gap={2}
            px={3}
            py={2}
          >
            <FiSearch />
            Pesquisar
          </Link>

          <Link
            color="secondary.gray.color"
            fontWeight="medium"
            _hover={{
              color: 'secondary.gray.color.hover',
              bg: 'secondary.gray.bg.hover',
              borderRadius: 'md',
              transition: 'all 0.2s',
            }}
            onClick={() => handleNavigation('/perfis')}
            cursor="pointer"
            display="flex"
            alignItems="center"
            gap={2}
            px={3}
            py={2}
          >
            <FiUsers />
            Perfis
          </Link>
        </HStack>
      )}

      <HStack gap={4}>
        {/* Theme Toggle */}
        <ColorModeButton
          onClick={toggleColorMode}
          bg="secondary.gray.bg"
          color="secondary.gray.color"
          _hover={{
            bg: 'secondary.gray.bg.hover',
            color: 'secondary.gray.color.hover',
          }}
        />

        {isAuthenticated ? (
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button
                variant="ghost"
                p={3}
                bg="secondary.gray.bg"
                color="primary.gray.color"
                _hover={{
                  bg: 'secondary.gray.bg.hover',
                  color: 'primary.gray.color.hover',
                }}
                borderRadius="lg"
              >
                <HStack gap={2}>
                  <Avatar.Root size="sm">
                    <Avatar.Fallback
                      name={user?.name}
                      bg="secondary.purple.bg"
                      color="secondary.purple.color"
                    />
                    <Avatar.Image src="../../account.png" />
                  </Avatar.Root>
                  <Text
                    display={{ base: 'none', md: 'block' }}
                    color="primary.gray.color"
                    fontSize="sm"
                    fontWeight="medium"
                  >
                    {user?.name}
                  </Text>
                  <FiChevronDown size={14} />
                </HStack>
              </Button>
            </Menu.Trigger>

            <Menu.Positioner>
              <Menu.Content
                bg="primary.gray.bg"
                borderColor="secondary.gray.bg"
                boxShadow="lg"
              >
                <Menu.Item
                  value=""
                  onClick={() => handleView()}
                  color="primary.gray.color"
                  _hover={{
                    bg: 'secondary.gray.bg.hover',
                    color: 'secondary.purple.color.hover',
                  }}
                  _focus={{
                    bg: 'secondary.gray.bg.hover',
                    color: 'secondary.purple.color.hover',
                  }}
                  px={4}
                  py={2}
                  fontSize="sm"
                >
                  Meu Perfil
                </Menu.Item>

                <Menu.Separator borderColor="secondary.gray.bg" />

                <Menu.Item
                  value=""
                  onClick={handleLogout}
                  color="primary.gray.color"
                  _hover={{
                    bg: 'secondary.gray.bg.hover',
                    color: 'secondary.purple.color.hover',
                  }}
                  _focus={{
                    bg: 'secondary.gray.bg.hover',
                    color: 'secondary.purple.color.hover',
                  }}
                  px={4}
                  py={2}
                  fontSize="sm"
                >
                  Sair
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Menu.Root>
        ) : (
          <Button
            bg="primary.purple.bg"
            color="white"
            borderColor="primary.purple.bg"
            _hover={{
              bg: 'primary.purple.bg.hover',
              borderColor: 'primary.purple.bg.hover',
              transform: 'translateY(-1px)',
              boxShadow: 'md',
            }}
            onClick={() => handleNavigation('/login')}
            fontWeight="semibold"
            px={6}
            py={2}
            borderRadius="lg"
            transition="all 0.2s"
          >
            Entrar
          </Button>
        )}
      </HStack>
      {user && (
        <UserViewModal
          isOpen={viewModal.open}
          onClose={viewModal.onClose}
          user={user}
        />
      )}
    </Flex>
  );
}
