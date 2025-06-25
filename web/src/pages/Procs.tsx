'use client';

import {
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Table,
  Badge,
  IconButton,
  Box,
  Card,
  Avatar,
  useDisclosure,
} from '@chakra-ui/react';
import {
  HiEye,
  HiPencil,
  HiTrash,
  HiPlus,
  HiDocumentText,
} from 'react-icons/hi2';
import { IoMdRefresh } from 'react-icons/io';
import { useState } from 'react';
import { useGetAllProcs } from '@/services/get/useGetAllProcs';
import { ProcProps } from '@/domain/interfaces/proc.interfaces';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/contexts/AuthContext';
import {
  ProcEditModal,
  EventCreateModal,
  ProcDeleteModal,
  ProcCreateModal,
} from '@/components';
import { useRouter } from 'next/navigation';
import {
  getStatusColor,
  getPriorityColor,
  formatDate,
  isExpired,
} from '@/utils';
import { useAlert } from '@/hooks/useAlert';
import img from '@/public/account.png';
import { sleep } from '@/utils/sleep';

export default function Procs() {
  const toast = useToast();
  const alert = useAlert();
  const [selectedProc, setSelectedProc] = useState<ProcProps | null>(null);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [newProcId, setNewProcId] = useState<number | null>(null);

  const editProcModal = useDisclosure();
  const deleteProcModal = useDisclosure();
  const createProcModal = useDisclosure();
  const createEventModal = useDisclosure();

  const {
    data: procsData,
    isFetching: isFetchingProcs,
    isPending: isPendingProcs,
    isLoading: isLoadingProcs,
    refetch: refetchProcs,
    error: procsError,
  } = useGetAllProcs();

  const handleView = (proc: ProcProps) => {
    if (isAuthenticated) {
      setSelectedProc(proc);
      router.push(`/processos/${proc.id}`);
    } else {
      toast.show(
        'Acesso Negado',
        'Você precisa estar logado para visualizar processos.',
        'error'
      );
    }
  };

  const handleEdit = (proc: ProcProps) => {
    if (isAuthenticated) {
      setSelectedProc(proc);
      editProcModal.onOpen();
    } else {
      toast.show(
        'Acesso Negado',
        'Você não tem permissão para editar este processo.',
        'error'
      );
    }
  };

  const handleDelete = (proc: ProcProps) => {
    if (isAuthenticated) {
      setSelectedProc(proc);
      deleteProcModal.onOpen();
    } else {
      toast.show(
        'Acesso Negado',
        'Você não tem permissão para deletar este processo.',
        'error'
      );
    }
  };

  const handleCreate = () => {
    if (isAuthenticated) {
      setSelectedProc(null);
      createProcModal.onOpen();
    } else {
      toast.show(
        'Acesso Negado',
        'Você não tem permissão para criar processos.',
        'error'
      );
    }
  };

  const handleRefresh = async () => {
    try {
      toast.show('Atualizando...', 'Buscando dados mais recentes.', 'loading');
      await refetchProcs();
      toast.dismiss();
      toast.show('Lista atualizada!', 'Dados atualizados com sucesso.');
    } catch (err) {
      console.error('Erro ao atualizar processos:', err);
      toast.show(
        'Erro ao atualizar',
        'Não foi possível atualizar os dados.',
        'error'
      );
    }
  };

  return (
    <Container maxW="7xl" py={8}>
      {procsError &&
        alert.show(
          'Erro ao carregar processos',
          'Tente novamente mais tarde.',
          'error'
        )}
      <VStack gap={6} align="stretch">
        {/* Header */}
        <HStack justify="space-between" align="center">
          <VStack align="start" gap={1}>
            <HStack gap={2}>
              <HiDocumentText size={32} color="#9333ea" />
              <Heading size="lg" color="primary.gray.text">
                Gerenciar Processos
              </Heading>
            </HStack>
            <Text color="secondary.gray.text">
              {(procsData && procsData.length) || 0} processos cadastrados
            </Text>
          </VStack>

          <HStack gap={3}>
            <Button
              variant="outline"
              onClick={handleRefresh}
              loading={isFetchingProcs || isPendingProcs || isLoadingProcs}
              color="secondary.gray.text"
              borderColor="secondary.gray.bg"
              _hover={{
                bg: 'secondary.gray.bg.hover',
                borderColor: 'secondary.gray.bg.hover',
              }}
            >
              <IoMdRefresh />
              Atualizar
            </Button>

            <Button
              bg="primary.purple.bg"
              color="white"
              onClick={handleCreate}
              _hover={{
                bg: 'primary.purple.bg.hover',
              }}
            >
              <HiPlus />
              Novo Processo
            </Button>
          </HStack>
        </HStack>

        {/* Tabela */}
        <Card.Root bg="primary.gray.bg" borderColor="secondary.gray.bg">
          <Card.Body p={0}>
            <Table.Root size="sm" variant="outline">
              <Table.Header bg="primary.purple.bg">
                <Table.Row>
                  <Table.ColumnHeader color="white">
                    Processo
                  </Table.ColumnHeader>
                  <Table.ColumnHeader color="white">
                    Responsável
                  </Table.ColumnHeader>
                  <Table.ColumnHeader color="white">Status</Table.ColumnHeader>
                  <Table.ColumnHeader color="white">
                    Prioridade
                  </Table.ColumnHeader>
                  <Table.ColumnHeader color="white">Prazo</Table.ColumnHeader>
                  <Table.ColumnHeader color="white">
                    Criado em
                  </Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center" color="white">
                    Ações
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {!isFetchingProcs &&
                  !isPendingProcs &&
                  !isLoadingProcs &&
                  procsData &&
                  Array.isArray(procsData) &&
                  procsData.length > 0 &&
                  procsData.map((proc: ProcProps) => (
                    <Table.Row
                      key={proc.id}
                      _hover={{
                        bg: 'secondary.gray.bg.hover',
                      }}
                    >
                      {/* Processo */}
                      <Table.Cell>
                        <VStack align="start" gap={1}>
                          <Text
                            fontWeight="semibold"
                            fontSize="sm"
                            color="primary.purple.color"
                          >
                            #{proc.number}
                          </Text>
                          <Text
                            fontSize="xs"
                            color="secondary.gray.color"
                            maxW="200px"
                          >
                            {proc.description}
                          </Text>
                        </VStack>
                      </Table.Cell>

                      {/* Responsável */}
                      <Table.Cell>
                        <HStack gap={2}>
                          <Avatar.Root size="sm">
                            <Avatar.Fallback
                              name={proc.user?.name}
                              bg="secondary.purple.bg"
                              color="white"
                            />
                            <Avatar.Image src={img.src} />
                          </Avatar.Root>
                          <VStack align="start" gap={0}>
                            <Text
                              fontWeight="medium"
                              fontSize="sm"
                              color="primary.gray.color"
                            >
                              {proc.user?.name}
                            </Text>
                            <Text fontSize="xs" color="secondary.gray.color">
                              {proc.user?.sigle}
                            </Text>
                          </VStack>
                        </HStack>
                      </Table.Cell>

                      {/* Status */}
                      <Table.Cell>
                        <Badge
                          bg={`${getStatusColor(proc.status)}`}
                          color="white"
                          variant="solid"
                          fontSize="xs"
                          px={2}
                          py={1}
                          borderRadius="full"
                        >
                          {proc.status}
                        </Badge>
                      </Table.Cell>

                      {/* Prioridade */}
                      <Table.Cell>
                        <HStack gap={1}>
                          <Badge
                            bg={`${getPriorityColor(proc.priority)}`}
                            color="white"
                            variant="solid"
                            fontSize="xs"
                            px={2}
                            py={1}
                            borderRadius="full"
                          >
                            {proc.priority}
                          </Badge>
                        </HStack>
                      </Table.Cell>

                      {/* Prazo */}
                      <Table.Cell>
                        <VStack align="start" gap={0}>
                          <Text
                            fontSize="sm"
                            color={
                              isExpired(proc.term)
                                ? 'primary.error.color'
                                : 'primary.gray.color'
                            }
                            fontWeight={
                              isExpired(proc.term) ? 'bold' : 'normal'
                            }
                          >
                            {formatDate(proc.term)}
                          </Text>
                          {isExpired(proc.term) && (
                            <Text
                              fontSize="xs"
                              color="primary.error.text"
                              fontWeight="semibold"
                            >
                              ⚠️ Vencido
                            </Text>
                          )}
                        </VStack>
                      </Table.Cell>

                      {/* Criado em */}
                      <Table.Cell>
                        <Text fontSize="sm" color="secondary.gray.text">
                          {formatDate(proc.created_at)}
                        </Text>
                      </Table.Cell>

                      {/* Ações */}
                      <Table.Cell textAlign="center">
                        <HStack gap={1} justify="center">
                          {/* Botão Ver - Qualquer usuário logado */}
                          <IconButton
                            aria-label="Visualizar processo"
                            size="sm"
                            variant="ghost"
                            title="Visualizar processo"
                            color="primary.info.text"
                            _hover={{
                              bg: 'secondary.info.bg.hover',
                              color: 'primary.info.color',
                            }}
                            onClick={() => handleView(proc)}
                          >
                            <HiEye />
                          </IconButton>

                          {/* Botão Editar - Apenas Admin */}
                          {user?.role === 'Admin' && (
                            <IconButton
                              aria-label="Editar processo"
                              size="sm"
                              variant="ghost"
                              title="Editar processo"
                              color="primary.attention.text"
                              _hover={{
                                bg: 'secondary.attention.bg.hover',
                                color: 'primary.attention.color',
                              }}
                              onClick={() => handleEdit(proc)}
                            >
                              <HiPencil />
                            </IconButton>
                          )}

                          {/* Botão Deletar - Apenas Admin */}
                          {user?.role === 'Admin' && (
                            <IconButton
                              aria-label="Deletar processo"
                              size="sm"
                              title="Deletar processo"
                              variant="ghost"
                              color="primary.error.text"
                              _hover={{
                                bg: 'secondary.error.bg.hover',
                                color: 'primary.error.color',
                              }}
                              onClick={() => handleDelete(proc)}
                            >
                              <HiTrash />
                            </IconButton>
                          )}
                        </HStack>
                      </Table.Cell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table.Root>

            {/* Empty State */}
            {procsData && procsData.length === 0 && (
              <Box textAlign="center" py={12} bg="primary.gray.bg">
                <VStack gap={4}>
                  <HiDocumentText size={48} color="#94a3b8" />
                  <VStack gap={2}>
                    <Text
                      color="primary.gray.color"
                      fontSize="lg"
                      fontWeight="semibold"
                    >
                      Nenhum processo encontrado
                    </Text>
                    <Text color="secondary.gray.color" fontSize="sm">
                      Comece criando seu primeiro processo
                    </Text>
                  </VStack>

                  <Button
                    bg="primary.purple.bg"
                    color="white"
                    onClick={handleCreate}
                    _hover={{
                      bg: 'primary.purple.bg.hover',
                    }}
                  >
                    <HiPlus />
                    Criar Primeiro Processo
                  </Button>
                </VStack>
              </Box>
            )}
          </Card.Body>
        </Card.Root>
      </VStack>

      {/* Modais */}
      {selectedProc && (
        <>
          <ProcEditModal
            isOpen={editProcModal.open}
            onClose={editProcModal.onClose}
            proc={selectedProc}
            onSuccess={async () => {
              toast.show('Processo atualizado com sucesso', '', 'success');
              editProcModal.onClose();
              await refetchProcs();
            }}
          />
          <ProcDeleteModal
            isOpen={deleteProcModal.open}
            onClose={deleteProcModal.onClose}
            proc={selectedProc}
            onSuccess={async () => {
              toast.show('Processo deletado com sucesso', '', 'success');
              deleteProcModal.onClose();
              await refetchProcs();
            }}
          />
        </>
      )}
      {/* Modal de criação do processo*/}
      <ProcCreateModal
        isOpen={createProcModal.open}
        onClose={createProcModal.onClose}
        onSuccess={async (procId: number) => {
          try {
            setNewProcId(procId);
            toast.show(
              'Processo criado com sucesso',
              'Adicione um evento para validá-lo',
              'success'
            );
            await sleep(1500);
            createEventModal.onOpen();
          } finally {
            createProcModal.onClose();
          }
        }}
      />

      {/* Modal de criação de evento inicial */}
      {newProcId && (
        <EventCreateModal
          isCreationProc={true}
          isOpen={createEventModal.open}
          onClose={() => createEventModal.onClose()}
          procId={newProcId}
          onSuccess={async () => {
            toast.show(
              'Evento criado com sucesso',
              '',
              'success'
            );
            createEventModal.onClose();
            setNewProcId(null);
            await refetchProcs();
          }}
        />
      )}
    </Container>
  );
}
