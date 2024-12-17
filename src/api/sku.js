import useSWR from 'swr';
import { useMemo } from 'react';
import { useAuthContext } from 'src/auth/hooks';
import { fetcher } from '../utils/axios';
import { HOST_API } from '../config-global';

export function useGetSku() {
  const { user } = useAuthContext();
  const URL = `${HOST_API}/api/company/${user?.company}/sku`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      sku: data?.data || [],
      skuLoading: isLoading,
      skuError: error,
      skuValidating: isValidating,
      skuEmpty: !isLoading && !data?.data?.length,
      mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate],
  );

  return memoizedValue;
}
