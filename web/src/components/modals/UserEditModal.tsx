/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Modal from 'react-modal';
import {
  VStack,
  Input,
  Button,
  Text,
  HStack,
  Alert,
  Box,
  Heading,
  IconButton,
  Fieldset,
  Field,
  Select,
  Portal,
  createListCollection,
} from '@chakra-ui/react';
import { Formik, Form, Field as FormikField } from 'formik';
import * as Yup from 'yup';
import { useUpdateUser } from '@/services';
import { UserProps } from '@/domain/interfaces/user.interfaces';
import { useToast } from '@/hooks/useToast';
import { HiPencil, HiUser, HiIdentification } from 'react-icons/hi2';
import { FaWindowClose } from 'react-icons/fa';
import { AiOutlineMail } from 'react-icons/ai';
import { UserRole } from '@/domain/types/UserRole';
import { formatCPF } from '@/utils/formatCPF';
import { modalStyles } from '@/styles/modalStyles';
import { useColorMode } from '../ui/color-mode';

const userTypes = createListCollection({
  items: [
    { label: 'Comum', value: 'Comum' },
    { label: 'Administrador', value: 'Admin' },
  ],
});

const UpdateUserSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .required('Nome é obrigatório'),
  email: Yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
  cpf: Yup.string()
    .matches(
      /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
      'CPF deve estar no formato 000.000.000-00'
    )
    .required('CPF é obrigatório'),
  sigle: Yup.string()
    .min(2, 'Sigla deve ter pelo menos 2 caracteres')
    .max(5, 'Sigla deve ter no máximo 5 caracteres')
    .required('Sigla é obrigatória'),
  role: Yup.string()
    .oneOf(['Comum', 'Admin'], 'Perfil inválido')
    .required('Perfil é obrigatório'),
});

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProps;
  onSuccess: () => void;
}

