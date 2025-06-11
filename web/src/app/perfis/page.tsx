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
import { HiEye, HiPencil, HiTrash, HiPlus } from 'react-icons/hi2';
import { IoMdRefresh } from 'react-icons/io';
import { useState } from 'react';
import { withAuth } from '@/components/withAuth';
import { useGetAllUsers } from '@/services';
import { UserProps } from '@/domain/interfaces/user.interfaces';
import { useToast } from '@/hooks/useToast';

// Modais (vamos criar depois)
import { UserViewModal } from '@/components/modals/UserViewModal';
import { UserEditModal } from '@/components/modals/UserEditModal';
import { UserDeleteModal } from '@/components/modals/UserDeleteModal';
import { UserCreateModal } from '@/components/modals/UserCreateModal';
import { useAuth } from '@/contexts/AuthContext';

function PerfisPage() {
  const toast = useToast();
  const [selectedUser, setSelectedUser] = useState<UserProps | null>(null);
  const { user, isAuthenticated } = useAuth();

  // Estados dos modais
  const viewModal = useDisclosure();
  const editModal = useDisclosure();
  const deleteModal = useDisclosure();
  const createModal = useDisclosure();

  const { data: users, isFetching, refetch } = useGetAllUsers();

  // Funções para abrir modais
  const handleView = (userView: UserProps) => {
    if (user?.role === 'Admin' && isAuthenticated) {
      setSelectedUser(userView);
      viewModal.onOpen();
    } else {
      toast.error(
        'Acesso Negado',
        'Você não tem permissão para visualizar este usuário.'
      );
    }
  };

  const handleEdit = (userEdit: UserProps) => {
    if (user?.role === 'Admin' && isAuthenticated) {
      setSelectedUser(userEdit);
      editModal.onOpen();
    } else {
      toast.error(
        'Acesso Negado',
        'Você não tem permissão para visualizar este usuário.'
      );
    }
  };

  const handleDelete = (userDelete: UserProps) => {
    if (user?.role === 'Admin' && isAuthenticated) {
      setSelectedUser(userDelete);
      deleteModal.onOpen();
    } else {
      toast.error(
        'Acesso Negado',
        'Você não tem permissão para visualizar este usuário.'
      );
    }
  };

  const handleCreate = () => {
    if (user?.role === 'Admin' && isAuthenticated) {
      setSelectedUser(null);
      createModal.onOpen();
    }
  };

  const handleRefresh = async () => {
    try {
      toast.loading('Atualizando...', 'Buscando dados mais recentes.');
      await refetch();
      toast.dismiss();
      toast.success('Lista atualizada!', 'Dados atualizados com sucesso.');
    } catch (err) {
      console.error('Erro ao atualizar usuários:', err);
      toast.error('Erro ao atualizar', 'Não foi possível atualizar os dados.');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'red';
      case 'Manager':
        return 'orange';
      case 'User':
        return 'blue';
      default:
        return 'gray';
    }
  };

  return (
    <Container maxW="7xl" py={8}>
      <VStack gap={6} align="stretch">
        {/* Header */}
        <HStack justify="space-between" align="center">
          <VStack align="start" gap={1}>
            <Heading size="lg" color="gray.800">
              Gerenciar Usuários
            </Heading>
            <Text bg="text.bg" color="text.color">
              {users?.length || 0} usuários cadastrados
            </Text>
          </VStack>

          <HStack gap={3}>
            <Button
              variant="outline"
              onClick={handleRefresh}
              loading={isFetching}
            >
              <IoMdRefresh />
              Atualizar
            </Button>
            <Button colorScheme="blue" onClick={handleCreate}>
              <HiPlus />
              Novo Usuário
            </Button>
          </HStack>
        </HStack>

        {/* Tabela */}
        <Card.Root>
          <Card.Body p={0}>
            <Table.Root size="sm" variant="outline">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Usuário</Table.ColumnHeader>
                  <Table.ColumnHeader>E-mail</Table.ColumnHeader>
                  <Table.ColumnHeader>Perfil</Table.ColumnHeader>
                  <Table.ColumnHeader>Status</Table.ColumnHeader>
                  <Table.ColumnHeader>Criado em</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center">
                    Ações
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {users?.map((user: UserProps) => (
                  <Table.Row key={user.id}>
                    {/* Usuário */}
                    <Table.Cell>
                      <HStack gap={3}>
                        <Avatar.Root>
                          <Avatar.Fallback name={user?.name} />
                          <Avatar.Image src="https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/user-profile-icon.png" />
                        </Avatar.Root>
                        <VStack align="start" gap={0}>
                          <Text
                            fontWeight="semibold"
                            fontSize="sm"
                            bg="text.bg"
                            color="text.color"
                          >
                            {user.name}
                          </Text>
                          <Text fontSize="xs" bg="text.bg" color="text.color">
                            {user.sigle}
                          </Text>
                        </VStack>
                      </HStack>
                    </Table.Cell>

                    {/* E-mail */}
                    <Table.Cell>
                      <Text fontSize="sm" bg="text.bg" color="text.color">
                        {user.email}
                      </Text>
                    </Table.Cell>

                    {/* Perfil */}
                    <Table.Cell>
                      <Badge
                        colorScheme={getRoleBadgeColor(user.role)}
                        variant="subtle"
                        fontSize="xs"
                      >
                        {user.role}
                      </Badge>
                    </Table.Cell>

                    {/* Status */}
                    <Table.Cell>
                      <Badge
                        colorScheme={user.active ? 'green' : 'red'}
                        variant="subtle"
                        fontSize="xs"
                      >
                        {user.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </Table.Cell>

                    {/* Data de Criação */}
                    <Table.Cell>
                      <Text fontSize="sm" bg="text.bg" color="text.color">
                        {new Date(user.created_at).toLocaleDateString('pt-BR')}
                      </Text>
                    </Table.Cell>

                    {/* Ações */}
                    <Table.Cell textAlign="center">
                      <HStack gap={1} justify="center">
                        {/* Botão Ver */}
                        <IconButton
                          aria-label="Visualizar usuário"
                          size="sm"
                          variant="ghost"
                          colorScheme="blue"
                          onClick={() => handleView(user)}
                        >
                          <HiEye />
                        </IconButton>
                        {/* Botão Editar */}
                        <IconButton
                          aria-label="Editar usuário"
                          size="sm"
                          variant="ghost"
                          colorScheme="orange"
                          onClick={() => handleEdit(user)}
                        >
                          <HiPencil />
                        </IconButton>
                        {/* Botão Deletar */}
                        <IconButton
                          aria-label="Deletar usuário"
                          size="sm"
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => handleDelete(user)}
                        >
                          <HiTrash />
                        </IconButton>
                        {/* Menu de Ações (alternativo) */}
                      </HStack>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>

            {/* Empty State */}
            {users && users.length === 0 && (
              <Box textAlign="center" py={12}>
                <Text bg="text.bg" color="text.color" fontSize="lg">
                  Nenhum usuário encontrado
                </Text>
                <Button mt={4} colorScheme="blue" onClick={handleCreate}>
                  <HiPlus />
                  Criar Primeiro Usuário
                </Button>
              </Box>
            )}
          </Card.Body>
        </Card.Root>
      </VStack>

      {/* Modais */}
      {selectedUser && (
        <>
          <UserViewModal
            isOpen={viewModal.open}
            onClose={viewModal.onClose}
            user={selectedUser}
          />
          <UserEditModal
            isOpen={editModal.open}
            onClose={editModal.onClose}
            user={selectedUser}
            onSuccess={() => {
              refetch();
              editModal.onClose();
              toast.success('Sucesso!', 'Usuário atualizado');
            }}
          />
          <UserDeleteModal
            isOpen={deleteModal.open}
            onClose={deleteModal.onClose}
            user={selectedUser}
            onSuccess={() => {
              refetch();
              deleteModal.onClose();
              toast.success('Sucesso!', 'Usuário deletado');
            }}
          />
        </>
      )}

      <UserCreateModal
        isOpen={createModal.open}
        onClose={createModal.onClose}
        onSuccess={() => {
          refetch();
          createModal.onClose();
          toast.success('Sucesso!', 'Usuário criado');
        }}
      />
    </Container>
  );
}

export default withAuth(PerfisPage, {
  requireAdmin: false,
  redirectTo: '/login',
});
