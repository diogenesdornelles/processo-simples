import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';

export function useGetMe() {
  return useQuery({
    queryFn: () => Api.auth.me(),
    queryKey: ['auth', 'me'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
