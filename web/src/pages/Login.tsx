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
    toast.loading('Aguarde', 'Processando login...');
    mutation.mutate(values, {
      onSuccess: response => {
        if (response && response.token_type) {
          toast.dismiss();
          toast.success(
            'Login realizado!',
            `Bem-vindo, ${response.user?.name || 'usuário'}!`
          );
          login(response);
          router.push('/home');
        } else {
          if (response?.message) {
            toast.error('Erro ao fazer login', response.message);
            return;
          }
          toast.error('Erro de conexão com o servidor', 'tente mais tarde.');
        }
      },
      onError: error => {
        console.log('Login error:', error);
        toast.error('Erro de conexão com o servidor', 'Tente mais tarde.');
      },
    });
    toast.dismiss();
  };

  return (
    <Container maxW="md" py={12} suppressHydrationWarning>
      <Flex minHeight="60vh" align="center">
        <Box
          w="full"
          bg="form.bg"
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
                    <Heading size="lg" color="headingLg.color">
                      Processo Fácil
                    </Heading>
                    <Text color="form.color.muted">
                      Faça login em sua conta
                    </Text>
                  </VStack>

                  {/* Campos do formulário */}
                  <Fieldset.Root>
                    <Fieldset.Legend>
                      <Text color="form.color" fontWeight="semibold">
                        Credenciais de Acesso
                      </Text>
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
                                bg="input.bg"
                                color="form.color"
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
                                bg="input.bg"
                                color="form.color"
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
                    bg="button.bg"
                    color="button.color"
                    _hover={{ bg: 'button.bg.hover' }}
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
                    <Text fontSize="sm" color="form.color.muted">
                      Não tem conta?
                    </Text>
                    <Text
                      fontSize="sm"
                      color="link.color"
                      cursor="pointer"
                      _hover={{ color: 'link.color.hover' }}
                    >
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
