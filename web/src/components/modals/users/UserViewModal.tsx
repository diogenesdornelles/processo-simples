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
import { useColorMode } from '../../ui/color-mode';
import img from '@/public/account.png';

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
        return 'primary.error.bg';
      case 'Comum':
        return 'primary.info.bg';
      default:
        return 'secondary.gray.bg';
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
      <Box
        p={6}
        bg="primary.gray.bg"
        color="primary.gray.color"
        borderRadius="12px"
      >
        <HStack justify="space-between" align="center" mb={6}>
          <HStack gap={2}>
            <HiEye size={24} color="#9333ea" />
            <Heading size="lg" color="primary.gray.color">
              Detalhes do Usuário
            </Heading>
          </HStack>
          <IconButton
            aria-label="Fechar modal"
            variant="ghost"
            size="sm"
            cursor="pointer"
            onClick={onClose}
            color="secondary.gray.color"
            _hover={{
              bg: 'secondary.gray.bg.hover',
              color: 'secondary.gray.color.hover',
            }}
          >
            <FaWindowClose size={20} />
          </IconButton>
        </HStack>

        <VStack gap={6} align="stretch">
          <HStack
            gap={4}
            p={4}
            borderRadius="lg"
            bg="secondary.gray.bg"
            border="1px"
            borderColor="secondary.gray.bg.hover"
          >
            <Avatar.Root size="lg">
              <Avatar.Fallback
                name={user?.name}
                bg="secondary.purple.bg"
                color="white"
              />
              <Avatar.Image src={img.src} />
            </Avatar.Root>
            <VStack align="start" gap={2} flex={1}>
              <Heading size="md" color="primary.gray.color">
                {user.name}
              </Heading>
              <HStack gap={2} wrap="wrap">
                <Badge
                  bg={getRoleBadgeColor(user.role)}
                  color="white"
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontSize="xs"
                  fontWeight="semibold"
                >
                  {getRoleText(user.role)}
                </Badge>
                <Badge
                  bg={user.active ? 'primary.success.bg' : 'primary.error.bg'}
                  color="white"
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontSize="xs"
                  fontWeight="semibold"
                >
                  {user.active ? 'Ativo' : 'Inativo'}
                </Badge>
              </HStack>
              <Text fontSize="sm" color="secondary.gray.color">
                Sigla:{' '}
                <Text as="span" fontWeight="bold" color="primary.purple.color">
                  {user.sigle}
                </Text>
              </Text>
            </VStack>
          </HStack>

          <Separator borderColor="secondary.gray.bg" />

          <Grid templateColumns="repeat(1, 1fr)" gap={4}>
            {/* E-mail */}
            <GridItem>
              <Box
                p={4}
                borderRadius="lg"
                borderLeft="4px"
                borderLeftColor="primary.info.bg"
                bg="secondary.gray.bg"
                _hover={{
                  bg: 'secondary.gray.bg.hover',
                  transition: 'all 0.2s',
                }}
              >
                <HStack gap={3}>
                  <AiOutlineMail size={20} color="#2563eb" />
                  <VStack align="start" gap={1}>
                    <Text
                      fontSize="sm"
                      color="secondary.gray.color"
                      fontWeight="semibold"
                    >
                      E-mail
                    </Text>
                    <Text fontWeight="medium" color="primary.gray.color">
                      {user.email}
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            </GridItem>

            <GridItem>
              <Box
                p={4}
                bg="secondary.gray.bg"
                borderRadius="lg"
                borderLeft="4px"
                borderLeftColor="primary.success.bg"
                _hover={{
                  bg: 'secondary.gray.bg.hover',
                  transition: 'all 0.2s',
                }}
              >
                <HStack gap={3}>
                  <HiIdentification size={20} color="#16a34a" />
                  <VStack align="start" gap={1}>
                    <Text
                      fontSize="sm"
                      color="secondary.gray.color"
                      fontWeight="semibold"
                    >
                      CPF
                    </Text>
                    <Text fontWeight="medium" color="primary.gray.color">
                      {user.cpf}
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            </GridItem>

            <GridItem>
              <Box
                p={4}
                bg="secondary.gray.bg"
                borderRadius="lg"
                borderLeft="4px"
                borderLeftColor="primary.purple.bg"
                _hover={{
                  bg: 'secondary.gray.bg.hover',
                  transition: 'all 0.2s',
                }}
              >
                <HStack gap={3}>
                  <HiCalendar size={20} color="#9333ea" />
                  <VStack align="start" gap={1}>
                    <Text
                      fontSize="sm"
                      color="secondary.gray.color"
                      fontWeight="semibold"
                    >
                      Criado em
                    </Text>
                    <Text
                      fontWeight="medium"
                      fontSize="sm"
                      color="primary.gray.color"
                    >
                      {formatDate(user.created_at)}
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            </GridItem>

            <GridItem>
              <Box
                p={4}
                bg="secondary.gray.bg"
                borderRadius="lg"
                borderLeft="4px"
                borderLeftColor="primary.attention.bg"
                _hover={{
                  bg: 'secondary.gray.bg.hover',
                  transition: 'all 0.2s',
                }}
              >
                <HStack gap={3}>
                  <HiCalendar size={20} color="#ea580c" />
                  <VStack align="start" gap={1}>
                    <Text
                      fontSize="sm"
                      color="secondary.gray.color"
                      fontWeight="semibold"
                    >
                      Última atualização
                    </Text>
                    <Text
                      fontWeight="medium"
                      fontSize="sm"
                      color="primary.gray.color"
                    >
                      {formatDate(user.updated_at)}
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            </GridItem>
          </Grid>

          <Box
            p={4}
            borderRadius="lg"
            bg="secondary.gray.bg"
            border="1px"
            borderColor="secondary.gray.bg.hover"
            textAlign="center"
          >
            <Text fontSize="sm" color="secondary.gray.color">
              ID do usuário:{' '}
              <Text as="span" fontWeight="bold" color="primary.purple.color">
                #{user.id}
              </Text>
            </Text>
          </Box>
        </VStack>
      </Box>
    </Modal>
  );
}
