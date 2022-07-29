import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type UseCancellableFetchArgs = {
  queryKey: string;
  url: string;
  timeout?: number;
};

/**
 * @NOTE This hook is not production ready. It provides an overlysimplified
 * abstraction for querying data to a REST endpoint and representing its
 * state in a declarative way.
 * In a real project, there are many more aspects that an abstraction like
 * this should consider:
 *
 *  - Different HTTP verbs and body params
 *  - HTTP Headers
 *  - Authentication tokens
 *  - Caching
 *  - Reactivity
 *  - etc
 *
 * For the sake of simplicity, I decided to keep this hook very small and
 * not incorporate any of the elements listed above.
 */
export const useCancellableFetch = ({
  queryKey,
  url,
  timeout = 2000,
}: UseCancellableFetchArgs) => {
  const queryClient = useQueryClient();

  const [isAborted, setIsAborted] = useState(false);

  const abort = async () => {
    await queryClient.cancelQueries([queryKey]);
    setIsAborted(true);
  };

  const { refetch, data, error, isError, isFetched, isFetching } = useQuery(
    [queryKey],
    async ({ signal }) => {
      const abortTimeout = setTimeout(() => {
        abort();
      }, timeout);

      try {
        const response = await fetch(url, {
          signal,
        });

        return response.json();
      } catch (err) {
        return Promise.reject(err);
      } finally {
        clearTimeout(abortTimeout);
      }
    },
    {
      enabled: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: 0,
      retry: false,
      cacheTime: 0,
      refetchInterval: 0,
    }
  );

  const request = async () => {
    setIsAborted(false);
    return await refetch();
  };

  return {
    request,
    abort,
    data,
    error,
    isError,
    isFetched,
    isFetching,
    isAborted,
  };
};
