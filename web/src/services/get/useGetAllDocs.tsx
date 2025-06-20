import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';

export function useGetAllDocs() {
  return useQuery({
    queryKey: ['doc', 'getAll'],
    queryFn: () => Api.doc.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
