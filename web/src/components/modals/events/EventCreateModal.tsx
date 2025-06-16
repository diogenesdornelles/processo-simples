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
  Box,
  Heading,
  Select,
  IconButton,
  Fieldset,
  Field,
  Portal,
  createListCollection,
  FileUpload,
} from '@chakra-ui/react';
import { Formik, Form, Field as FormikField } from 'formik';
import * as Yup from 'yup';
import { useCreateEvent } from '@/services/post/useCreateEvent';
import { useCreateDoc } from '@/services/post/useCreateDoc';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';
import { EventName } from '@/domain/types/EventName';
import { HiDocumentText, HiPaperClip } from 'react-icons/hi2';
import { FaWindowClose } from 'react-icons/fa';
import { modalStyles } from '@/styles/modalStyles';
import { useColorMode } from '../../ui/color-mode';
import { ChangeEvent, useState } from 'react';
import { HiUpload } from 'react-icons/hi';

const eventTypes = createListCollection({
  items: [
    { label: 'Criação do processo', value: 'Criação do processo' },
    { label: 'Juntada de documento', value: 'Juntada de documento' },
    { label: 'Baixa', value: 'Baixa' },
  ],
});

const CreateEventSchema = Yup.object().shape({
  name: Yup.string()
    .oneOf(eventTypes.getValues(), 'Selecione um tipo de evento válido')
    .required('Tipo de evento é obrigatório'),
});

interface EventCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  procId: number;
  onSuccess: () => void;
  isCreationProc: boolean;
}

interface SelectedFile {
  file: File;
  name: string;
  description: string;
}

