import useSWR from 'swr';
import { useMemo } from 'react';
import { useAuthContext } from 'src/auth/hooks';
import { fetcher } from '../utils/axios';
import { HOST_API } from '../config-global';

export function useGetRoles() {
  const { user } = useAuthContext();
  const storedBranch = sessionStorage.getItem('selectedBranch');
  let parsedBranch = storedBranch;

  if (storedBranch !== 'all') {
    try {
      parsedBranch = JSON.parse(storedBranch);
    } catch (error) {
      console.error('Error parsing storedBranch:', error);
    }
  }

  const URL = `${HOST_API}/api/company/${user?.company}/roles`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const filteredRoles = useMemo(() => {
    if (!data?.data || storedBranch === 'all') {
      return data?.data || [];
    }
    return data.data.filter(
      (role) => role?.department?.branch === parsedBranch,
    );
  }, [data?.data, storedBranch, parsedBranch]);

  const memoizedValue = useMemo(
    () => ({
      roles: filteredRoles,
      rolesLoading: isLoading,
      rolesError: error,
      rolesValidating: isValidating,
      rolesEmpty: !isLoading && !filteredRoles.length,
      mutate,
    }),
    [filteredRoles, error, isLoading, isValidating, mutate],
  );

  return memoizedValue;
}
