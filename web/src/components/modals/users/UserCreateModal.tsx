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
import { modalStyles } from '@/styles/modalStyles';
import { useColorMode } from '../../ui/color-mode';
import { formatCPF } from '@/utils/formatCPF';

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
    .matches(/^\d{11}$/, 'CPF deve estar no formato 00000000000')
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
  const mutation = useCreateUser();
  const toast = useToast();
  const theme = useColorMode();

  const handleSubmit = async (
    values: CreateUser & { cpf: string; sigle: string }
  ) => {
    const promise = mutation.mutateAsync(values);
    toast.promise(
      promise,
      {
        title: 'Erro ao criar usuário',
        description: 'Tente novamente mais tarde.',
      },
      {
        title: 'Usuário criado com sucesso',
        description: `Usuário #${values.name} criado com sucesso!`,
      },
      {
        title: 'Criando usuário',
        description: 'Aguarde enquanto o usuário é criado...',
      }
    );
    if (mutation.isSuccess) {
      onSuccess();
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
      preventScroll={true}
      shouldFocusAfterRender={true}
      shouldReturnFocusAfterClose={true}
    >
      <Box
        p={6}
        bg="primary.gray.bg"
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
            <HiUser size={24} color="blue" />
            <Heading size="lg" color="primary.gray.color">
              Criar Novo Usuário
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
            name: '',
            email: '',
            cpf: '',
            password: '',
            sigle: '',
            role: 'Comum' as UserRole,
          }}
          validationSchema={CreateUserSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched, values, setFieldValue }) => (
            <Form>
              <VStack gap={5}>
                <Fieldset.Root>
                  <Fieldset.Legend>
                    <HStack gap={2}>
                      <HiUser size={20} />
                      <Text fontWeight="semibold" color="primary.gray.color">
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
                              bg="primary.gray.bg"
                              color="primary.gray.color"
                              borderColor="secondary.gray.bg"
                              _hover={{
                                borderColor: 'secondary.gray.bg.hover',
                              }}
                              _focus={{
                                borderColor: 'primary.purple.bg',
                              }}
                            />
                            <Field.ErrorText color="primary.error.color">
                              {errors.name}
                            </Field.ErrorText>
                          </Field.Root>
                        )}
                      </FormikField>
                      <FormikField name="email">
                        {({ field }: any) => (
                          <Field.Root
                            invalid={!!errors.email && !!touched.email}
                          >
                            <Field.Label>
                              <HStack gap={2}>
                                <AiOutlineMail size={30} />
                                <Text color="primary.gray.color">E-mail</Text>
                              </HStack>
                            </Field.Label>
                            <Input
                              {...field}
                              type="email"
                              placeholder="email@exemplo.com"
                              bg="primary.gray.bg"
                              color="primary.gray.color"
                              borderColor="secondary.gray.bg"
                              _hover={{
                                borderColor: 'secondary.gray.bg.hover',
                              }}
                              _focus={{
                                borderColor: 'primary.purple.bg',
                              }}
                            />
                            <Field.ErrorText>{errors.email}</Field.ErrorText>
                          </Field.Root>
                        )}
                      </FormikField>

                      <HStack gap={4} w="full">
                        <FormikField name="cpf">
                          {({ field }: any) => (
                            <Field.Root invalid={!!errors.cpf && !!touched.cpf}>
                              <Field.Label>
                                <HStack gap={2}>
                                  <HiIdentification size={16} />
                                  <Text color="primary.gray.color">CPF</Text>
                                </HStack>
                              </Field.Label>
                              <Input
                                {...field}
                                placeholder="00000000000"
                                bg="primary.gray.bg"
                                color="primary.gray.color"
                                borderColor="secondary.gray.bg"
                                _hover={{
                                  borderColor: 'secondary.gray.bg.hover',
                                }}
                                _focus={{
                                  borderColor: 'primary.purple.bg',
                                }}
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
                        <FormikField name="sigle">
                          {({ field }: any) => (
                            <Field.Root
                              invalid={!!errors.sigle && !!touched.sigle}
                            >
                              <Field.Label>Sigla</Field.Label>
                              <Input
                                {...field}
                                placeholder="ABC"
                                bg="primary.gray.bg"
                                color="primary.gray.color"
                                borderColor="secondary.gray.bg"
                                _hover={{
                                  borderColor: 'secondary.gray.bg.hover',
                                }}
                                _focus={{
                                  borderColor: 'primary.purple.bg',
                                }}
                                textTransform="uppercase"
                                maxLength={5}
                              />
                              <Field.ErrorText>{errors.sigle}</Field.ErrorText>
                            </Field.Root>
                          )}
                        </FormikField>
                      </HStack>
                    </VStack>
                  </Fieldset.Content>
                </Fieldset.Root>
                <Fieldset.Root>
                  <Fieldset.Legend>
                    <Text fontWeight="semibold" color="primary.gray.color">
                      Configurações de Acesso
                    </Text>
                  </Fieldset.Legend>

                  <Fieldset.Content>
                    <VStack gap={4}>
                      <FormikField name="role">
                        {({ field }: any) => (
                          <Field.Root>
                            <Field.Label>Perfil de Acesso</Field.Label>
                            <Select.Root
                              key={'md'}
                              size={'md'}
                              collection={userTypes}
                              value={[field.value]}
                              defaultValue={['Comum']}
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
                            <Field.ErrorText>{field.erro}</Field.ErrorText>
                          </Field.Root>
                        )}
                      </FormikField>
                      <FormikField name="password">
                        {({ field }: any) => (
                          <Field.Root
                            invalid={!!errors.password && !!touched.password}
                          >
                            <Field.Label>
                              <HStack gap={2}>
                                <Text color="primary.gray.color">🔒 Senha</Text>
                              </HStack>
                            </Field.Label>
                            <Input
                              {...field}
                              type="password"
                              placeholder="Digite a senha do usuário"
                              bg="primary.gray.bg"
                              color="primary.gray.color"
                              borderColor="secondary.gray.bg"
                              _hover={{
                                borderColor: 'secondary.gray.bg.hover',
                              }}
                              _focus={{
                                borderColor: 'primary.purple.bg',
                              }}
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
                {values.name && values.email && (
                  <Alert.Root status="success" variant="subtle">
                    <Alert.Indicator />
                    <VStack align="start" gap={1}>
                      <Alert.Title>Resumo do usuário:</Alert.Title>
                      <Alert.Description>
                        <Text fontSize="sm" color="secondary.gray.color">
                          <strong>{values.name}</strong> ({values.sigle}) será
                          criado com perfil de <strong>{values.role}</strong> e
                        </Text>
                      </Alert.Description>
                    </VStack>
                  </Alert.Root>
                )}

                <HStack
                  gap={3}
                  w="full"
                  justify="end"
                  pt={4}
                  borderTop="1px"
                  borderColor="secondary.gray.bg"
                >
                  <Button
                    bg="primary.purple.bg"
                    color="white"
                    variant="ghost"
                    onClick={onClose}
                    disabled={isSubmitting}
                    _hover={{
                      bg: 'primary.purple.bg.hover',
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    bg="primary.purple.bg"
                    color="white"
                    colorScheme="blue"
                    type="submit"
                    loading={isSubmitting}
                    loadingText="Criando usuário..."
                    _hover={{
                      bg: 'primary.purple.bg.hover',
                    }}
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
