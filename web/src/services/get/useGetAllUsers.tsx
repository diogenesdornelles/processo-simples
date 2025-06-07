import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';

export function useGetAllUsers() {
  return useQuery({
    queryFn: () => Api.user.getAll(),
    queryKey: ['user', 'getAll'],
  });
}
