import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';

export function useGetDoc(id: number) {
  return useQuery({
    queryFn: () => Api.doc.get(id),
    queryKey: ['doc', 'get', id],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
