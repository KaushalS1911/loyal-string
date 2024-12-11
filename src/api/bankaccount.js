import useSWR from 'swr';
import { useMemo } from 'react';
import { useAuthContext } from 'src/auth/hooks';
import { fetcher } from '../utils/axios';
import { HOST_API } from '../config-global';

export function useGetBankAccount() {
  const { user } = useAuthContext();
  const URL = `${HOST_API}/api/company/${user?.company}/bank-account`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      bankAccount: data?.data || [],
      bankAccountLoading: isLoading,
      bankAccountError: error,
      bankAccountValidating: isValidating,
      bankAccountEmpty: !isLoading && !data?.data?.length,
      mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate],
  );

  return memoizedValue;
}
