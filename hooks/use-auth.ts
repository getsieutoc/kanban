import { useSession } from '@/lib/auth-client';
import { UserWithPayload } from '@/types';
import useSWR from 'swr';

export const useAuth = () => {
  const { data: sessionData, isPending: isSessionPending, ...rest } = useSession();
  const { data: userData, isLoading: isUserLoading } = useSWR<UserWithPayload>(
    sessionData?.session ? '/api/me' : null
  );

  return {
    session: sessionData?.session,
    user: sessionData?.user,
    userData,
    isLoading: isSessionPending || isUserLoading,
    isPending: isSessionPending,
    ...rest,
  };
};
