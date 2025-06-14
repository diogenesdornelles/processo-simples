 'use client';

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
  Spinner,
  Alert,
  Avatar,
} from '@chakra-ui/react';
import { useGetProc } from '@/services/get/useGetProc';
import { HiDocumentText, HiUser, HiCalendarDays, HiClock, HiArrowLeft } from 'react-icons/hi2';
import { useRouter } from 'next/navigation';

interface ProcDetailsProps {
  proc_id: string;
}

export function ProcDetails({ proc_id }: ProcDetailsProps) {
  const router = useRouter();
  const { data: proc, isLoading, error } = useGetProc(Number(proc_id));

  const getStatusColor = (status: string) => {
    const colors = {
      'Aberto': 'blue',
      'Em Andamento': 'yellow',
      'Pendente': 'orange',
      'Concluído': 'green',
      'Cancelado': 'red',
    };
    return colors[status as keyof typeof colors] || 'gray';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'Baixa': 'green',
      'Média': 'yellow',
      'Alta': 'red',
    };
    return colors[priority as keyof typeof colors] || 'gray';
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return 'Data inválida';
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('pt-BR');
    } catch {
      return 'Data inválida';
    }
  };

  if (isLoading) {
    return (
      <Container maxW="5xl" py={8}>
        <VStack gap={4} align="center" justify="center" minH="400px">
          <Spinner size="xl" color="primary.purple.bg" />
          <Text color="secondary.gray.color">Carregando detalhes do processo...</Text>
        </VStack>
      </Container>
    );
  }

  if (error || !proc) {
    return (
      <Container maxW="5xl" py={8}>
        <VStack gap={6} align="stretch">
          <HStack gap={3}>
            <Button
              variant="ghost"
              onClick={() => router.back()}
              color="secondary.gray.color"
              _hover={{ bg: 'secondary.gray.bg.hover' }}
            >
              <HiArrowLeft />
              Voltar
            </Button>
          </HStack>
          
          <Alert.Root status="error">
            <Alert.Indicator />
            <Alert.Title>Erro ao carregar processo</Alert.Title>
            <Alert.Description>
              Não foi possível encontrar o processo solicitado.
            </Alert.Description>
          </Alert.Root>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="5xl" py={8}>
      <VStack gap={6} align="stretch">
        {/* Header com botão voltar */}
        <HStack justify="space-between" align="center">
          <HStack gap={3}>
            <Button
              variant="ghost"
              onClick={() => router.back()}
              color="secondary.gray.color"
              _hover={{ bg: 'secondary.gray.bg.hover' }}
            >
              <HiArrowLeft />
              Voltar
            </Button>
            <Separator orientation="vertical" h="24px" />
            <HStack gap={2}>
              <HiDocumentText size={32} color="green" />
              <Heading size="lg" color="primary.gray.color">
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
                    colorPalette={getStatusColor(proc.status)}
                    variant="surface"
                    size="lg"
                  >
                    {proc.status}
                  </Badge>
                  <Badge
                    colorPalette={getPriorityColor(proc.priority)}
                    variant="surface"
                    size="lg"
                  >
                    Prioridade {proc.priority}
                  </Badge>
                </HStack>
                <Text
                  fontSize="sm"
                  color="secondary.gray.color"
                >
                  {proc.active ? 'Ativo' : 'Inativo'}
                </Text>
              </HStack>

              <Separator />

              {/* Informações Básicas */}
              <VStack gap={4} align="stretch">
                <HStack gap={2}>
                  <HiDocumentText size={20} color="blue" />
                  <Heading size="md" color="primary.gray.color">
                    Informações do Processo
                  </Heading>
                </HStack>

                <VStack gap={3} align="stretch" pl={6}>
                  <HStack justify="space-between">
                    <Text fontWeight="medium" color="primary.gray.color">
                      Número:
                    </Text>
                    <Text color="secondary.gray.color">
                      {proc.number}
                    </Text>
                  </HStack>

                  <HStack justify="space-between">
                    <Text fontWeight="medium" color="primary.gray.color">
                      Requerente:
                    </Text>
                    <Text color="secondary.gray.color">
                      {proc.owner}
                    </Text>
                  </HStack>

                  <VStack align="stretch" gap={2}>
                    <Text fontWeight="medium" color="primary.gray.color">
                      Descrição:
                    </Text>
                    <Box
                      p={4}
                      bg="secondary.gray.bg"
                      borderRadius="md"
                      borderWidth="1px"
                      borderColor="secondary.gray.bg"
                    >
                      <Text color="primary.gray.color" whiteSpace="pre-wrap">
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
                  <HiUser size={20} color="purple" />
                  <Heading size="md" color="primary.gray.color">
                    Responsável
                  </Heading>
                </HStack>

                <HStack gap={3} pl={6}>
                  <Avatar.Root size="lg">
                    <Avatar.Fallback
                      name={proc.user.name}
                      bg="primary.purple.bg"
                      color="primary.purple.color"
                    />
                  </Avatar.Root>
                  <VStack align="start" gap={1}>
                    <Text fontWeight="medium" fontSize="lg" color="primary.gray.color">
                      {proc.user.name}
                    </Text>
                    <Text fontSize="md" color="secondary.gray.color">
                      {proc.user.email}
                    </Text>
                    <Badge
                      colorPalette="purple"
                      variant="subtle"
                      size="md"
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
                  <HiCalendarDays size={20} color="orange" />
                  <Heading size="md" color="primary.gray.color">
                    Prazos e Datas
                  </Heading>
                </HStack>

                <VStack gap={3} align="stretch" pl={6}>
                  <HStack justify="space-between">
                    <Text fontWeight="medium" color="primary.gray.color">
                      Data Limite:
                    </Text>
                    <Text color="secondary.gray.color" fontSize="lg">
                      {formatDate(proc.term)}
                    </Text>
                  </HStack>

                  <HStack justify="space-between">
                    <Text fontWeight="medium" color="primary.gray.color">
                      Criado em:
                    </Text>
                    <Text color="secondary.gray.color">
                      {formatDateTime(proc.created_at)}
                    </Text>
                  </HStack>

                  <HStack justify="space-between">
                    <Text fontWeight="medium" color="primary.gray.color">
                      Última atualização:
                    </Text>
                    <Text color="secondary.gray.color">
                      {formatDateTime(proc.updated_at)}
                    </Text>
                  </HStack>
                </VStack>
              </VStack>

              {/* Eventos (se houver) */}
              {proc.events && proc.events.length > 0 && (
                <>
                  <Separator />
                  <VStack gap={4} align="stretch">
                    <HStack gap={2}>
                      <HiClock size={20} color="yellow" />
                      <Heading size="md" color="primary.gray.color">
                        Histórico de Eventos ({proc.events.length})
                      </Heading>
                    </HStack>

                    <VStack gap={3} align="stretch" pl={6}>
                      {proc.events.map((event, index) => (
                        <Box
                          key={index}
                          p={4}
                          bg="secondary.gray.bg"
                          borderRadius="md"
                          borderWidth="1px"
                          borderColor="secondary.gray.bg"
                        >
                          <Text color="primary.gray.color">
                            <Text as="span" fontWeight="medium">
                              {formatDateTime(event.created_at.toString())}
                            </Text>
                            {' - '}
                            {event.name || 'Evento sem nome'}
                          </Text>
                        </Box>
                      ))}
                    </VStack>
                  </VStack>
                </>
              )}
            </VStack>
          </Card.Body>
        </Card.Root>
      </VStack>
    </Container>
  );
}