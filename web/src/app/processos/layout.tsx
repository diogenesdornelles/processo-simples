import { Box } from '@chakra-ui/react';

export default function ProcessosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Box mt={50}>{children}</Box>;
}
