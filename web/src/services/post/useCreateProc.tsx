import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';
import { CreateProc } from '@/domain/interfaces/proc.interfaces';

export function useCreateProc() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (proc: CreateProc) => Api.proc.create(proc),
    onSuccess: () => {
      // Invalidate and refetch proc lists
      queryClient.invalidateQueries({ queryKey: ['proc', 'getAll'] });
    },
  });
}
