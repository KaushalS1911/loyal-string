import useSWR from 'swr';
import { useMemo } from 'react';
import { useAuthContext } from 'src/auth/hooks';
import { fetcher } from '../utils/axios';
import { HOST_API } from '../config-global';

export function useGetPurity() {
  const { user } = useAuthContext();
  const URL = `${HOST_API}/api/company/${user?.company}/purity`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      purity: data?.data || [],
      purityLoading: isLoading,
      purityError: error,
      purityValidating: isValidating,
      purityEmpty: !isLoading && !data?.data?.length,
      mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate],
  );

  return memoizedValue;
}

export function useGetDailyRates() {
  const { user } = useAuthContext();
  const URL = `${HOST_API}/api/company/${user?.company}/rate`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      dailyRates: data?.data || [],
      dailyRatesLoading: isLoading,
      dailyRatesError: error,
      dailyRatesValidating: isValidating,
      dailyRatesEmpty: !isLoading && !data?.data?.length,
      mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate],
  );

  return memoizedValue;
}
