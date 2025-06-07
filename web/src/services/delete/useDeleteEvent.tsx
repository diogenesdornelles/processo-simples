import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => Api.event.delete(id),
    onSuccess: (data, variables) => {
      // Invalidate and refetch event lists
      queryClient.invalidateQueries({ queryKey: ['event', 'getAll'] });
      // Remove specific event from cache
      queryClient.removeQueries({ queryKey: ['event', 'get', variables] });
    },
  });
}
