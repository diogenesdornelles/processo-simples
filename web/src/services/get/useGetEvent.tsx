import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';

export function useGetEvent(id: number) {
  return useQuery({
    queryFn: () => Api.event.get(id),
    queryKey: ['event', 'get', id],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
