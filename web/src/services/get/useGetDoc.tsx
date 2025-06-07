import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';

export function useGetDoc(id: string, enabled = true) {
  return useQuery({
    queryFn: () => Api.doc.get(id),
    queryKey: ['doc', 'get', id],
    enabled: enabled && !!id,
  });
}