export function EventCreateModal({
  isOpen,
  onClose,
  procId,
  onSuccess,
  isCreationProc = false,
}: EventCreateModalProps) {
  const { user } = useAuth();
  const createEventMutation = useCreateEvent();
  const createDocMutation = useCreateDoc();
  const toast = useToast();
  const theme = useColorMode();
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);

  const handleSubmit = async (values: { name: EventName }) => {
    if (!user?.id) {
      toast.show('Erro', 'Usuário não autenticado', 'error');
      return;
    }

    if (isCreationProc) {
      if (values.name !== 'Criação do processo') {
        toast.show(
          'Erro',
          'Para criar um processo, o primeiro evento deve ser do tipo "Criação do processo".',
          'error'
        );
        return;
      }

      if (selectedFiles.length === 0) {
        toast.show(
          'Erro',
          'Para criar um processo, é necessário anexar ao menos um documento.',
          'error'
        );
        return;
      }
    } else {
      if (values.name === 'Criação do processo') {
        toast.show(
          'Erro',
          'Criação do processo deve ser usado somente como o primeiro evento.',
          'error'
        );
        return;
      }

      if (values.name === 'Baixa' && selectedFiles.length > 0) {
        toast.show(
          'Erro',
          'O evento de Baixa não deve conter documentos anexados.',
          'error'
        );
        return;
      }
      if (
        values.name === 'Juntada de documento' &&
        selectedFiles.length === 0
      ) {
        toast.show(
          'Erro',
          'O evento de Juntada de documento deve conter ao menos um documento anexado.',
          'error'
        );
        return;
      }
    }
    toast.show('Aguarde', 'Criando evento...', 'loading');
    const newEvent = await createEventMutation.mutateAsync(
      {
        name: values.name,
        proc_id: procId,
        user_id: user.id,
      },
      {
        onError: error => {
          console.error('Error creating event:', error);
          toast.show(
            'Erro de conexão com o servidor',
            'Tente mais tarde.',
            'error'
          );
        },
      }
    );
    toast.dismiss();

    if (selectedFiles.length > 0) {
      toast.show('Aguarde', 'Criando evento...', 'loading');
      const docPromises = selectedFiles.map(async selectedFile => {
        const docData = {
          name: selectedFile.name || selectedFile.file.name,
          description: selectedFile.description,
          file: selectedFile.file,
          event_id: newEvent.id,
          active: true,
        };
        return await createDocMutation.mutateAsync(docData, {
          onError: error => {
            console.error('Error creating document:', error);
            toast.show('Erro ao anexar documento', 'Tente novamente.', 'error');
          },
        });
      });
      await Promise.all(docPromises);
      toast.dismiss();
    }
    toast.show('Sucesso', 'Evento criado com sucesso!', 'success');
    onSuccess();
  };

  const handleClose = () => {
    setSelectedFiles([]);
    onClose();
  };

  const handleFileChange = (details: {
    acceptedFiles: File[];
    rejectedFiles: any[];
  }) => {
    const { acceptedFiles, rejectedFiles } = details;

    if (acceptedFiles && acceptedFiles.length > 0) {
      setSelectedFiles(prev => {
        const existingNames = new Set(prev.map(sf => sf.file.name));
        const newFiles = acceptedFiles
          .filter(file => !existingNames.has(file.name))
          .map(file => ({
            file,
            name: '',
            description: '',
          }));
        return [...prev, ...newFiles];
      });
    }

    if (rejectedFiles && rejectedFiles.length > 0) {
      toast.show(
        'Arquivos rejeitados',
        `${rejectedFiles.length} arquivo(s) não foram aceitos`,
        'warning'
      );
    }
  };

  const handleFileInfoChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedFiles(prev => {
      const key = event.target.name as keyof SelectedFile;
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [key]: event.target.value,
      };
      return updated;
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
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
            <HiDocumentText size={24} color="blue" />
            <Heading size="lg" color="primary.gray.color">
              Criar Novo Evento
            </Heading>
            {isCreationProc && (
              <Text color="primary.gray.color" fontSize="sm">
                A criação do processo dependa da inserção de um evento inicial
                com um documento, ao menos.
              </Text>
            )}
          </HStack>
          <IconButton
            aria-label="Fechar modal"
            variant="ghost"
            size="sm"
            onClick={handleClose}
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
            name: isCreationProc
              ? 'Criação do processo'
              : 'Juntada de documento',
          }}
          validationSchema={CreateEventSchema}
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
                        Tipo de Evento
                      </Text>
                    </HStack>
                  </Fieldset.Legend>
                  <Fieldset.Content>
                    <VStack gap={4}>
                      <FormikField name="name">
                        {({ field }: any) => (
                          <Field.Root invalid={!!errors.name && !!touched.name}>
                            <Field.Label>
                              Selecione o tipo de evento
                            </Field.Label>
                            <Select.Root
                              key={'md'}
                              size={'md'}
                              collection={eventTypes}
                              disabled={
                                isSubmitting ||
                                createEventMutation.isPending ||
                                createDocMutation.isPending ||
                                !!isCreationProc
                              }
                              value={[field.value]}
                              defaultValue={
                                isCreationProc
                                  ? ['Criação do processo']
                                  : ['Juntada de documento']
                              }
                              onValueChange={details => {
                                setFieldValue('name', details.value[0]);
                              }}
                            >
                              <Select.HiddenSelect />
                              <Select.Control>
                                <Select.Trigger>
                                  <Select.ValueText placeholder="Selecione o tipo de evento" />
                                </Select.Trigger>
                                <Select.IndicatorGroup>
                                  <Select.Indicator />
                                </Select.IndicatorGroup>
                              </Select.Control>
                              <Portal>
                                <Select.Positioner>
                                  <Select.Content>
                                    {eventTypes.items.map(type => (
                                      <Select.Item item={type} key={type.value}>
                                        {type.label}
                                        <Select.ItemIndicator />
                                      </Select.Item>
                                    ))}
                                  </Select.Content>
                                </Select.Positioner>
                              </Portal>
                            </Select.Root>
                            <Field.ErrorText color="primary.error.color">
                              {errors.name}
                            </Field.ErrorText>
                          </Field.Root>
                        )}
                      </FormikField>
                    </VStack>
                  </Fieldset.Content>
                </Fieldset.Root>

                <Fieldset.Root>
                  <Fieldset.Legend>
                    <HStack gap={2}>
                      <HiPaperClip size={20} />
                      <Text fontWeight="semibold" color="primary.gray.color">
                        Documentos (Opcional)
                      </Text>
                    </HStack>
                  </Fieldset.Legend>
                  <Fieldset.Content>
                    <VStack gap={4}>
                      <FileUpload.Root
                        accept={['pdf', 'jpg', 'jpeg', 'png']}
                        maxFiles={5}
                        onFileChange={details => handleFileChange(details)}
                      >
                        <FileUpload.HiddenInput />
                        <FileUpload.Label />
                        <FileUpload.Trigger asChild>
                          <Button variant="outline" size="sm">
                            <HiUpload /> Adicione arquivos
                          </Button>
                        </FileUpload.Trigger>
                        <FileUpload.ItemGroup>
                          <FileUpload.Context>
                            {({ acceptedFiles }) =>
                              acceptedFiles.map((file, index) => (
                                <FileUpload.Item
                                  key={file.name}
                                  file={file}
                                  display="flex"
                                  flexDirection="column"
                                  gap={3}
                                >
                                  <FileUpload.ItemPreview />
                                  <FileUpload.ItemName />
                                  <FileUpload.ItemSizeText />
                                  <FileUpload.ItemDeleteTrigger />
                                  <Fieldset.Root>
                                    <Fieldset.Legend>
                                      <Text fontWeight="semibold">
                                        Informações adicionais
                                      </Text>
                                    </Fieldset.Legend>

                                    <Fieldset.Content>
                                      <Field.Root>
                                        <Field.Label>
                                          Nome do documento
                                        </Field.Label>

                                        <Input
                                          placeholder="Informe..."
                                          onChange={e =>
                                            handleFileInfoChange(index, e)
                                          }
                                          minLength={3}
                                          size="sm"
                                          name="name"
                                          bg="primary.gray.bg"
                                          borderColor="secondary.gray.bg"
                                          color="primary.gray.color"
                                          _placeholder={{
                                            color: 'secondary.gray.color',
                                          }}
                                          _focus={{
                                            borderColor: 'primary.purple.bg',
                                          }}
                                        />
                                      </Field.Root>
                                      <Field.Root>
                                        <Field.Label>
                                          Descrição do documento
                                        </Field.Label>
                                        <Input
                                          placeholder="Descrição (opcional) ..."
                                          onChange={e =>
                                            handleFileInfoChange(index, e)
                                          }
                                          name="description"
                                          size="sm"
                                          bg="primary.gray.bg"
                                          borderColor="secondary.gray.bg"
                                          color="primary.gray.color"
                                          _placeholder={{
                                            color: 'secondary.gray.color',
                                          }}
                                          _focus={{
                                            borderColor: 'primary.purple.bg',
                                          }}
                                        />
                                      </Field.Root>
                                    </Fieldset.Content>
                                  </Fieldset.Root>
                                </FileUpload.Item>
                              ))
                            }
                          </FileUpload.Context>
                        </FileUpload.ItemGroup>
                      </FileUpload.Root>
                    </VStack>
                  </Fieldset.Content>
                </Fieldset.Root>

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
                    onClick={handleClose}
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
                    loadingText="Criando evento..."
                    _hover={{
                      bg: 'primary.purple.bg.hover',
                    }}
                  >
                    Criar Evento
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
