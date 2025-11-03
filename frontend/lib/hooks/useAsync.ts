import { useState, useCallback } from 'react';

export interface UseAsyncReturn<T, Args extends any[]> {
  execute: (...args: Args) => Promise<void>;
  data: T | null;
  loading: boolean;
  error: Error | null;
  reset: () => void;
}

/**
 * Generic hook for handling async operations
 */
export function useAsync<T, Args extends any[]>(
  asyncFunction: (...args: Args) => Promise<T>
): UseAsyncReturn<T, Args> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (...args: Args) => {
      try {
        setLoading(true);
        setError(null);
        const result = await asyncFunction(...args);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { execute, data, loading, error, reset };
}
