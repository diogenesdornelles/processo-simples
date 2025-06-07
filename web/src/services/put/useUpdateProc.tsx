import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';
import { UpdateProc } from '@/domain/interfaces/proc.interfaces';

export function useUpdateProc() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, proc }: { id: string; proc: UpdateProc }) => 
      Api.proc.update(id, proc),
    onSuccess: (data, variables) => {
      // Invalidate and refetch proc lists
      queryClient.invalidateQueries({ queryKey: ['proc', 'getAll'] });
      // Update specific proc cache
      queryClient.invalidateQueries({ queryKey: ['proc', 'get', variables.id] });
    },
  });
}
