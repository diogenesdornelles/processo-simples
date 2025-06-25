/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Modal from 'react-modal';
import {
  VStack,
  Input,
  Button,
  Text,
  HStack,
  Select,
  Textarea,
  Box,
  Heading,
  IconButton,
  Fieldset,
  Field,
  createListCollection,
  ListCollection,
  Spinner,
} from '@chakra-ui/react';
import { Formik, Form, Field as FormikField } from 'formik';
import * as Yup from 'yup';
import { useUpdateProc } from '@/services/put/useUpdateProc';
import { useGetAllUsers } from '@/services/get/useGetAllUsers';
import { UpdateProc, ProcProps } from '@/domain/interfaces/proc.interfaces';
import { ProcStatus } from '@/domain/types/ProcStatus';
import { ProcPriority } from '@/domain/types/ProcPriority';
import { useToast } from '@/hooks/useToast';
import {
  HiDocumentText,
  HiUser,
  HiCalendarDays,
  HiPencil,
} from 'react-icons/hi2';
import { FaWindowClose } from 'react-icons/fa';
import { modalStyles } from '@/styles/modalStyles';
import { useColorMode } from '../../ui/color-mode';
import { useEffect, useState } from 'react';
import { UserOptionItem } from './ProcCreateModal';

const statusOptions = createListCollection({
  items: [
    { label: 'Aberto', value: 'Aberto' },
    { label: 'Em Andamento', value: 'Em Andamento' },
    { label: 'Pendente', value: 'Pendente' },
    { label: 'Concluído', value: 'Concluído' },
    { label: 'Cancelado', value: 'Cancelado' },
  ],
});

const priorityOptions = createListCollection({
  items: [
    { label: 'Baixa', value: 'Baixa' },
    { label: 'Média', value: 'Média' },
    { label: 'Alta', value: 'Alta' },
  ],
});

const UpdateProcSchema = Yup.object().shape({
  user_id: Yup.number()
    .min(1, 'Selecione um usuário responsável')
    .required('Usuário responsável é obrigatório'),
  owner: Yup.string()
    .min(2, 'Requerente deve ter pelo menos 2 caracteres')
    .required('Requerente é obrigatório'),
  description: Yup.string()
    .min(10, 'Descrição deve ter pelo menos 10 caracteres')
    .required('Descrição é obrigatória'),
  status: Yup.string()
    .oneOf(
      ['Aberto', 'Em Andamento', 'Pendente', 'Concluído', 'Cancelado'],
      'Status inválido'
    )
    .required('Status é obrigatório'),
  priority: Yup.string()
    .oneOf(['Baixa', 'Média', 'Alta'], 'Prioridade inválida')
    .required('Prioridade é obrigatória'),
  term: Yup.string().required('Data limite é obrigatória'),
});

interface ProcEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  proc: ProcProps;
  onSuccess: () => void;
}

