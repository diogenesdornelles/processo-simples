import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';
import { UpdateDoc } from '@/domain/interfaces/doc.interfaces';

export function useUpdateDoc() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, doc }: { id: string; doc: UpdateDoc }) =>
      Api.doc.update(id, doc),
    onSuccess: (data, variables) => {
      // Invalidate and refetch doc lists
      queryClient.invalidateQueries({ queryKey: ['doc', 'getAll'] });
      // Update specific doc cache
      queryClient.invalidateQueries({ queryKey: ['doc', 'get', variables.id] });
    },
  });
}
