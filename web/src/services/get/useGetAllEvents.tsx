import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';

export function useGetAllEvents() {
  return useQuery({
    queryFn: () => Api.event.getAll(),
    queryKey: ['event', 'getAll'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
