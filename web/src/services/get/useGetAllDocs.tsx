import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';

export function useGetAllDocs() {
  return useQuery({
    queryFn: () => Api.doc.getAll(),
    queryKey: ['doc', 'getAll'],
  });
}
