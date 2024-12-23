import useSWR from 'swr';
import { useMemo } from 'react';
import { useAuthContext } from 'src/auth/hooks';
import { fetcher } from '../utils/axios';
import { HOST_API } from '../config-global';

export function useGetDiamondSizeWeightRate(defaultTemp) {
  const { user } = useAuthContext();
  let defaultTemplate = {};
  const URL = `${HOST_API}/api/company/${user?.company}/diamond`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  if (defaultTemp && data?.data.length > 0) {
    defaultTemplate = data?.data?.find((item) => item?.templateName === 'default');
  }
  const memoizedValue = useMemo(
    () => ({
      diamondSizeWeightRate: defaultTemp ? defaultTemplate : data?.data || [],
      diamondSizeWeightRateLoading: isLoading,
      diamondSizeWeightRateError: error,
      diamondSizeWeightRateValidating: isValidating,
      diamondSizeWeightRateEmpty: !isLoading && !defaultTemp ? defaultTemplate : data?.data?.length,
      mutate,
    }),
    [defaultTemp ? defaultTemplate : data?.data, error, isLoading, isValidating, mutate],
  );

  return memoizedValue;
}
