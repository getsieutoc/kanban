import { fetcher } from '@/lib/fetcher';

export const configs = {
  fetcher,
  suspend: true,
  keepPreviousData: true,
  revalidateOnMount: true,
};
