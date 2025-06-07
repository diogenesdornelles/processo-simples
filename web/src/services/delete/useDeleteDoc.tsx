import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';

export function useDeleteDoc() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => Api.doc.delete(id),
    onSuccess: (data, variables) => {
      // Invalidate and refetch doc lists
      queryClient.invalidateQueries({ queryKey: ['doc', 'getAll'] });
      // Remove specific doc from cache
      queryClient.removeQueries({ queryKey: ['doc', 'get', variables] });
    },
  });
}
