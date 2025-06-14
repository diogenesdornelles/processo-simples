import { Box, Spinner, Portal } from '@chakra-ui/react';

interface CustomBackdropProps {
  isOpen: boolean;
  children?: React.ReactNode;
}

export function CustomBackdrop({
  isOpen = true,
  children,
}: CustomBackdropProps) {
  if (!isOpen) return null;

  return (
    <Portal>
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="blackAlpha.600"
        display="flex"
        alignItems="center"
        justifyContent="center"
        zIndex={1400}
      >
        {children || <Spinner size="xl" color="white" />}
      </Box>
    </Portal>
  );
}
