import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';

export function useGetProc(id: number) {
  return useQuery({
    queryFn: () => Api.proc.get(id),
    queryKey: ['proc', 'get', id],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
