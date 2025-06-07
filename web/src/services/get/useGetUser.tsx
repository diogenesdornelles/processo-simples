import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';

export function useGetUser(id: string, enabled = true) {
  return useQuery({
    queryFn: () => Api.user.get(id),
    queryKey: ['user', 'get', id],
    enabled: enabled && !!id,
  });
}
