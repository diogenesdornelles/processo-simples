import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';

export function useGetProc(id: string, enabled = true) {
  return useQuery({
    queryFn: () => Api.proc.get(id),
    queryKey: ['proc', 'get', id],
    enabled: enabled && !!id,
  });
}
