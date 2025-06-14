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
  Alert,
  Badge,
} from '@chakra-ui/react';
import { ProcProps } from '@/domain/interfaces/proc.interfaces';
import { useDeleteProc } from '@/services/delete/useDeleteProc';
import { useToast } from '@/hooks/useToast';
import { HiTrash, HiExclamationTriangle } from 'react-icons/hi2';
import { modalStyles } from '@/styles/modalStyles';
import { FaWindowClose } from 'react-icons/fa';
import { useColorMode } from '../../ui/color-mode';

interface ProcDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  proc: ProcProps;
  onSuccess: () => void;
}

export function ProcDeleteModal({
  isOpen,
  onClose,
  proc,
  onSuccess,
}: ProcDeleteModalProps) {
  const mutation = useDeleteProc();
  const toast = useToast();
  const theme = useColorMode();

  const handleDelete = async () => {
    toast.loading('Aguarde', 'Deletando processo...');
    mutation.mutate(proc.id, {
      onSuccess: () => {
        onSuccess();
      },
      onError: error => {
        console.log('Delete error:', error);
        toast.error('Erro de conexão com o servidor', 'Tente mais tarde.');
      },
      onSettled: () => {
        toast.dismiss();
        onClose();
      },
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      Aberto: 'blue',
      'Em Andamento': 'yellow',
      Pendente: 'orange',
      Concluído: 'green',
      Cancelado: 'red',
    };
    return colors[status as keyof typeof colors] || 'gray';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      Baixa: 'green',
      Média: 'yellow',
      Alta: 'red',
    };
    return colors[priority as keyof typeof colors] || 'gray';
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
            <HiTrash size={24} color="#dc2626" />
            <Heading size="lg" color="primary.error.color">
              Confirmar Exclusão
            </Heading>
          </HStack>
          <IconButton
            aria-label="Fechar modal"
            variant="ghost"
            size="sm"
            onClick={onClose}
            color="secondary.gray.color"
            _hover={{
              bg: 'secondary.gray.bg.hover',
              color: 'secondary.gray.color.hover',
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
            <Alert.Indicator color="primary.error.color" />
            <Alert.Title color="primary.error.color">
              Atenção! Esta ação não pode ser desfeita.
            </Alert.Title>
            <Alert.Description color="secondary.error.color">
              Você está prestes a excluir permanentemente este processo e todos
              os dados relacionados.
            </Alert.Description>
          </Alert.Root>

          {/* Informações do Processo */}
          <Box
            w="full"
            p={4}
            bg="secondary.gray.bg"
            borderRadius="md"
            borderWidth="1px"
            borderColor="secondary.gray.bg"
          >
            <VStack gap={3} align="stretch">
              <HStack justify="space-between" align="center">
                <Text fontWeight="semibold" color="primary.gray.color">
                  Processo #{proc.number}
                </Text>
                <HStack gap={2}>
                  <Badge
                    colorPalette={getStatusColor(proc.status)}
                    variant="surface"
                    size="sm"
                  >
                    {proc.status}
                  </Badge>
                  <Badge
                    colorPalette={getPriorityColor(proc.priority)}
                    variant="surface"
                    size="sm"
                  >
                    {proc.priority}
                  </Badge>
                </HStack>
              </HStack>

              <VStack gap={2} align="stretch">
                <HStack justify="space-between">
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color="primary.gray.color"
                  >
                    Requerente:
                  </Text>
                  <Text fontSize="sm" color="secondary.gray.color">
                    {proc.owner}
                  </Text>
                </HStack>

                <HStack justify="space-between">
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color="primary.gray.color"
                  >
                    Responsável:
                  </Text>
                  <Text fontSize="sm" color="secondary.gray.color">
                    {proc.user.name} ({proc.user.sigle})
                  </Text>
                </HStack>

                <VStack align="stretch" gap={1}>
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color="primary.gray.color"
                  >
                    Descrição:
                  </Text>
                  <Text
                    fontSize="sm"
                    color="secondary.gray.color"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {proc.description}
                  </Text>
                </VStack>
              </VStack>
            </VStack>
          </Box>

          {/* Aviso sobre eventos */}
          {proc.events && proc.events.length > 0 && (
            <Alert.Root
              status="warning"
              bg="secondary.yellow.bg"
              borderColor="primary.yellow.bg"
            >
              <Alert.Indicator color="primary.yellow.color" />
              <Alert.Title color="primary.yellow.color">
                <HStack gap={2}>
                  <HiExclamationTriangle size={16} />
                  <Text>Dados relacionados</Text>
                </HStack>
              </Alert.Title>
              <Alert.Description color="secondary.yellow.color">
                Este processo possui {proc.events.length} evento(s)
                registrado(s) que também serão excluídos.
              </Alert.Description>
            </Alert.Root>
          )}

          <Text textAlign="center" color="secondary.gray.color" fontSize="sm">
            Tem certeza de que deseja excluir este processo?
          </Text>

          <HStack gap={3} justify="center" w="full">
            <Button
              variant="outline"
              onClick={onClose}
              color="secondary.gray.color"
              borderColor="secondary.gray.bg"
              _hover={{
                bg: 'secondary.gray.bg.hover',
              }}
              minW="120px"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDelete}
              loading={mutation.isPending}
              bg="primary.error.bg"
              color="primary.error.color"
              _hover={{
                bg: 'primary.error.bg.hover',
              }}
              minW="120px"
            >
              Excluir Processo
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Modal>
  );
}
