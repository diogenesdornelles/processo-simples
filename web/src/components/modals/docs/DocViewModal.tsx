import {
  DialogRoot,
  DialogBackdrop,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogCloseTrigger,
  DialogBody,
  DialogFooter,
  Button,
  VStack,
  Text,
  HStack,
  Badge,
  IconButton,
  Box,
  Heading,
  Link,
} from '@chakra-ui/react';
import { HiXMark, HiPaperClip, HiArrowDownTray } from 'react-icons/hi2';
import { DocProps } from '@/domain/interfaces/doc.interfaces';

interface DocumentViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: DocProps[];
  eventName?: string;
}

export function DocViewModal({
  isOpen,
  onClose,
  documents,
  eventName,
}: DocumentViewModalProps) {
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
    <DialogRoot
      open={isOpen}
      onOpenChange={({ open }) => !open && onClose()}
      size="md"
    >
      <DialogBackdrop />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Heading size="md" color="primary.gray.text">
              Documentos do Evento
              {eventName && (
                <Text
                  fontSize="sm"
                  color="secondary.gray.text"
                  fontWeight="normal"
                >
                  {eventName}
                </Text>
              )}
            </Heading>
          </DialogTitle>
          <DialogCloseTrigger asChild>
            <IconButton
              aria-label="Fechar modal"
              variant="ghost"
              size="sm"
              color="secondary.gray.text"
            >
              <HiXMark />
            </IconButton>
          </DialogCloseTrigger>
        </DialogHeader>

        <DialogBody>
          {documents.length === 0 ? (
            <Box textAlign="center" py={8}>
              <VStack gap={3}>
                <HiPaperClip size={32} color="#94a3b8" />
                <Text
                  color="primary.gray.text"
                  fontSize="md"
                  fontWeight="semibold"
                >
                  Nenhum documento
                </Text>
                <Text color="secondary.gray.text" fontSize="sm">
                  Este evento não possui documentos anexados.
                </Text>
              </VStack>
            </Box>
          ) : (
            <VStack gap={3} align="stretch">
              {documents.map(doc => (
                <Box
                  key={doc.id}
                  p={4}
                  bg="secondary.gray.bg"
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor="secondary.gray.bg"
                  _hover={{
                    bg: 'secondary.gray.bg.hover',
                  }}
                >
                  <HStack justify="space-between" align="center">
                    <HStack gap={3} flex={1}>
                      <HiPaperClip size={20} color="#6b7280" />
                      <VStack align="start" gap={1} flex={1}>
                        <Text
                          fontSize="md"
                          color="primary.gray.text"
                          fontWeight="semibold"
                        >
                          {doc.name}
                        </Text>
                        {doc.description && (
                          <Text fontSize="sm" color="secondary.gray.text">
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
                          <Text fontSize="xs" color="secondary.gray.text">
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
                        color="secondary.blue.text"
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
                          color="secondary.gray.text"
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
        </DialogBody>

        <DialogFooter>
          <Button
            onClick={onClose}
            color="secondary.gray.text"
            borderColor="secondary.gray.bg"
            _hover={{
              bg: 'secondary.gray.bg.hover',
            }}
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
