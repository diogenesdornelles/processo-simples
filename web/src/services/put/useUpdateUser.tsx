import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';
import { UpdateUser } from '@/domain/interfaces/user.interfaces';

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, user }: { id: string; user: UpdateUser }) =>
      Api.user.update(id, user),
    onSuccess: (data, variables) => {
      // Invalidate and refetch user lists
      queryClient.invalidateQueries({ queryKey: ['user', 'getAll'] });
      // Update specific user cache
      queryClient.invalidateQueries({
        queryKey: ['user', 'get', variables.id],
      });
    },
  });
}
