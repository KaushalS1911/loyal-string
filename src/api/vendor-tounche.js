import useSWR from 'swr';
import { useMemo } from 'react';
import { useAuthContext } from 'src/auth/hooks';
import { fetcher } from '../utils/axios';
import { HOST_API } from '../config-global';

export function useGetVendorTounche() {
  const { user } = useAuthContext();
  const URL = `${HOST_API}/api/company/${user?.company}/vendor-tounche`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      vendorTounche: data?.data || [],
      vendorTouncheLoading: isLoading,
      vendorTouncheError: error,
      vendorTouncheValidating: isValidating,
      vendorTouncheEmpty: !isLoading && !data?.data?.length,
      mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate],
  );

  return memoizedValue;
}
