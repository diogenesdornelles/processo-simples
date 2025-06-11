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
import { HiTrash, HiExclamationTriangle } from 'react-icons/hi2';
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
      <Box p={6}>
        {/* Header */}
        <HStack justify="space-between" align="center" mb={6}>
          <HStack gap={2}>
            <HiTrash size={24} color="red" />
            <Heading size="lg" color="red.600">
              Confirmar Exclusão
            </Heading>
          </HStack>
          <IconButton
            aria-label="Fechar modal"
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <FaWindowClose />
          </IconButton>
        </HStack>

        <VStack gap={6}>
          {/* Alert de Aviso */}
          <Alert.Root status="error">
            <Alert.Indicator />
            <VStack align="start" gap={1}>
              <Alert.Title>⚠️ Atenção!</Alert.Title>
              <Alert.Description>
                Esta ação <strong>não pode ser desfeita</strong>. O usuário será
                removido permanentemente do sistema, incluindo todos os dados
                associados.
              </Alert.Description>
            </VStack>
          </Alert.Root>

          {/* Informações do Usuário */}
          <Box
            w="full"
            p={4}
            bg="modalItem.bg"
            borderRadius="lg"
            border="2px"
            borderColor="red.200"
          >
            <HStack gap={4}>
              <Avatar.Root>
                <Avatar.Fallback name={user?.name} />
                <Avatar.Image src="https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/user-profile-icon.png" />
              </Avatar.Root>
              <VStack align="start" gap={1}>
                <Text
                  fontWeight="bold"
                  fontSize="lg"
                  bg="text.bg"
                  color="text.color"
                >
                  {user.name}
                </Text>
                <Text fontSize="sm" bg="text.bg" color="text.color">
                  {user.email}
                </Text>
                <Text fontSize="sm" bg="text.bg" color="text.color">
                  <Text as="span" fontWeight="semibold">
                    Perfil:
                  </Text>{' '}
                  {user.role}
                </Text>
                <Text fontSize="sm" bg="text.bg" color="text.color">
                  <Text as="span" fontWeight="semibold">
                    Sigla:
                  </Text>{' '}
                  {user.sigle}
                </Text>
              </VStack>
            </HStack>
          </Box>

          {/* Pergunta de Confirmação */}
          <Box textAlign="center">
            <HStack justify="center" mb={2}>
              <HiExclamationTriangle size={24} color="red" />
              <Text
                fontSize="lg"
                fontWeight="bold"
                bg="text.bg"
                color="text.color"
              >
                Tem certeza que deseja excluir este usuário?
              </Text>
            </HStack>
            <Text fontSize="sm" bg="text.bg" color="text.color">
              Digite o nome do usuário para confirmar a exclusão:
            </Text>
          </Box>

          {/* Campo de Confirmação */}
          <Box w="full">
            <Text fontSize="sm" bg="text.bg" color="text.color" mb={2}>
              Nome esperado:{' '}
              <Text as="span" fontWeight="bold">
                {user.name}
              </Text>
            </Text>
            {/* Você pode adicionar um Input aqui se quiser confirmação por digitação */}
          </Box>

          {/* Botões de Ação */}
          <HStack gap={3} w="full" justify="center" pt={4}>
            <Button
              variant="outline"
              size="lg"
              onClick={onClose}
              disabled={deleteMutation.isPending}
              flex={1}
            >
              ❌ Cancelar
            </Button>
            <Button
              colorScheme="red"
              size="lg"
              onClick={handleDelete}
              loading={deleteMutation.isPending}
              loadingText="Excluindo..."
              flex={1}
            >
              🗑️ Confirmar Exclusão
            </Button>
          </HStack>

          {/* Aviso Final */}
          <Text
            fontSize="xs"
            bg="text.bg"
            color="text.color"
            textAlign="center"
          >
            Esta ação é irreversível e todos os dados do usuário serão perdidos.
          </Text>
        </VStack>
      </Box>
    </Modal>
  );
}
