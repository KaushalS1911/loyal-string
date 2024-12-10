import useSWR from 'swr';
import { useMemo } from 'react';
import { useAuthContext } from 'src/auth/hooks';
import { fetcher } from '../utils/axios';
import { HOST_API } from '../config-global';

export function useGetDiamondAttributes() {
  const { user } = useAuthContext();
  const URL = `${HOST_API}/api/company/${user?.company}/diamond-attributes`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      diamondAttributes: data?.data || [],
      diamondAttributesLoading: isLoading,
      diamondAttributesError: error,
      diamondAttributesValidating: isValidating,
      diamondAttributesEmpty: !isLoading && !data?.data?.length,
      mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate],
  );

  return memoizedValue;
}
