import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => Api.user.delete(id),
    onSuccess: (data, variables) => {
      // Invalidate and refetch user lists
      queryClient.invalidateQueries({ queryKey: ['user', 'getAll'] });
      // Remove specific user from cache
      queryClient.removeQueries({ queryKey: ['user', 'get', variables] });
    },
  });
}