export function ProcEditModal({
  isOpen,
  onClose,
  proc,
  onSuccess,
}: ProcEditModalProps) {
  const mutationUpdateProc = useUpdateProc();
  const {
    data: usersData,
    isLoading: isLoadingUsers,
    isFetching: isFetchingUsers,
    isPending: isPendingUsers,
  } = useGetAllUsers();
  const toast = useToast();
  const theme = useColorMode();
  const [userOptionsList, setUserOptionsList] =
    useState<ListCollection<UserOptionItem> | null>(null);

  useEffect(() => {
    if (!usersData || isLoadingUsers || isFetchingUsers || isPendingUsers)
      return;
    if (!usersData || !Array.isArray(usersData)) return;
    const userOptions = createListCollection({
      items: usersData.map(user => ({
        label: `${user.name} (${user.sigle})`,
        value: user.id.toString(),
      })),
    });
    setUserOptionsList(userOptions);
  }, [usersData, isFetchingUsers, isLoadingUsers, isPendingUsers]);

  const handleSubmit = async (
    values: UpdateProc & {
      user_id: number;
      owner: string;
      description: string;
      status: ProcStatus;
      priority: ProcPriority;
      term: string;
    }
  ) => {
    await mutationUpdateProc.mutateAsync(
      {
        id: proc.id,
        proc: values,
      },
      {
        onError: (error: any) => {
          toast.show(
            'Erro ao atualizar processo',
            error?.response?.data?.message ||
              'Ocorreu um erro ao tentar atualizar o processo. Tente novamente mais tarde.',
            'error'
          );
        },
        onSuccess: () => {
          onSuccess();
        },
      }
    );
  };

  const formatDateForInput = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch {
      return '';
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
      closeTimeoutMS={100}
      preventScroll={true}
      shouldFocusAfterRender={true}
      shouldReturnFocusAfterClose={true}
    >
      <Box
        p={6}
        bg="primary.gray.bg"
        color="primary.gray.color"
        data-state={isOpen ? 'open' : 'closed'}
        _open={{
          animation: 'fade-in 300ms ease-out',
        }}
        _closed={{
          animation: 'fade-out 300ms ease-in',
        }}
      >
        <HStack justify="space-between" align="center" mb={6}>
          <HStack gap={2}>
            <HiPencil size={24} color="orange" />
            <Heading size="lg" color="primary.gray.color">
              Editar Processo #{proc.number}
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

        <Formik
          initialValues={{
            user_id: proc.user_id,
            owner: proc.owner,
            description: proc.description,
            status: proc.status,
            priority: proc.priority,
            term: formatDateForInput(proc.term),
          }}
          validationSchema={UpdateProcSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched, setFieldValue }) => (
            <Form>
              <VStack gap={5}>
                <Fieldset.Root>
                  <Fieldset.Legend>
                    <HStack gap={2}>
                      <HiDocumentText size={20} />
                      <Text fontWeight="semibold" color="primary.gray.color">
                        Informações do Processo
                      </Text>
                    </HStack>
                  </Fieldset.Legend>
                  <Fieldset.Content>
                    <VStack gap={4}>
                      {/* Usuário Responsável */}
                      {!isFetchingUsers &&
                        !isLoadingUsers &&
                        !isPendingUsers &&
                        userOptionsList &&
                        Array.isArray(userOptionsList) &&
                        userOptionsList.length > 0 && (
                          <FormikField name="user_id">
                            {({ field }: any) => (
                              <Field.Root
                                invalid={!!errors.user_id && !!touched.user_id}
                              >
                                <Field.Label>
                                  <HStack gap={2}>
                                    <HiUser size={16} />
                                    <Text color="primary.gray.color">
                                      Usuário Responsável
                                    </Text>
                                  </HStack>
                                </Field.Label>
                                <Select.Root
                                  collection={userOptionsList}
                                  value={[field.value]}
                                  onValueChange={details => {
                                    setFieldValue(
                                      'user_id',
                                      parseInt(details.value[0])
                                    );
                                  }}
                                >
                                  <Select.HiddenSelect />
                                  <Select.Control>
                                    <Select.Trigger
                                      bg="primary.gray.bg"
                                      color="primary.gray.color"
                                      borderColor="secondary.gray.bg"
                                      _hover={{
                                        borderColor: 'secondary.gray.bg.hover',
                                      }}
                                      _focus={{
                                        borderColor: 'primary.orange.bg',
                                      }}
                                    >
                                      <Select.ValueText placeholder="Selecione o usuário responsável" />
                                    </Select.Trigger>
                                  </Select.Control>
                                  <Select.Positioner>
                                    <Select.Content
                                      bg="primary.gray.bg"
                                      borderColor="secondary.gray.bg"
                                    >
                                      {userOptionsList.items.map(item => (
                                        <Select.Item
                                          key={item.value}
                                          item={item}
                                          color="primary.gray.color"
                                          _hover={{ bg: 'secondary.gray.bg' }}
                                        >
                                          <Select.ItemText>
                                            {item.label}
                                          </Select.ItemText>
                                          <Select.ItemIndicator />
                                        </Select.Item>
                                      ))}
                                    </Select.Content>
                                  </Select.Positioner>
                                </Select.Root>
                                <Field.ErrorText color="primary.error.color">
                                  {errors.user_id}
                                </Field.ErrorText>
                              </Field.Root>
                            )}
                          </FormikField>
                        )}

                      {/* Requerente */}
                      <FormikField name="owner">
                        {({ field }: any) => (
                          <Field.Root
                            invalid={!!errors.owner && !!touched.owner}
                          >
                            <Field.Label>Requerente</Field.Label>
                            <Input
                              {...field}
                              placeholder="Digite o nome do requerente"
                              bg="primary.gray.bg"
                              color="primary.gray.color"
                              borderColor="secondary.gray.bg"
                              _hover={{
                                borderColor: 'secondary.gray.bg.hover',
                              }}
                              _focus={{
                                borderColor: 'primary.orange.bg',
                              }}
                            />
                            <Field.ErrorText color="primary.error.color">
                              {errors.owner}
                            </Field.ErrorText>
                          </Field.Root>
                        )}
                      </FormikField>

                      {/* Descrição */}
                      <FormikField name="description">
                        {({ field }: any) => (
                          <Field.Root
                            invalid={
                              !!errors.description && !!touched.description
                            }
                          >
                            <Field.Label>Descrição</Field.Label>
                            <Textarea
                              {...field}
                              placeholder="Descreva detalhadamente o processo..."
                              bg="primary.gray.bg"
                              color="primary.gray.color"
                              borderColor="secondary.gray.bg"
                              _hover={{
                                borderColor: 'secondary.gray.bg.hover',
                              }}
                              _focus={{
                                borderColor: 'primary.orange.bg',
                              }}
                              rows={4}
                            />
                            <Field.ErrorText color="primary.error.color">
                              {errors.description}
                            </Field.ErrorText>
                          </Field.Root>
                        )}
                      </FormikField>
                    </VStack>
                  </Fieldset.Content>
                </Fieldset.Root>

                <Fieldset.Root>
                  <Fieldset.Legend>
                    <Text fontWeight="semibold" color="primary.gray.color">
                      Configurações do Processo
                    </Text>
                  </Fieldset.Legend>
                  <Fieldset.Content>
                    <VStack gap={4}>
                      <HStack gap={4} w="full">
                        {/* Status */}
                        <FormikField name="status">
                          {({ field }: any) => (
                            <Field.Root>
                              <Field.Label>Status</Field.Label>
                              <Select.Root
                                collection={statusOptions}
                                value={[field.value]}
                                onValueChange={details => {
                                  setFieldValue('status', details.value[0]);
                                }}
                              >
                                <Select.HiddenSelect />
                                <Select.Control>
                                  <Select.Trigger
                                    bg="primary.gray.bg"
                                    color="primary.gray.color"
                                    borderColor="secondary.gray.bg"
                                    _hover={{
                                      borderColor: 'secondary.gray.bg.hover',
                                    }}
                                    _focus={{
                                      borderColor: 'primary.orange.bg',
                                    }}
                                  >
                                    <Select.ValueText placeholder="Status" />
                                  </Select.Trigger>
                                </Select.Control>
                                <Select.Positioner>
                                  <Select.Content
                                    bg="primary.gray.bg"
                                    borderColor="secondary.gray.bg"
                                  >
                                    {statusOptions.items.map(item => (
                                      <Select.Item
                                        key={item.value}
                                        item={item}
                                        color="primary.gray.color"
                                        _hover={{ bg: 'secondary.gray.bg' }}
                                      >
                                        <Select.ItemText>
                                          {item.label}
                                        </Select.ItemText>
                                        <Select.ItemIndicator />
                                      </Select.Item>
                                    ))}
                                  </Select.Content>
                                </Select.Positioner>
                              </Select.Root>
                              <Field.ErrorText color="primary.error.color">
                                {errors.status}
                              </Field.ErrorText>
                            </Field.Root>
                          )}
                        </FormikField>

                        {/* Prioridade */}
                        <FormikField name="priority">
                          {({ field }: any) => (
                            <Field.Root>
                              <Field.Label>Prioridade</Field.Label>
                              <Select.Root
                                collection={priorityOptions}
                                value={[field.value]}
                                onValueChange={details => {
                                  setFieldValue('priority', details.value[0]);
                                }}
                              >
                                <Select.HiddenSelect />
                                <Select.Control>
                                  <Select.Trigger
                                    bg="primary.gray.bg"
                                    color="primary.gray.color"
                                    borderColor="secondary.gray.bg"
                                    _hover={{
                                      borderColor: 'secondary.gray.bg.hover',
                                    }}
                                    _focus={{
                                      borderColor: 'primary.orange.bg',
                                    }}
                                  >
                                    <Select.ValueText placeholder="Prioridade" />
                                  </Select.Trigger>
                                </Select.Control>
                                <Select.Positioner>
                                  <Select.Content
                                    bg="primary.gray.bg"
                                    borderColor="secondary.gray.bg"
                                  >
                                    {priorityOptions.items.map(item => (
                                      <Select.Item
                                        key={item.value}
                                        item={item}
                                        color="primary.gray.color"
                                        _hover={{ bg: 'secondary.gray.bg' }}
                                      >
                                        <Select.ItemText>
                                          {item.label}
                                        </Select.ItemText>
                                        <Select.ItemIndicator />
                                      </Select.Item>
                                    ))}
                                  </Select.Content>
                                </Select.Positioner>
                              </Select.Root>
                              <Field.ErrorText color="primary.error.color">
                                {errors.priority}
                              </Field.ErrorText>
                            </Field.Root>
                          )}
                        </FormikField>
                      </HStack>

                      {/* Data Limite */}
                      <FormikField name="term">
                        {({ field }: any) => (
                          <Field.Root invalid={!!errors.term && !!touched.term}>
                            <Field.Label>
                              <HStack gap={2}>
                                <HiCalendarDays size={16} />
                                <Text color="primary.gray.color">
                                  Data Limite
                                </Text>
                              </HStack>
                            </Field.Label>
                            <Input
                              {...field}
                              type="date"
                              bg="primary.gray.bg"
                              color="primary.gray.color"
                              borderColor="secondary.gray.bg"
                              _hover={{
                                borderColor: 'secondary.gray.bg.hover',
                              }}
                              _focus={{
                                borderColor: 'primary.orange.bg',
                              }}
                            />
                            <Field.ErrorText color="primary.error.color">
                              {errors.term}
                            </Field.ErrorText>
                          </Field.Root>
                        )}
                      </FormikField>
                    </VStack>
                  </Fieldset.Content>
                </Fieldset.Root>

                <HStack gap={3} justify="flex-end" w="full" pt={4}>
                  <Button
                    variant="outline"
                    onClick={onClose}
                    color="secondary.gray.color"
                    borderColor="secondary.gray.bg"
                    loading={
                      isSubmitting ||
                      mutationUpdateProc.isPending ||
                      isFetchingUsers ||
                      isLoadingUsers ||
                      isPendingUsers
                    }
                    disabled={
                      isSubmitting ||
                      mutationUpdateProc.isPending ||
                      isFetchingUsers ||
                      isLoadingUsers ||
                      isPendingUsers
                    }
                    _hover={{
                      bg: 'secondary.gray.bg.hover',
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    loading={
                      isSubmitting ||
                      mutationUpdateProc.isPending ||
                      isFetchingUsers ||
                      isLoadingUsers ||
                      isPendingUsers
                    }
                    disabled={
                      isSubmitting ||
                      mutationUpdateProc.isPending ||
                      isFetchingUsers ||
                      isLoadingUsers ||
                      isPendingUsers
                    }
                    bg="primary.orange.bg"
                    color="primary.orange.color"
                    _hover={{
                      bg: 'primary.orange.bg.hover',
                    }}
                  >
                    {!mutationUpdateProc.isPending ? (
                      'Atualizar Processo'
                    ) : (
                      <Spinner />
                    )}
                  </Button>
                </HStack>
              </VStack>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
}
