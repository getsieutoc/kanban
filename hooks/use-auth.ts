import { useSession } from '@/lib/auth-client';
import { UserWithPayload } from '@/types';
import useSWR from 'swr';

export const useAuth = () => {
  const { data, isPending, ...rest } = useSession();

  const { data: profile, isLoading } = useSWR<UserWithPayload>('/api/me');

  return {
    session: data?.session,
    user: data?.user,
    isLoading: isPending || isLoading,
    isPending,
    profile,
    ...rest,
  };
};
