import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';

export function useDeleteProc() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => Api.proc.delete(id),
    onSuccess: (data, variables) => {
      // Invalidate and refetch proc lists
      queryClient.invalidateQueries({ queryKey: ['proc', 'getAll'] });
      // Remove specific proc from cache
      queryClient.removeQueries({ queryKey: ['proc', 'get', variables] });
    },
  });
}
