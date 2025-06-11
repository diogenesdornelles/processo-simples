import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';
import { UpdateEvent } from '@/domain/interfaces/event.interfaces';

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, event }: { id: number; event: UpdateEvent }) =>
      Api.event.update(id, event),
    onSuccess: (data, variables) => {
      // Invalidate and refetch event lists
      queryClient.invalidateQueries({ queryKey: ['event', 'getAll'] });
      // Update specific event cache
      queryClient.invalidateQueries({
        queryKey: ['event', 'get', variables.id],
      });
    },
  });
}
