import useSWR from 'swr';
import { useMemo } from 'react';
import { useAuthContext } from 'src/auth/hooks';
import { fetcher } from '../utils/axios';
import { HOST_API } from '../config-global';

export function useGetDiamondSizeWeightRate() {
  const { user } = useAuthContext();
  const URL = `${HOST_API}/api/company/${user?.company}/diamond`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      diamondSizeWeightRate: data?.data || [],
      diamondSizeWeightRateLoading: isLoading,
      diamondSizeWeightRateError: error,
      diamondSizeWeightRateValidating: isValidating,
      diamondSizeWeightRateEmpty: !isLoading && !data?.data?.length,
      mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate],
  );

  return memoizedValue;
}
