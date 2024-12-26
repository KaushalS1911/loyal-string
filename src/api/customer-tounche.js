import useSWR from 'swr';
import { useMemo } from 'react';
import { useAuthContext } from 'src/auth/hooks';
import { fetcher } from '../utils/axios';
import { HOST_API } from '../config-global';

export function useGetCustomerTounche() {
  const { user } = useAuthContext();
  const URL = `${HOST_API}/api/company/${user?.company}/customer-tounche`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      customerTounche: data?.data || [],
      customerTouncheLoading: isLoading,
      customerTouncheError: error,
      customerTouncheValidating: isValidating,
      customerTouncheEmpty: !isLoading && !data?.data?.length,
      mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate],
  );

  return memoizedValue;
}
