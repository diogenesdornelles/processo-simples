'use client';

import Modal from 'react-modal';
import {
  VStack,
  Text,
  HStack,
  Badge,
  IconButton,
  Box,
  Heading,
  Link,
  Button,
} from '@chakra-ui/react';
import { HiPaperClip, HiArrowDownTray } from 'react-icons/hi2';
import { FaWindowClose } from 'react-icons/fa';
import { DocProps } from '@/domain/interfaces/doc.interfaces';
import { modalStyles } from '@/styles/modalStyles';
import { useColorMode } from '@/components/ui/color-mode';

interface DocumentViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  docs: DocProps[];
  eventName: string;
  eventIndex: number;
}

export function DocViewModal({
  isOpen,
  onClose,
  docs,
  eventName,
  eventIndex,
}: DocumentViewModalProps) {
  const theme = useColorMode();

  const handleDownload = (doc: DocProps) => {
    // Create a download link for the document
    const link = document.createElement('a');
    link.href = doc.uri;
    link.download = `${doc.name}.${doc.ext}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        borderRadius="12px"
        data-state={isOpen ? 'open' : 'closed'}
        _open={{
          animation: 'fade-in 300ms ease-out',
        }}
        _closed={{
          animation: 'fade-out 300ms ease-in',
        }}
      >
        <HStack justify="space-between" align="center" mb={6}>
          <VStack align="start" gap={1}>
            <HStack gap={2}>
              <HiPaperClip size={24} color="#9333ea" />
              <Heading size="lg" color="primary.gray.color">
                Documentos do Evento
              </Heading>
            </HStack>
            {eventName && typeof eventIndex === 'number' && (
              <Text
                fontSize="sm"
                color="secondary.gray.color"
                fontWeight="normal"
                ml={8}
              >
                Evento {eventIndex + 1}: {eventName}
              </Text>
            )}
          </VStack>
          <IconButton
            aria-label="Fechar modal"
            variant="ghost"
            size="sm"
            cursor="pointer"
            onClick={onClose}
            color="secondary.gray.color"
            _hover={{
              bg: 'secondary.gray.bg.hover',
              color: 'secondary.gray.color.hover',
            }}
          >
            <FaWindowClose size={20} />
          </IconButton>
        </HStack>

        <VStack gap={6} align="stretch">
          {docs.length === 0 ? (
            <Box
              textAlign="center"
              py={8}
              bg="secondary.gray.bg"
              borderRadius="md"
              borderWidth="1px"
              borderColor="secondary.gray.bg"
            >
              <VStack gap={3}>
                <HiPaperClip size={32} color="#94a3b8" />
                <Text
                  color="primary.gray.color"
                  fontSize="md"
                  fontWeight="semibold"
                >
                  Nenhum documento
                </Text>
                <Text color="secondary.gray.color" fontSize="sm">
                  Este evento não possui documentos anexados.
                </Text>
              </VStack>
            </Box>
          ) : (
            <VStack gap={3} align="stretch">
              {docs.map(doc => (
                <Box
                  key={doc.id}
                  p={4}
                  bg="secondary.gray.bg"
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor="secondary.gray.bg.hover"
                  _hover={{
                    bg: 'secondary.gray.bg.hover',
                    transition: 'all 0.2s',
                  }}
                >
                  <HStack justify="space-between" align="center">
                    <HStack gap={3} flex={1}>
                      <HiPaperClip size={20} color="#6b7280" />
                      <VStack align="start" gap={1} flex={1}>
                        <Text
                          fontSize="md"
                          color="primary.gray.color"
                          fontWeight="semibold"
                        >
                          {doc.name}
                        </Text>
                        {doc.description && (
                          <Text fontSize="sm" color="secondary.gray.color">
                            {doc.description}
                          </Text>
                        )}
                        <HStack gap={2}>
                          <Badge
                            bg="blue.500"
                            color="white"
                            variant="solid"
                            size="sm"
                            px={2}
                            py={1}
                            borderRadius="full"
                          >
                            .{doc.ext.toUpperCase()}
                          </Badge>
                          <Text fontSize="xs" color="secondary.gray.color">
                            Criado em{' '}
                            {new Date(doc.created_at).toLocaleDateString(
                              'pt-BR'
                            )}
                          </Text>
                        </HStack>
                      </VStack>
                    </HStack>

                    <VStack gap={2}>
                      <Button
                        size="sm"
                        variant="outline"
                        color="secondary.blue.color"
                        borderColor="secondary.blue.bg"
                        _hover={{
                          bg: 'secondary.blue.bg.hover',
                          color: 'white',
                        }}
                        onClick={() => handleDownload(doc)}
                      >
                        <HiArrowDownTray />
                        Download
                      </Button>

                      <Link
                        href={doc.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        _hover={{ textDecoration: 'none' }}
                      >
                        <Button
                          size="sm"
                          variant="ghost"
                          color="secondary.gray.color"
                          _hover={{
                            bg: 'secondary.gray.bg.hover',
                          }}
                        >
                          Visualizar
                        </Button>
                      </Link>
                    </VStack>
                  </HStack>
                </Box>
              ))}
            </VStack>
          )}

          <Box
            p={4}
            borderRadius="lg"
            bg="secondary.gray.bg"
            border="1px"
            borderColor="secondary.gray.bg.hover"
            textAlign="center"
          >
            <Text fontSize="sm" color="secondary.gray.color">
              Total de documentos:{' '}
              <Text as="span" fontWeight="bold" color="primary.purple.color">
                {docs.length}
              </Text>
            </Text>
          </Box>
        </VStack>
      </Box>
    </Modal>
  );
}
