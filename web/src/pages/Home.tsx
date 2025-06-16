import { Stack, Heading, Highlight } from '@chakra-ui/react';

export default function Home() {
  return (
    <Stack>
      <Heading
        size="3xl"
        letterSpacing="tight"
        lineHeight="tall"
        ml={20}
        color="secondary.purple.bg"
      >
        <Highlight
          query={['Gerencie', 'simples', 'rápido']}
          styles={{ px: '1', bg: 'primary.info.color', borderRadius: 'md' }}
        >
          Gerencie de modo simples e rápido seus documentos
        </Highlight>
      </Heading>
    </Stack>
  );
}
