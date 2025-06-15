/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { useColorMode } from '../../ui/color-mode';

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
    .matches(/^\d{11}/, 'CPF deve estar no formato 00000000000')
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
  onSuccess,
  user,
}: UserEditModalProps) {
  const mutation = useUpdateUser();
  const toast = useToast();
  const theme = useColorMode();

  const handleSubmit = async (values: any) => {
    toast.show('Aguarde', 'Salvando usuário...', 'error');
    mutation.mutate(
      { id: user.id, user: values },
      {
        onSuccess: response => {
          if (response && response.cpf) {
            onSuccess();
          } else {
            toast.show('Erro', 'ao salvar usuário', 'error');
          }
        },
        onError: error => {
          console.log('Save error:', error);
          toast.show('Erro de conexão com o servidor', 'Tente mais tarde.', 'error');
        },
        onSettled: () => {
          toast.dismiss();
          onClose();
        },
      }
    );
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
            <HiPencil size={24} color="#ea580c" />
            <Heading size="lg" color="primary.gray.color">
              Editar Usuário
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
                <Alert.Root
                  status="warning"
                  bg="secondary.warning.bg"
                  borderColor="primary.warning.bg"
                >
                  <Alert.Indicator color="primary.warning.color" />
                  <Alert.Description color="primary.warning.color">
                    Alterações no perfil de acesso podem afetar as permissões do
                    usuário.
                  </Alert.Description>
                </Alert.Root>
                <Fieldset.Root
                  border="1px"
                  borderColor="secondary.gray.bg"
                  borderRadius="md"
                  p={4}
                >
                  <Fieldset.Legend>
                    <HStack gap={2}>
                      <HiUser size={20} color="#9333ea" />
                      <Text fontWeight="semibold" color="primary.gray.color">
                        Dados Pessoais
                      </Text>
                    </HStack>
                  </Fieldset.Legend>
                  <Fieldset.Content>
                    <VStack gap={4}>
                      <FormikField name="name">
                        {({ field }: any) => (
                          <Field.Root invalid={!!errors.name && !!touched.name}>
                            <Field.Label color="primary.gray.color">
                              Nome Completo
                            </Field.Label>
                            <Input
                              {...field}
                              placeholder="Digite o nome completo do usuário"
                              bg="primary.gray.bg"
                              color="primary.gray.color"
                              borderColor="secondary.gray.bg"
                              _hover={{
                                borderColor: 'secondary.gray.bg.hover',
                              }}
                              _focus={{ borderColor: 'primary.attention.bg' }}
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
                                <AiOutlineMail size={16} color="#2563eb" />{' '}
                                {/* Blue */}
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
                              _focus={{ borderColor: 'primary.attention.bg' }}
                            />
                            <Field.ErrorText color="primary.error.color">
                              {errors.email}
                            </Field.ErrorText>
                          </Field.Root>
                        )}
                      </FormikField>

                      <HStack gap={4} w="full">
                        <FormikField name="cpf">
                          {({ field }: any) => (
                            <Field.Root invalid={!!errors.cpf && !!touched.cpf}>
                              <Field.Label>
                                <HStack gap={2}>
                                  <HiIdentification size={16} color="#16a34a" />{' '}
                                  <Text color="primary.gray.color">CPF</Text>
                                </HStack>
                              </Field.Label>
                              <Input
                                {...field}
                                placeholder="000.000.000-00"
                                bg="primary.gray.bg"
                                color="primary.gray.color"
                                borderColor="secondary.gray.bg"
                                maxLength={14}
                                _hover={{
                                  borderColor: 'secondary.gray.bg.hover',
                                }}
                                _focus={{ borderColor: 'primary.attention.bg' }}
                                onChange={e => {
                                  const formatted = formatCPF(e.target.value);
                                  setFieldValue('cpf', formatted);
                                }}
                              />
                              <Field.ErrorText color="primary.error.color">
                                {errors.cpf}
                              </Field.ErrorText>
                            </Field.Root>
                          )}
                        </FormikField>

                        <FormikField name="sigle">
                          {({ field }: any) => (
                            <Field.Root
                              invalid={!!errors.sigle && !!touched.sigle}
                            >
                              <Field.Label color="primary.gray.color">
                                Sigla
                              </Field.Label>
                              <Input
                                {...field}
                                placeholder="ABC"
                                bg="primary.gray.bg"
                                color="primary.gray.color"
                                borderColor="secondary.gray.bg"
                                textTransform="uppercase"
                                maxLength={5}
                                _hover={{
                                  borderColor: 'secondary.gray.bg.hover',
                                }}
                                _focus={{ borderColor: 'primary.attention.bg' }}
                                onChange={e => {
                                  setFieldValue(
                                    'sigle',
                                    e.target.value.toUpperCase()
                                  );
                                }}
                              />
                              <Field.ErrorText color="primary.error.color">
                                {errors.sigle}
                              </Field.ErrorText>
                            </Field.Root>
                          )}
                        </FormikField>
                      </HStack>
                    </VStack>
                  </Fieldset.Content>
                </Fieldset.Root>

                <Fieldset.Root
                  border="1px"
                  borderColor="secondary.gray.bg"
                  borderRadius="md"
                  p={4}
                >
                  <Fieldset.Legend>
                    <Text fontWeight="semibold" color="primary.gray.color">
                      Configurações de Acesso
                    </Text>
                  </Fieldset.Legend>

                  <Fieldset.Content>
                    <VStack gap={4}>
                      <FormikField name="role">
                        {({ field }: any) => (
                          <Field.Root invalid={!!errors.role && !!touched.role}>
                            <Field.Label color="primary.gray.color">
                              Perfil de Acesso
                            </Field.Label>
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
                                <Select.Trigger
                                  bg="primary.gray.bg"
                                  color="primary.gray.color"
                                  borderColor="secondary.gray.bg"
                                  _hover={{
                                    borderColor: 'secondary.gray.bg.hover',
                                  }}
                                >
                                  <Select.ValueText placeholder="Selecione o tipo de usuário" />
                                </Select.Trigger>
                                <Select.IndicatorGroup>
                                  <Select.Indicator />
                                </Select.IndicatorGroup>
                              </Select.Control>
                              <Portal>
                                <Select.Positioner>
                                  <Select.Content
                                    bg="primary.gray.bg"
                                    borderColor="secondary.gray.bg"
                                    boxShadow="lg"
                                  >
                                    {userTypes.items.map(type => (
                                      <Select.Item
                                        item={type}
                                        key={type.value}
                                        color="primary.gray.color"
                                        _hover={{
                                          bg: 'secondary.attention.bg.hover',
                                          color: 'primary.attention.color',
                                        }}
                                      >
                                        {type.label}
                                        <Select.ItemIndicator />
                                      </Select.Item>
                                    ))}
                                  </Select.Content>
                                </Select.Positioner>
                              </Portal>
                            </Select.Root>
                            <Field.ErrorText color="primary.error.color">
                              {errors.role}
                            </Field.ErrorText>
                          </Field.Root>
                        )}
                      </FormikField>
                    </VStack>
                  </Fieldset.Content>
                </Fieldset.Root>

                {values.name && values.email && (
                  <Alert.Root
                    status="info"
                    variant="subtle"
                    bg="secondary.info.bg"
                    borderColor="primary.info.bg"
                  >
                    <Alert.Indicator color="primary.info.color" />
                    <VStack align="start" gap={1}>
                      <Alert.Title color="primary.info.color">
                        Alterações serão aplicadas:
                      </Alert.Title>
                      <Alert.Description>
                        <Text fontSize="sm" color="primary.info.color">
                          <strong>{values.name}</strong> ({values.sigle}) terá
                          perfil <strong>{values.role}</strong> e status{' '}
                          <strong>{values.active ? 'ativo' : 'inativo'}</strong>
                          .
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
                    variant="ghost"
                    onClick={onClose}
                    disabled={isSubmitting}
                    color="secondary.gray.color"
                    _hover={{
                      bg: 'secondary.gray.bg.hover',
                      color: 'secondary.gray.color.hover',
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    bg="primary.attention.bg"
                    color="white"
                    type="submit"
                    loading={isSubmitting}
                    loadingText="Salvando alterações..."
                    _hover={{
                      bg: 'primary.attention.bg.hover',
                    }}
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
