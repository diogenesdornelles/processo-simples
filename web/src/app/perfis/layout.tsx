'use client';
import { Box } from '@chakra-ui/react';

export default function PerfisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Box mt={50}>{children}</Box>;
}
