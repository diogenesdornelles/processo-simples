import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';
import { LoginCredentials } from '@/domain/interfaces/login.interfaces';

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => Api.auth.login(credentials),
    onSuccess: () => {
      // Invalidate and refetch user data after login
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}
