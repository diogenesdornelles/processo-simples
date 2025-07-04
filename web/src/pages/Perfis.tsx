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
import { HiEye, HiPencil, HiTrash, HiPlus, HiUser } from 'react-icons/hi2';
import { IoMdRefresh } from 'react-icons/io';
import { useState } from 'react';
import { useGetAllUsers } from '@/services';
import { UserProps } from '@/domain/interfaces/user.interfaces';
import { useToast } from '@/hooks/useToast';

import { UserViewModal } from '@/components/modals/users/UserViewModal';
import { UserEditModal } from '@/components/modals/users/UserEditModal';
import { UserDeleteModal } from '@/components/modals/users/UserDeleteModal';
import { UserCreateModal } from '@/components/modals/users/UserCreateModal';
import { useAuth } from '@/contexts/AuthContext';
import img from '@/public/account.png';
import { getRoleColor } from '@/utils';
import { useAlert } from '@/hooks/useAlert';

export default function Perfis() {
  const toast = useToast();
  const alert = useAlert();
  const [selectedUser, setSelectedUser] = useState<UserProps | null>(null);
  const { user: authUser, isAuthenticated } = useAuth();

  const viewModal = useDisclosure();
  const editModal = useDisclosure();
  const deleteModal = useDisclosure();
  const createModal = useDisclosure();

  const {
    data: usersData,
    isFetching: isFetchingUsers,
    refetch: refetchUsers,
    isLoading: isLoadingUsers,
    isPending: isPendingUsers,
    error: usersError,
  } = useGetAllUsers();

  const handleView = (userView: UserProps) => {
    if (isAuthenticated) {
      setSelectedUser(userView);
      viewModal.onOpen();
    } else {
      toast.show(
        'Acesso Negado',
        'Você não tem permissão para visualizar este usuário.',
        'error'
      );
    }
  };

  const handleEdit = (userEdit: UserProps) => {
    if (isAuthenticated) {
      setSelectedUser(userEdit);
      editModal.onOpen();
    } else {
      toast.show(
        'Acesso Negado',
        'Você não tem permissão para visualizar este usuário.',
        'error'
      );
    }
  };

  const handleDelete = (userDelete: UserProps) => {
    if (isAuthenticated) {
      setSelectedUser(userDelete);
      deleteModal.onOpen();
    } else {
      toast.show(
        'Acesso Negado',
        'Você não tem permissão para visualizar este usuário.',
        'error'
      );
    }
  };

  const handleCreate = () => {
    if (isAuthenticated) {
      setSelectedUser(null);
      createModal.onOpen();
    } else {
      toast.show(
        'Acesso Negado',
        'Você não tem permissão para visualizar este usuário.',
        'error'
      );
    }
  };

  const handleRefresh = async () => {
    try {
      toast.show('Atualizando...', 'Buscando dados mais recentes.', 'loading');
      await refetchUsers();
      toast.dismiss();
      toast.show('Lista atualizada!', 'Dados atualizados com sucesso.');
    } catch (err) {
      console.error('Erro ao atualizar usuários:', err);
      toast.show(
        'Erro ao atualizar',
        'Não foi possível atualizar os dados.',
        'error'
      );
    }
  };

  return (
    <Container maxW="7xl" py={8}>
      {usersError &&
        alert.show(
          'Erro ao carregar perfil',
          'Tente novamente mais tarde.',
          'error'
        )}
      <VStack gap={6} align="stretch">
        <HStack justify="space-between" align="center">
          <VStack align="start" gap={1}>
            <HStack gap={2}>
              <HiUser size={32} color="#9333ea" />
              <Heading size="lg" color="primary.gray.text">
                Gerenciar Usuários
              </Heading>
            </HStack>
            <Text color="secondary.gray.text">
              {(usersData && usersData?.length) || 0} usuários cadastrados
            </Text>
          </VStack>

          <HStack gap={3}>
            <Button
              variant="outline"
              onClick={handleRefresh}
              loading={isFetchingUsers || isLoadingUsers || isPendingUsers}
            >
              <IoMdRefresh />
              Atualizar
            </Button>
            {authUser?.role === 'Admin' && (
              <Button
                colorScheme="blue"
                onClick={handleCreate}
                bg="primary.purple.bg"
                color={'white'}
              >
                <HiPlus />
                Novo Usuário
              </Button>
            )}
          </HStack>
        </HStack>

        <Card.Root bg="primary.gray.bg" borderColor="secondary.gray.bg">
          <Card.Body p={0}>
            <Table.Root size="sm" variant="outline">
              <Table.Header bg="primary.purple.bg">
                <Table.Row>
                  <Table.ColumnHeader color="white">Usuário</Table.ColumnHeader>
                  <Table.ColumnHeader color="white">E-mail</Table.ColumnHeader>
                  <Table.ColumnHeader color="white">Perfil</Table.ColumnHeader>
                  <Table.ColumnHeader color="white">Status</Table.ColumnHeader>
                  <Table.ColumnHeader color="white">
                    Criado em
                  </Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center" color="white">
                    Ações
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {!isFetchingUsers &&
                  !isLoadingUsers &&
                  !isPendingUsers &&
                  usersData &&
                  Array.isArray(usersData) &&
                  usersData.length > 0 &&
                  usersData.map((user: UserProps) => (
                    <Table.Row key={user.id}>
                      <Table.Cell>
                        <HStack gap={3}>
                          <Avatar.Root>
                            <Avatar.Fallback name={user?.name} />
                            <Avatar.Image src={img.src} />
                          </Avatar.Root>
                          <VStack align="start" gap={0}>
                            <Text
                              fontWeight="semibold"
                              fontSize="sm"
                              color="primary.purple.color"
                            >
                              {user.name}
                            </Text>
                            <Text fontSize="xs" color="primary.gray.color">
                              {user.sigle}
                            </Text>
                          </VStack>
                        </HStack>
                      </Table.Cell>
                      <Table.Cell>
                        <Text fontSize="sm" color="primary.gray.color">
                          {user.email}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge
                          colorScheme={getRoleColor(user.role)}
                          variant="subtle"
                          fontSize="xs"
                        >
                          {user.role}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge
                          colorScheme={user.active ? 'green' : 'red'}
                          variant="subtle"
                          fontSize="xs"
                        >
                          {user.active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Text fontSize="sm" color="primary.gray.color">
                          {new Date(user.created_at).toLocaleDateString(
                            'pt-BR'
                          )}
                        </Text>
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        <HStack gap={1} justify="center">
                          {/* Botão Ver */}
                          <IconButton
                            aria-label="Visualizar usuário"
                            title="Visualizar usuário"
                            size="sm"
                            variant="ghost"
                            colorScheme="blue"
                            onClick={() => handleView(user)}
                          >
                            <HiEye />
                          </IconButton>
                          {authUser?.role === 'Admin' && (
                            <IconButton
                              aria-label="Editar usuário"
                              title="Editar usuário"
                              size="sm"
                              variant="ghost"
                              colorScheme="orange"
                              onClick={() => handleEdit(user)}
                            >
                              <HiPencil />
                            </IconButton>
                          )}
                          {authUser?.role === 'Admin' && (
                            <IconButton
                              aria-label="Deletar usuário"
                              title="Deletar usuário"
                              size="sm"
                              variant="ghost"
                              colorScheme="red"
                              onClick={() => handleDelete(user)}
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
            {usersData && usersData.length === 0 && (
              <Box textAlign="center" py={12}>
                <Text color="primary.gray.color" fontSize="lg">
                  Nenhum usuário encontrado
                </Text>
                {authUser?.role === 'Admin' && (
                  <Button mt={4} colorScheme="blue" onClick={handleCreate}>
                    <HiPlus />
                    Criar Primeiro Usuário
                  </Button>
                )}
              </Box>
            )}
          </Card.Body>
        </Card.Root>
      </VStack>
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
            onSuccess={async () => {
              toast.show('Usuário atualizado com sucesso', '', 'success');
              editModal.onClose();
              await refetchUsers();
            }}
          />
          <UserDeleteModal
            isOpen={deleteModal.open}
            onClose={deleteModal.onClose}
            user={selectedUser}
            onSuccess={async () => {
              toast.show('Usuário deletado com sucesso', '', 'success');
              deleteModal.onClose();
              await refetchUsers();
            }}
          />
        </>
      )}

      <UserCreateModal
        isOpen={createModal.open}
        onClose={createModal.onClose}
        onSuccess={async () => {
          toast.show('Usuário criado com sucesso', '', 'success');
          createModal.onClose();
          await refetchUsers();
        }}
      />
    </Container>
  );
}