export function UserEditModal({
  isOpen,
  onClose,
  user,
  onSuccess,
}: UserEditModalProps) {
  const updateMutation = useUpdateUser();
  const toast = useToast();
  const theme = useColorMode();

  const handleSubmit = async (values: any) => {
    try {
      await updateMutation.mutateAsync({ id: user.id, user: values });
      toast.success('Sucesso', 'Usuário atualizado com sucesso!');
      onSuccess();
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      const errorMessage =
        (typeof error === 'object' &&
          error !== null &&
          'response' in error &&
          (error as any).response?.data?.message) ||
        'Erro ao atualizar usuário';
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
            <HiPencil size={24} color="orange" />
            <Heading size="lg">Editar Usuário</Heading>
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

        <Formik
          initialValues={{
            name: user.name,
            email: user.email,
            cpf: user.cpf,
            sigle: user.sigle,
            role: user.role as UserRole,
            active: user.active,
          }}
          validationSchema={UpdateUserSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched, values, setFieldValue }) => (
            <Form>
              <VStack gap={5}>
                {/* Alert informativo */}
                <Alert.Root status="warning">
                  <Alert.Indicator />
                  <Alert.Description>
                    Alterações no perfil de acesso podem afetar as permissões do
                    usuário.
                  </Alert.Description>
                </Alert.Root>

                {/* Dados Pessoais */}
                <Fieldset.Root>
                  <Fieldset.Legend>
                    <HStack gap={2}>
                      <HiUser size={20} />
                      <Text
                        fontWeight="semibold"
                        bg="text.bg"
                        color="text.color"
                      >
                        Dados Pessoais
                      </Text>
                    </HStack>
                  </Fieldset.Legend>
                  <Fieldset.Content>
                    <VStack gap={4}>
                      {/* Nome */}
                      <FormikField name="name">
                        {({ field }: any) => (
                          <Field.Root invalid={!!errors.name && !!touched.name}>
                            <Field.Label>Nome Completo</Field.Label>
                            <Input
                              {...field}
                              placeholder="Digite o nome completo do usuário"
                              bg="input.bg"
                              color="input.color"
                            />
                            <Field.ErrorText>{errors.name}</Field.ErrorText>
                          </Field.Root>
                        )}
                      </FormikField>

                      {/* E-mail */}
                      <FormikField name="email">
                        {({ field }: any) => (
                          <Field.Root
                            invalid={!!errors.email && !!touched.email}
                          >
                            <Field.Label>
                              <HStack gap={2}>
                                <AiOutlineMail size={16} />
                                <Text bg="text.bg" color="text.color">
                                  E-mail
                                </Text>
                              </HStack>
                            </Field.Label>
                            <Input
                              {...field}
                              type="email"
                              placeholder="email@exemplo.com"
                              bg="input.bg"
                              color="input.color"
                            />
                            <Field.ErrorText>{errors.email}</Field.ErrorText>
                          </Field.Root>
                        )}
                      </FormikField>

                      <HStack gap={4} w="full">
                        {/* CPF */}
                        <FormikField name="cpf">
                          {({ field }: any) => (
                            <Field.Root invalid={!!errors.cpf && !!touched.cpf}>
                              <Field.Label>
                                <HStack gap={2}>
                                  <HiIdentification size={16} />
                                  <Text bg="text.bg" color="text.color">
                                    CPF
                                  </Text>
                                </HStack>
                              </Field.Label>
                              <Input
                                {...field}
                                placeholder="000.000.000-00"
                                bg="input.bg"
                                color="input.color"
                                maxLength={14}
                                onChange={e => {
                                  const formatted = formatCPF(e.target.value);
                                  setFieldValue('cpf', formatted);
                                }}
                              />
                              <Field.ErrorText>{errors.cpf}</Field.ErrorText>
                            </Field.Root>
                          )}
                        </FormikField>

                        {/* Sigla */}
                        <FormikField name="sigle">
                          {({ field }: any) => (
                            <Field.Root
                              invalid={!!errors.sigle && !!touched.sigle}
                            >
                              <Field.Label>Sigla</Field.Label>
                              <Input
                                {...field}
                                placeholder="ABC"
                                bg="input.bg"
                                color="input.color"
                                textTransform="uppercase"
                                maxLength={5}
                                onChange={e => {
                                  setFieldValue(
                                    'sigle',
                                    e.target.value.toUpperCase()
                                  );
                                }}
                              />
                              <Field.ErrorText>{errors.sigle}</Field.ErrorText>
                            </Field.Root>
                          )}
                        </FormikField>
                      </HStack>
                    </VStack>
                  </Fieldset.Content>
                </Fieldset.Root>

                {/* Configurações de Acesso */}
                <Fieldset.Root>
                  <Fieldset.Legend>
                    <Text fontWeight="semibold" bg="text.bg" color="text.color">
                      Configurações de Acesso
                    </Text>
                  </Fieldset.Legend>

                  <Fieldset.Content>
                    <VStack gap={4}>
                      {/* Perfil */}
                      <FormikField name="role">
                        {({ field }: any) => (
                          <Field.Root invalid={!!errors.role && !!touched.role}>
                            <Field.Label>Perfil de Acesso</Field.Label>
                            <Select.Root
                              key={'md'}
                              size={'md'}
                              collection={userTypes}
                              value={[values.role]}
                              onValueChange={details => {
                                setFieldValue('role', details.value[0]);
                              }}
                            >
                              <Select.HiddenSelect />
                              <Select.Control>
                                <Select.Trigger>
                                  <Select.ValueText placeholder="Selecione o tipo de usuário" />
                                </Select.Trigger>
                                <Select.IndicatorGroup>
                                  <Select.Indicator />
                                </Select.IndicatorGroup>
                              </Select.Control>
                              <Portal>
                                <Select.Positioner>
                                  <Select.Content>
                                    {userTypes.items.map(type => (
                                      <Select.Item item={type} key={type.value}>
                                        {type.label}
                                        <Select.ItemIndicator />
                                      </Select.Item>
                                    ))}
                                  </Select.Content>
                                </Select.Positioner>
                              </Portal>
                            </Select.Root>
                            <Field.ErrorText>{field.role}</Field.ErrorText>
                          </Field.Root>
                        )}
                      </FormikField>
                    </VStack>
                  </Fieldset.Content>
                </Fieldset.Root>

                {/* Preview das alterações */}
                {values.name && values.email && (
                  <Alert.Root status="info" variant="subtle">
                    <Alert.Indicator />
                    <VStack align="start" gap={1}>
                      <Alert.Title>Alterações serão aplicadas:</Alert.Title>
                      <Alert.Description>
                        <Text fontSize="sm" bg="text.bg" color="text.color">
                          <strong>{values.name}</strong> ({values.sigle}) terá
                          perfil <strong>{values.role}</strong> e status{' '}
                          <strong>{values.active ? 'ativo' : 'inativo'}</strong>
                          .
                        </Text>
                      </Alert.Description>
                    </VStack>
                  </Alert.Root>
                )}

                {/* Footer */}
                <HStack
                  gap={3}
                  w="full"
                  justify="end"
                  pt={4}
                  borderTop="1px"
                  borderColor="gray.200"
                >
                  <Button
                    variant="ghost"
                    onClick={onClose}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    colorScheme="orange"
                    type="submit"
                    loading={isSubmitting}
                    loadingText="Salvando alterações..."
                  >
                    Salvar Alterações
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
