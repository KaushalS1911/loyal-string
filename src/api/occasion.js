import useSWR from 'swr';
import { useMemo } from 'react';
import { useAuthContext } from 'src/auth/hooks';
import { fetcher } from '../utils/axios';
import { HOST_API } from '../config-global';

export function useGetOccasion() {
  const { user } = useAuthContext();
  const URL = `${HOST_API}/api/company/${user?.company}/occasion`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      occasion: data?.data || [],
      occasionLoading: isLoading,
      occasionError: error,
      occasionValidating: isValidating,
      occasionEmpty: !isLoading && !data?.data?.length,
      mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate],
  );

  return memoizedValue;
}
