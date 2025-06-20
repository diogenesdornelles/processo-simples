import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => Api.event.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', 'getAll'] });
    },
  });
}
