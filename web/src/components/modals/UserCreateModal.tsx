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
  Alert,
  Box,
  Heading,
  IconButton,
  Fieldset,
  Field,
  Portal,
  createListCollection,
} from '@chakra-ui/react';
import { Formik, Form, Field as FormikField } from 'formik';
import * as Yup from 'yup';
import { useCreateUser } from '@/services';
import { CreateUser } from '@/domain/interfaces/user.interfaces';
import { useToast } from '@/hooks/useToast';
import { HiUser, HiIdentification } from 'react-icons/hi2';
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

const CreateUserSchema = Yup.object().shape({
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

interface UserCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function UserCreateModal({
  isOpen,
  onClose,
  onSuccess,
}: UserCreateModalProps) {
  const createMutation = useCreateUser();
  const toast = useToast();
  const theme = useColorMode();

  const handleSubmit = async (
    values: CreateUser & { cpf: string; sigle: string; active: boolean }
  ) => {
    try {
      await createMutation.mutateAsync(values);
      toast.success('Sucesso', 'Usuário criado');
      onSuccess();
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      const errorMessage =
        (typeof error === 'object' &&
          error !== null &&
          'response' in error &&
          (error as any).response?.data?.message) ||
        'Erro ao criar usuário';
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
            <HiUser size={24} color="icon.bg" />
            <Heading size="lg">Criar Novo Usuário</Heading>
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
            name: '',
            email: '',
            cpf: '',
            password: '',
            sigle: '',
            role: 'Comum' as UserRole,
            active: true,
          }}
          validationSchema={CreateUserSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched, values, setFieldValue }) => (
            <Form>
              <VStack gap={5}>
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
                                <AiOutlineMail size={30} />
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
                          <Field.Root>
                            <Field.Label>Perfil de Acesso</Field.Label>
                            <Select.Root
                              key={'md'}
                              size={'md'}
                              collection={userTypes}
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
                            <Field.ErrorText>{field.erro}</Field.ErrorText>
                          </Field.Root>
                        )}
                      </FormikField>
                      {/* SENHA  */}
                      <FormikField name="password">
                        {({ field }: any) => (
                          <Field.Root
                            invalid={!!errors.password && !!touched.password}
                          >
                            <Field.Label>
                              <HStack gap={2}>
                                <Text bg="text.bg" color="text.color">
                                  🔒 Senha
                                </Text>
                              </HStack>
                            </Field.Label>
                            <Input
                              {...field}
                              type="password"
                              placeholder="Digite a senha do usuário"
                              bg="input.bg"
                              color="input.color"
                            />
                            <Field.HelperText>
                              Mínimo de 6 caracteres
                            </Field.HelperText>
                            <Field.ErrorText>{errors.password}</Field.ErrorText>
                          </Field.Root>
                        )}
                      </FormikField>
                    </VStack>
                  </Fieldset.Content>
                </Fieldset.Root>

                {/* Preview dos dados */}
                {values.name && values.email && (
                  <Alert.Root status="success" variant="subtle">
                    <Alert.Indicator />
                    <VStack align="start" gap={1}>
                      <Alert.Title>Resumo do usuário:</Alert.Title>
                      <Alert.Description>
                        <Text fontSize="sm" bg="text.bg" color="text.color">
                          <strong>{values.name}</strong> ({values.sigle}) será
                          criado com perfil de <strong>{values.role}</strong> e
                          status{' '}
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
                    colorScheme="blue"
                    type="submit"
                    loading={isSubmitting}
                    loadingText="Criando usuário..."
                  >
                    Criar Usuário
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
