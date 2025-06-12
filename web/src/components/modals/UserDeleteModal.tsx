/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Modal from 'react-modal';
import {
  VStack,
  Text,
  Button,
  HStack,
  Box,
  Heading,
  IconButton,
  Avatar,
  Alert,
} from '@chakra-ui/react';
import { UserProps } from '@/domain/interfaces/user.interfaces';
import { useDeleteUser } from '@/services';
import { useToast } from '@/hooks/useToast';
import { HiTrash, HiExclamationTriangle, HiXCircle } from 'react-icons/hi2';
import { modalStyles } from '@/styles/modalStyles';
import { FaWindowClose } from 'react-icons/fa';
import { useColorMode } from '../ui/color-mode';

interface UserDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProps;
  onSuccess: () => void;
}

export function UserDeleteModal({
  isOpen,
  onClose,
  user,
  onSuccess,
}: UserDeleteModalProps) {
  const deleteMutation = useDeleteUser();
  const toast = useToast();
  const theme = useColorMode();

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(user.id);
      toast.success('Sucesso', 'Usuário deletado');
      onSuccess();
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      const errorMessage =
        (typeof error === 'object' &&
          error !== null &&
          'response' in error &&
          (error as any).response?.data?.message) ||
        'Erro ao deletar usuário';
      toast.error('Erro', errorMessage);
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
        color="primary.gray.text"
        borderRadius="12px"
      >
        <HStack justify="space-between" align="center" mb={6}>
          <HStack gap={2}>
            <HiTrash size={24} color="#dc2626" />
            <Heading size="lg" color="primary.error.text">
              Confirmar Exclusão
            </Heading>
          </HStack>
          <IconButton
            aria-label="Fechar modal"
            variant="ghost"
            size="sm"
            onClick={onClose}
            color="secondary.gray.text"
            _hover={{
              bg: 'secondary.gray.bg.hover',
              color: 'secondary.gray.text.hover',
            }}
          >
            <FaWindowClose />
          </IconButton>
        </HStack>

        <VStack gap={6}>
          <Alert.Root
            status="error"
            bg="secondary.error.bg"
            borderColor="primary.error.bg"
          >
            <Alert.Indicator color="primary.error.text" />
            <VStack align="start" gap={1}>
              <Alert.Title color="primary.error.text">⚠️ Atenção!</Alert.Title>
              <Alert.Description color="primary.error.text">
                Esta ação <strong>não pode ser desfeita</strong>. O usuário será
                removido permanentemente do sistema, incluindo todos os dados
                associados.
              </Alert.Description>
            </VStack>
          </Alert.Root>
          <Box
            w="full"
            p={4}
            bg="secondary.gray.bg"
            borderRadius="lg"
            border="2px"
            borderColor="primary.error.bg"
          >
            <HStack gap={4}>
              <Avatar.Root>
                <Avatar.Fallback
                  name={user?.name}
                  bg="secondary.error.bg"
                  color="white"
                />
                <Avatar.Image src="../../public/account.png" />
              </Avatar.Root>
              <VStack align="start" gap={1}>
                <Text fontWeight="bold" fontSize="lg" color="primary.gray.text">
                  {user.name}
                </Text>
                <Text fontSize="sm" color="secondary.gray.text">
                  {user.email}
                </Text>
                <Text fontSize="sm" color="secondary.gray.text">
                  <Text
                    as="span"
                    fontWeight="semibold"
                    color="primary.gray.text"
                  >
                    Perfil:
                  </Text>{' '}
                  {user.role}
                </Text>
                <Text fontSize="sm" color="secondary.gray.text">
                  <Text
                    as="span"
                    fontWeight="semibold"
                    color="primary.gray.text"
                  >
                    Sigla:
                  </Text>{' '}
                  {user.sigle}
                </Text>
              </VStack>
            </HStack>
          </Box>
          <Box textAlign="center">
            <HStack justify="center" mb={2}>
              <HiExclamationTriangle size={24} color="#dc2626" />{' '}
              {/* Vermelho */}
              <Text fontSize="lg" fontWeight="bold" color="primary.error.text">
                Tem certeza que deseja excluir este usuário?
              </Text>
            </HStack>
            <Text fontSize="sm" color="secondary.gray.text">
              Esta ação removerá permanentemente todos os dados do usuário.
            </Text>
          </Box>
          <Box
            w="full"
            p={3}
            bg="secondary.error.bg"
            borderRadius="md"
            border="1px"
            borderColor="primary.error.bg"
          >
            <Text
              fontSize="sm"
              color="primary.error.text"
              textAlign="center"
              fontWeight="medium"
            >
              Usuário a ser excluído:{' '}
              <Text as="span" fontWeight="bold" color="primary.error.text">
                {user.name}
              </Text>
            </Text>
          </Box>
          <HStack
            gap={3}
            w="full"
            justify="center"
            pt={4}
            borderTop="1px"
            borderColor="secondary.gray.bg"
          >
            <Button
              variant="ghost"
              size="lg"
              onClick={onClose}
              disabled={deleteMutation.isPending}
              flex={1}
              color="secondary.gray.text"
              _hover={{
                bg: 'secondary.gray.bg.hover',
                color: 'secondary.gray.text.hover',
              }}
            >
              Cancelar
              <HiXCircle/>
            </Button>
            <Button
              bg="primary.error.bg"
              color="white"
              size="lg"
              onClick={handleDelete}
              loading={deleteMutation.isPending}
              loadingText="Excluindo..."
              flex={1}
              _hover={{
                bg: 'primary.error.bg.hover',
              }}
              _disabled={{
                bg: 'secondary.gray.bg',
                color: 'secondary.gray.text',
              }}
            >
              Confirmar Exclusão
              <HiTrash/>
            </Button>
          </HStack>
          <Alert.Root
            status="warning"
            variant="subtle"
            bg="secondary.warning.bg"
            borderColor="primary.warning.bg"
          >
            <Alert.Indicator color="primary.warning.text" />
            <Alert.Description>
              <Text
                fontSize="xs"
                color="primary.warning.text"
                textAlign="center"
              >
                Esta ação é irreversível e todos os dados do usuário serão
                perdidos.
              </Text>
            </Alert.Description>
          </Alert.Root>
        </VStack>
      </Box>
    </Modal>
  );
}
