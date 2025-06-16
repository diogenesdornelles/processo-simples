/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Container,
  VStack,
  Text,
  HStack,
  Box,
  Heading,
  Badge,
  Separator,
  Button,
  Card,
  Table,
  Avatar,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import { useGetProc } from '@/services/get/useGetProc';
import {
  HiDocumentText,
  HiUser,
  HiCalendarDays,
  HiClock,
  HiArrowLeft,
  HiTrash,
  HiEye,
  HiPaperClip,
  HiPlus,
} from 'react-icons/hi2';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';
import {
  getPriorityColor,
  getStatusColor,
  formatDate,
  sortEventsByDate,
} from '@/utils';
import { CustomBackdrop } from '@/components';
import img from '@/public/account.png';
import { useAlert } from '@/hooks/useAlert';
import { useEffect, useState } from 'react';
import { useDeleteEvent } from '@/services';
import { EventCreateModal } from '@/components/modals/events';
import { DocViewModal } from '@/components/modals/docs/DocViewModal';

interface ProcDetailsProps {
  procId: string;
}

export function ProcDetails({ procId }: ProcDetailsProps) {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const alert = useAlert();
  const { data: proc, isLoading, error, refetch } = useGetProc(Number(procId));
  const [selectedEventDocs, setSelectedEventDocs] = useState<any[]>([]);
  const [selectedEventName, setSelectedEventName] = useState<string>('');
  const [selectedEventIndex, setSelectedEventIndex] = useState<number>(0);
  const mutation = useDeleteEvent();

  const viewDocModal = useDisclosure();
  const createEventModal = useDisclosure();

  const handleDeleteEvent = (eventId: number) => {
    toast.show('Aguarde', 'Deletando processo...', 'loading');
    if (user?.role !== 'Admin') {
      toast.show(
        'Acesso Negado',
        'Apenas administradores podem deletar eventos.',
        'error'
      );
      return;
    }

    mutation.mutate(eventId, {
      onSuccess: () => {
        toast.show('Sucesso', 'Evento deletado.', 'success');
      },
      onError: error => {
        console.log('Delete error:', error);
        toast.show(
          'Erro de conexão com o servidor',
          'Tente mais tarde.',
          'error'
        );
      },
      onSettled: () => {
        toast.dismiss();
      },
    });
  };

  useEffect(() => {
    if (proc && proc.events.length > 0) {
      sortEventsByDate(proc.events);
    }
  }, [proc]);

  const handleViewDocuments = (
    eventIndex: number,
    docs: any[],
    eventName: string
  ) => {
    setSelectedEventDocs(docs);
    setSelectedEventName(eventName);
    setSelectedEventIndex(eventIndex);
    viewDocModal.onOpen();
  };

  return (
    <Container maxW="5xl" py={8} mb={100}>
      {isLoading && <CustomBackdrop isOpen />}
      {error &&
        alert.show(
          'Erro ao carregar processo',
          'Tente novamente mais tarde.',
          'error'
        )}
      {proc && !isLoading && (
        <VStack gap={6} align="stretch">
          {/* Header com botão voltar */}
          <HStack justify="space-between" align="center">
            <HStack gap={3}>
              <Button
                variant="ghost"
                onClick={() => router.back()}
                color="secondary.gray.text"
                _hover={{ bg: 'secondary.gray.bg.hover' }}
              >
                <HiArrowLeft />
                Voltar
              </Button>
              <Separator orientation="vertical" h="24px" />
              <HStack gap={2}>
                <HiDocumentText size={32} color="#16a34a" />
                <Heading size="lg" color="primary.gray.text">
                  Processo #{proc.number}
                </Heading>
              </HStack>
            </HStack>
          </HStack>

          <Card.Root bg="primary.gray.bg" borderColor="secondary.gray.bg">
            <Card.Body p={6}>
              <VStack gap={6} align="stretch">
                {/* Status e Prioridade */}
                <HStack justify="space-between" align="center">
                  <HStack gap={3}>
                    <Badge
                      bg={`${getStatusColor(proc.status)}`}
                      color="white"
                      variant="solid"
                      size="lg"
                      px={3}
                      py={1}
                      borderRadius="full"
                    >
                      {proc.status}
                    </Badge>
                    <Badge
                      bg={`${getPriorityColor(proc.priority)}`}
                      color="white"
                      variant="solid"
                      size="lg"
                      px={3}
                      py={1}
                      borderRadius="full"
                    >
                      Prioridade {proc.priority}
                    </Badge>
                  </HStack>
                  <Text fontSize="sm" color="secondary.gray.text">
                    {proc.active ? '✅ Ativo' : '❌ Inativo'}
                  </Text>
                </HStack>

                <Separator />

                {/* Informações Básicas */}
                <VStack gap={4} align="stretch">
                  <HStack gap={2}>
                    <HiDocumentText size={20} color="#2563eb" />
                    <Heading size="md" color="primary.gray.text">
                      Informações do Processo
                    </Heading>
                  </HStack>

                  <VStack gap={3} align="stretch" pl={6}>
                    <HStack justify="space-between">
                      <Text fontWeight="medium" color="primary.gray.text">
                        Número:
                      </Text>
                      <Text color="secondary.gray.text" fontWeight="semibold">
                        {proc.number}
                      </Text>
                    </HStack>

                    <HStack justify="space-between">
                      <Text fontWeight="medium" color="primary.gray.text">
                        Requerente:
                      </Text>
                      <Text color="secondary.gray.text">{proc.owner}</Text>
                    </HStack>

                    <VStack align="stretch" gap={2}>
                      <Text fontWeight="medium" color="primary.gray.text">
                        Descrição:
                      </Text>
                      <Box
                        p={4}
                        bg="secondary.gray.bg"
                        borderRadius="md"
                        borderWidth="1px"
                        borderColor="secondary.gray.bg"
                      >
                        <Text color="primary.gray.text" whiteSpace="pre-wrap">
                          {proc.description}
                        </Text>
                      </Box>
                    </VStack>
                  </VStack>
                </VStack>

                <Separator />

                {/* Responsável */}
                <VStack gap={4} align="stretch">
                  <HStack gap={2}>
                    <HiUser size={20} color="#9333ea" />
                    <Heading size="md" color="primary.gray.text">
                      Responsável
                    </Heading>
                  </HStack>

                  <HStack gap={3} pl={6}>
                    <Avatar.Root size="lg">
                      <Avatar.Fallback
                        name={proc.user.name}
                        bg="secondary.purple.bg"
                        color="white"
                      />
                      <Avatar.Image src={img.src} />
                    </Avatar.Root>
                    <VStack align="start" gap={1}>
                      <Text
                        fontWeight="medium"
                        fontSize="lg"
                        color="primary.gray.text"
                      >
                        {proc.user.name}
                      </Text>
                      <Text fontSize="md" color="secondary.gray.text">
                        {proc.user.email}
                      </Text>
                      <Badge
                        bg="purple.500"
                        color="white"
                        variant="solid"
                        size="md"
                        px={2}
                        py={1}
                        borderRadius="full"
                      >
                        {proc.user.sigle}
                      </Badge>
                    </VStack>
                  </HStack>
                </VStack>

                <Separator />

                {/* Datas */}
                <VStack gap={4} align="stretch">
                  <HStack gap={2}>
                    <HiCalendarDays size={20} color="#ea580c" />
                    <Heading size="md" color="primary.gray.text">
                      Prazos e Datas
                    </Heading>
                  </HStack>

                  <VStack gap={3} align="stretch" pl={6}>
                    <HStack justify="space-between">
                      <Text fontWeight="medium" color="primary.gray.text">
                        Data Limite:
                      </Text>
                      <Text
                        color={
                          new Date(proc.term) < new Date()
                            ? 'primary.error.text'
                            : 'secondary.gray.text'
                        }
                        fontSize="lg"
                        fontWeight={
                          new Date(proc.term) < new Date() ? 'bold' : 'normal'
                        }
                      >
                        {formatDate(proc.term)}
                        {new Date(proc.term) < new Date() && ' ⚠️'}
                      </Text>
                    </HStack>

                    <HStack justify="space-between">
                      <Text fontWeight="medium" color="primary.gray.text">
                        Criado em:
                      </Text>
                      <Text color="secondary.gray.text">
                        {formatDate(proc.created_at)}
                      </Text>
                    </HStack>

                    <HStack justify="space-between">
                      <Text fontWeight="medium" color="primary.gray.text">
                        Última atualização:
                      </Text>
                      <Text color="secondary.gray.text">
                        {formatDate(proc.updated_at)}
                      </Text>
                    </HStack>
                  </VStack>
                </VStack>

                {/* Eventos (se houver) */}
                {proc.events && proc.events.length > 0 && (
                  <>
                    <Separator />
                    <VStack gap={4} align="stretch">
                      <HStack gap={2} justify="space-between" align="center">
                        <HStack gap={2}>
                          <HiClock size={20} color="#eab308" />
                          <Heading size="md" color="primary.gray.text">
                            Histórico de Eventos ({proc.events.length})
                          </Heading>
                        </HStack>
                        {user?.role === 'Admin' && (
                          <Button
                            size="sm"
                            bg="secondary.purple.bg"
                            color="white"
                            _hover={{
                              bg: 'secondary.purple.bg.hover',
                            }}
                            onClick={() => createEventModal.onOpen()}
                          >
                            <HiPlus />
                            Novo Evento
                          </Button>
                        )}
                      </HStack>

                      {/* Tabela de eventos */}
                      <Card.Root
                        bg="primary.gray.bg"
                        borderColor="secondary.gray.bg"
                      >
                        <Card.Body p={0}>
                          <Table.Root size="sm" variant="outline">
                            <Table.Header bg="secondary.gray.bg">
                              <Table.Row>
                                <Table.ColumnHeader color="primary.gray.text">
                                  Número
                                </Table.ColumnHeader>
                                <Table.ColumnHeader color="primary.gray.text">
                                  Data/Hora
                                </Table.ColumnHeader>
                                <Table.ColumnHeader color="primary.gray.text">
                                  Nome do Evento
                                </Table.ColumnHeader>
                                <Table.ColumnHeader color="primary.gray.text">
                                  Responsável
                                </Table.ColumnHeader>
                                <Table.ColumnHeader color="primary.gray.text">
                                  Documentos
                                </Table.ColumnHeader>
                                <Table.ColumnHeader
                                  textAlign="center"
                                  color="primary.gray.text"
                                >
                                  Ações
                                </Table.ColumnHeader>
                              </Table.Row>
                            </Table.Header>

                            <Table.Body>
                              {proc.events.map((event, index) => (
                                <Table.Row
                                  key={event.id}
                                  _hover={{
                                    bg: 'secondary.gray.bg.hover',
                                  }}
                                >
                                  {/* Index */}
                                  <Table.Cell>
                                    <Text
                                      fontSize="sm"
                                      color="primary.gray.text"
                                      fontWeight="medium"
                                    >
                                      {proc.events.length - index}
                                    </Text>
                                  </Table.Cell>
                                  {/* Data/Hora */}
                                  <Table.Cell>
                                    <Text
                                      fontSize="sm"
                                      color="primary.gray.text"
                                      fontWeight="medium"
                                    >
                                      {formatDate(event.created_at.toString())}
                                    </Text>
                                  </Table.Cell>

                                  {/* Nome do Evento */}
                                  <Table.Cell>
                                    <Text
                                      fontSize="sm"
                                      color="primary.gray.text"
                                      fontWeight="semibold"
                                    >
                                      {event.name || 'Evento sem nome'}
                                    </Text>
                                  </Table.Cell>

                                  {/* Responsável */}
                                  <Table.Cell>
                                    <HStack gap={2}>
                                      <Avatar.Root size="sm">
                                        <Avatar.Fallback
                                          name={event.user?.name || 'Usuário'}
                                          bg="secondary.blue.bg"
                                          color="white"
                                        />
                                        <Avatar.Image src={img.src} />
                                      </Avatar.Root>
                                      <VStack align="start" gap={0}>
                                        <Text
                                          fontWeight="medium"
                                          fontSize="sm"
                                          color="primary.gray.text"
                                        >
                                          {event.user?.name || 'N/A'}
                                        </Text>
                                        <Text
                                          fontSize="xs"
                                          color="secondary.gray.text"
                                        >
                                          {event.user?.sigle || 'N/A'}
                                        </Text>
                                      </VStack>
                                    </HStack>
                                  </Table.Cell>

                                  {/* Documentos */}
                                  <Table.Cell>
                                    <HStack gap={2} align="center">
                                      <HiPaperClip size={16} color="#6b7280" />
                                      <Text
                                        fontSize="sm"
                                        color="secondary.gray.text"
                                      >
                                        {event.docs?.length || 0} doc(s)
                                      </Text>
                                      {(event.docs?.length || 0) > 0 && (
                                        <Badge
                                          bg="blue.500"
                                          color="white"
                                          variant="solid"
                                          size="sm"
                                          px={2}
                                          py={1}
                                          borderRadius="full"
                                        >
                                          {event.docs?.length}
                                        </Badge>
                                      )}
                                    </HStack>
                                  </Table.Cell>

                                  {/* Ações */}
                                  <Table.Cell textAlign="center">
                                    <HStack gap={1} justify="center">
                                      {/* Botão Ver Documentos */}
                                      <IconButton
                                        aria-label="Ver documentos"
                                        size="sm"
                                        title="Ver documentos"
                                        variant="ghost"
                                        color="primary.info.color"
                                        _hover={{
                                          bg: 'secondary.info.bg.hover',
                                          color: 'primary.info.text',
                                        }}
                                        onClick={() =>
                                          handleViewDocuments(
                                            index,
                                            event.docs || [],
                                            event.name || 'Evento sem nome'
                                          )
                                        }
                                      >
                                        <HiEye />
                                      </IconButton>

                                      {/* Botão Deletar - Apenas Admin */}
                                      {user?.role === 'Admin' && (
                                        <IconButton
                                          aria-label="Deletar evento"
                                          size="sm"
                                          variant="ghost"
                                          title="Deletar evento"
                                          color="primary.error.text"
                                          _hover={{
                                            bg: 'secondary.error.bg.hover',
                                            color: 'primary.error.text',
                                          }}
                                          onClick={() =>
                                            handleDeleteEvent(event.id)
                                          }
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
                        </Card.Body>
                      </Card.Root>
                    </VStack>
                  </>
                )}

                {/* Empty state para eventos */}
                {(!proc.events || proc.events.length === 0) && (
                  <>
                    <Separator />
                    <VStack gap={4} align="stretch">
                      <HStack gap={2} justify="space-between" align="center">
                        <HStack gap={2}>
                          <HiClock size={20} color="#eab308" />
                          <Heading size="md" color="primary.gray.text">
                            Histórico de Eventos
                          </Heading>
                        </HStack>
                        {user?.role === 'Admin' && (
                          <Button
                            size="sm"
                            bg="secondary.green.bg"
                            color="white"
                            _hover={{
                              bg: 'secondary.green.bg.hover',
                            }}
                            onClick={() => createEventModal.onOpen()}
                          >
                            <HiPlus />
                            Criar Primeiro Evento
                          </Button>
                        )}
                      </HStack>

                      <Box
                        textAlign="center"
                        py={8}
                        bg="secondary.gray.bg"
                        borderRadius="md"
                        borderWidth="1px"
                        borderColor="secondary.gray.bg"
                      >
                        <VStack gap={3}>
                          <HiClock size={32} color="#94a3b8" />
                          <Text
                            color="primary.gray.text"
                            fontSize="md"
                            fontWeight="semibold"
                          >
                            Nenhum evento registrado
                          </Text>
                          <Text color="secondary.gray.text" fontSize="sm">
                            Este processo ainda não possui eventos registrados.
                          </Text>
                        </VStack>
                      </Box>
                    </VStack>
                  </>
                )}
              </VStack>
            </Card.Body>
          </Card.Root>
        </VStack>
      )}

      {/* Modal de criação de evento */}
      {proc && (
        <EventCreateModal
          isCreationProc={false}
          isOpen={createEventModal.open}
          onClose={() => createEventModal.onClose()}
          procId={Number(procId)}
          onSuccess={() => {
            refetch();
            createEventModal.onClose();
            toast.show('Sucesso!', 'Evento deletado');
          }}
        />
      )}

      {/* Modal de visualização de documentos */}

      <DocViewModal
        isOpen={viewDocModal.open}
        onClose={() => viewDocModal.onClose()}
        docs={selectedEventDocs}
        eventIndex={selectedEventIndex}
        eventName={selectedEventName}
      />
    </Container>
  );
}
