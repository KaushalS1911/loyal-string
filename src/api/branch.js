import useSWR from 'swr';
import { useMemo } from 'react';
import { useAuthContext } from 'src/auth/hooks';
import { fetcher } from '../utils/axios';
import { ASSETS_API } from '../config-global';

export function useGetBranch() {
  const { user } = useAuthContext();
  const URL = `${ASSETS_API}/api/company/${user?.company}/branch`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      branch: data?.data || [],
      branchLoading: isLoading,
      branchError: error,
      branchValidating: isValidating,
      branchEmpty: !isLoading && !data?.data?.length,
      mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate],
  );

  return memoizedValue;
}
