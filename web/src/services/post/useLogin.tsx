import { useMutation } from '@tanstack/react-query';

import { Api } from '@/api/Api';
import { LoginCredentials } from '@/domain/interfaces/login.interfaces';

export function useLogin() {
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => Api.auth.login(credentials),
  });
}
