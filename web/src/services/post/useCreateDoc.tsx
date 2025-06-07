import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';
import { CreateDoc } from '@/domain/interfaces/doc.interfaces';

export function useCreateDoc() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (doc: CreateDoc) => Api.doc.create(doc),
    onSuccess: () => {
      // Invalidate and refetch doc lists
      queryClient.invalidateQueries({ queryKey: ['doc', 'getAll'] });
    },
  });
}
