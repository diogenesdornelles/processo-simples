import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => Api.auth.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
