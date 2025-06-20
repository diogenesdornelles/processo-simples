import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';

export function useDeleteDoc() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => Api.doc.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doc', 'getAll'] });
    },
  });
}
