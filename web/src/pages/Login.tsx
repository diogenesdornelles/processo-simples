/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  Container,
  Flex,
  Box,
  VStack,
  HStack,
  Heading,
  Input,
  Button,
  Text,
  Fieldset,
  Field,
} from '@chakra-ui/react';
import { Formik, Form, Field as FormikField } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/services';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
  password: Yup.string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .required('Senha é obrigatória'),
});

export default function Login() {
  const router = useRouter();
  const mutation = useLogin();
  const { login } = useAuth();
  const toast = useToast();
  const handleLoginSubmit = async (values: any) => {
    toast.show('Aguarde', 'Processando login...', 'loading');
    mutation.mutate(values, {
      onSuccess: response => {
        if (response && response.token_type) {
          toast.dismiss();
          toast.show(
            'Login realizado!',
            `Bem-vindo, ${response.user?.name || 'usuário'}!`
          );
          login(response);
          router.push('/home');
        } else {
          if (response?.message) {
            toast.show('Erro ao fazer login', response.message, 'error');
            return;
          }
          toast.show(
            'Erro de conexão com o servidor',
            'tente mais tarde.',
            'error'
          );
        }
      },
      onError: error => {
        console.log('Login error:', error);
        toast.show(
          'Erro de conexão com o servidor',
          'tente mais tarde.',
          'error'
        );
      },
    });
    toast.dismiss();
  };

  return (
    <Container maxW="md" py={12} suppressHydrationWarning>
      <Flex minHeight="60vh" align="center">
        <Box
          w="full"
          bg="secondary.gray.bg"
          color="secondary.gray.color"
          p={8}
          borderRadius="lg"
          boxShadow="xl"
          suppressHydrationWarning
        >
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={handleLoginSubmit}
          >
            {formikProps => (
              <Form>
                <VStack gap={6} align="stretch">
                  {/* Header */}
                  <VStack gap={2}>
                    <Heading size="lg">Processo Fácil</Heading>
                    <Text>Faça login em sua conta</Text>
                  </VStack>

                  {/* Campos do formulário */}
                  <Fieldset.Root>
                    <Fieldset.Legend>
                      <Text fontWeight="semibold">Credenciais de Acesso</Text>
                    </Fieldset.Legend>

                    <Fieldset.Content>
                      <VStack gap={4}>
                        {/* Email */}
                        <FormikField name="email">
                          {({ field, form }: any) => (
                            <Field.Root
                              invalid={form.errors.email && form.touched.email}
                            >
                              <Field.Label>E-mail</Field.Label>
                              <Input
                                {...field}
                                id="email"
                                placeholder="admin@example.com"
                                type="email"
                                suppressHydrationWarning
                              />
                              <Field.ErrorText>
                                {form.errors.email}
                              </Field.ErrorText>
                            </Field.Root>
                          )}
                        </FormikField>

                        {/* Senha */}
                        <FormikField name="password">
                          {({ field, form }: any) => (
                            <Field.Root
                              invalid={
                                form.errors.password && form.touched.password
                              }
                            >
                              <Field.Label>Senha</Field.Label>
                              <Input
                                {...field}
                                id="password"
                                placeholder="password"
                                type="password"
                                suppressHydrationWarning
                              />
                              <Field.ErrorText>
                                {form.errors.password}
                              </Field.ErrorText>
                            </Field.Root>
                          )}
                        </FormikField>
                      </VStack>
                    </Fieldset.Content>
                  </Fieldset.Root>

                  <Button
                    type="submit"
                    w="full"
                    size="lg"
                    loading={formikProps.isSubmitting || mutation.isPending}
                    disabled={formikProps.isSubmitting || mutation.isPending}
                    suppressHydrationWarning
                  >
                    Entrar
                  </Button>

                  {/* Footer */}
                  <HStack justify="center" gap={1}>
                    <Text fontSize="sm">Não tem conta?</Text>
                    <Text fontSize="sm" cursor="pointer">
                      Solicite ao administrador
                    </Text>
                  </HStack>
                </VStack>
              </Form>
            )}
          </Formik>
        </Box>
      </Flex>
    </Container>
  );
}
