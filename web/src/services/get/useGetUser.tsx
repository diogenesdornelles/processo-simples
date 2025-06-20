import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';

export function useGetUser(id: number) {
  return useQuery({
    queryFn: () => Api.user.get(id),
    queryKey: ['user', 'get', id],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
