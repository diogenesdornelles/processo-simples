/* eslint-disable @typescript-eslint/no-explicit-any */
import { Alert, CloseButton } from '@chakra-ui/react';

export function useAlert() {
  const show = (
    title: string,
    description: string,
    status: 'success' | 'error' | 'info' | 'warning' = 'success'
  ) => {
    return (
      <Alert.Root status={status} variant="solid" className="alert">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>{title}</Alert.Title>
          <Alert.Description>{description}</Alert.Description>
        </Alert.Content>
        <CloseButton pos="relative" top="-2" insetEnd="-2" />
      </Alert.Root>
    );
  };

  return { show };
}
