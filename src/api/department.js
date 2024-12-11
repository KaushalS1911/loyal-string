import useSWR from 'swr';
import { useMemo } from 'react';
import { useAuthContext } from 'src/auth/hooks';
import { fetcher } from '../utils/axios';
import { HOST_API } from '../config-global';

export function useGetDepartment() {
  const { user } = useAuthContext();
  const URL = `${HOST_API}/api/company/${user?.company}/department`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      department: data?.data || [],
      departmentLoading: isLoading,
      departmentError: error,
      departmentValidating: isValidating,
      departmentEmpty: !isLoading && !data?.data?.length,
      mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate],
  );

  return memoizedValue;
}
