import useSWR from 'swr';
import { useMemo } from 'react';
import { useAuthContext } from 'src/auth/hooks';
import { fetcher } from '../utils/axios';
import { HOST_API } from '../config-global';

export function useGetVendor() {
  const { user } = useAuthContext();
  const URL = `${HOST_API}/api/company/${user?.company}/vendor`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      vendor: data?.data || [],
      vendorLoading: isLoading,
      vendorError: error,
      vendorValidating: isValidating,
      vendorEmpty: !isLoading && !data?.data?.length,
      mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate],
  );

  return memoizedValue;
}
