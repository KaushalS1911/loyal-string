import useSWR from 'swr';
import { useMemo } from 'react';
import { useAuthContext } from 'src/auth/hooks';
import { fetcher } from '../utils/axios';
import { HOST_API } from '../config-global';

export function useGetStone() {
  const { user } = useAuthContext();
  const URL = `${HOST_API}/api/company/${user?.company}/stone`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      stone: data?.data || [],
      stoneLoading: isLoading,
      stoneError: error,
      stoneValidating: isValidating,
      stoneEmpty: !isLoading && !data?.data?.length,
      mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate],
  );

  return memoizedValue;
}
