import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';

export function useDeleteProc() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => Api.proc.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proc', 'getAll'] });
    },
  });
}
