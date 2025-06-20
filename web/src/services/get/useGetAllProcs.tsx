import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';

export function useGetAllProcs() {
  return useQuery({
    queryFn: () => Api.proc.getAll(),
    queryKey: ['proc', 'getAll'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
