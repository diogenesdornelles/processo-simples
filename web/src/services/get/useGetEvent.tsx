import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';

export function useGetEvent(id: string, enabled = true) {
  return useQuery({
    queryFn: () => Api.event.get(id),
    queryKey: ['event', 'get', id],
    enabled: enabled && !!id,
  });
}
