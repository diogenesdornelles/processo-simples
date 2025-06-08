import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';
import { CreateEvent } from '@/domain/interfaces/event.interfaces';

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (event: CreateEvent) => Api.event.create(event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', 'getAll'] });
    },
  });
}
