'use client';

import Modal from 'react-modal';
import {
  VStack,
  Text,
  Badge,
  HStack,
  Box,
  Heading,
  IconButton,
  Avatar,
  Separator,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { UserProps } from '@/domain/interfaces/user.interfaces';
import { HiEye, HiIdentification, HiCalendar } from 'react-icons/hi2';
import { FaWindowClose } from 'react-icons/fa';
import { AiOutlineMail } from 'react-icons/ai';
import { modalStyles } from '@/styles/modalStyles';
import { formatDate } from '@/utils/formatDate';
import { useColorMode } from '../ui/color-mode';

interface UserViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProps;
}

export function UserViewModal({ isOpen, onClose, user }: UserViewModalProps) {
  const theme = useColorMode();
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'red';
      case 'Comum':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'Administrador';
      case 'Comum':
        return 'Usuário';
      default:
        return role;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={modalStyles(theme.colorMode)}
      ariaHideApp={false}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
    >
      <Box p={6}>
        {/* Header */}
        <HStack justify="space-between" align="center" mb={6}>
          <HStack gap={2}>
            <HiEye size={24} color="icon.bg" />
            <Heading size="lg">Detalhes do Usuário</Heading>
          </HStack>
          <IconButton
            aria-label="Fechar modal"
            variant="ghost"
            size="sm"
            cursor={'pointer'}
            onClick={onClose}
          >
            <FaWindowClose size={30} />
          </IconButton>
        </HStack>

        <VStack gap={6} align="stretch">
          {/* Avatar e Info Principal */}
          <HStack gap={4} p={4} borderRadius="lg" bg="modalItem.bg">
            <Avatar.Root>
              <Avatar.Fallback name={user?.name} />
              <Avatar.Image src="https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/user-profile-icon.png" />
            </Avatar.Root>
            <VStack align="start" gap={2}>
              <Heading size="md">{user.name}</Heading>
              <HStack gap={2}>
                <Badge
                  colorScheme={getRoleBadgeColor(user.role)}
                  variant="solid"
                  px={3}
                  py={1}
                  borderRadius="full"
                >
                  {getRoleText(user.role)}
                </Badge>
                <Badge
                  colorScheme={user.active ? 'green' : 'red'}
                  variant="outline"
                  px={3}
                  py={1}
                  borderRadius="full"
                >
                  {user.active ? '✅ Ativo' : '❌ Inativo'}
                </Badge>
              </HStack>
              <Text fontSize="sm" bg="text.bg" color="text.color">
                Sigla:{' '}
                <Text
                  as="span"
                  fontWeight="bold"
                  bg="text.bg"
                  color="text.color"
                >
                  {user.sigle}
                </Text>
              </Text>
            </VStack>
          </HStack>

          <Separator />

          {/* Informações Detalhadas */}
          <Grid templateColumns="repeat(1, 1fr)" gap={4}>
            {/* E-mail */}
            <GridItem>
              <Box p={4} borderRadius="lg" borderLeft="4px" bg="modalItem.bg">
                <HStack gap={3}>
                  <AiOutlineMail size={20} color="blue" />
                  <VStack align="start" gap={1}>
                    <Text
                      fontSize="sm"
                      bg="text.bg"
                      color="text.color"
                      fontWeight="semibold"
                    >
                      E-mail
                    </Text>
                    <Text fontWeight="medium" bg="text.bg" color="text.color">
                      {user.email}
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            </GridItem>

            {/* CPF */}
            <GridItem>
              <Box
                p={4}
                bg="modalItem.bg"
                borderRadius="lg"
                borderLeft="4px"
                borderLeftColor="green.500"
              >
                <HStack gap={3}>
                  <HiIdentification size={20} color="green" />
                  <VStack align="start" gap={1}>
                    <Text
                      fontSize="sm"
                      bg="text.bg"
                      color="text.color"
                      fontWeight="semibold"
                    >
                      CPF
                    </Text>
                    <Text fontWeight="medium" bg="text.bg" color="text.color">
                      {user.cpf}
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            </GridItem>

            {/* Data de Criação */}
            <GridItem>
              <Box
                p={4}
                bg="modalItem.bg"
                borderRadius="lg"
                borderLeft="4px"
                borderLeftColor="purple.500"
              >
                <HStack gap={3}>
                  <HiCalendar size={20} color="purple" />
                  <VStack align="start" gap={1}>
                    <Text
                      fontSize="sm"
                      bg="text.bg"
                      color="text.color"
                      fontWeight="semibold"
                    >
                      Criado em
                    </Text>
                    <Text
                      fontWeight="medium"
                      fontSize="sm"
                      bg="text.bg"
                      color="text.color"
                    >
                      {formatDate(user.created_at)}
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            </GridItem>

            {/* Última Atualização */}
            <GridItem>
              <Box
                p={4}
                bg="modalItem.bg"
                borderRadius="lg"
                borderLeft="4px"
                borderLeftColor="orange.500"
              >
                <HStack gap={3}>
                  <HiCalendar size={20} color="orange" />
                  <VStack align="start" gap={1}>
                    <Text
                      fontSize="sm"
                      bg="text.bg"
                      color="text.color"
                      fontWeight="semibold"
                    >
                      Última atualização
                    </Text>
                    <Text
                      fontWeight="medium"
                      fontSize="sm"
                      bg="text.bg"
                      color="text.color"
                    >
                      {formatDate(user.updated_at)}
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            </GridItem>
          </Grid>

          {/* Estatísticas */}
          <Box p={4} borderRadius="lg" bg="modalItem.bg">
            <Text
              fontSize="sm"
              bg="text.bg"
              color="text.color"
              textAlign="center"
            >
              ID do usuário:{' '}
              <Text as="span" fontWeight="bold" bg="text.bg" color="text.color">
                #{user.id}
              </Text>
            </Text>
          </Box>
        </VStack>
      </Box>
    </Modal>
  );
}
