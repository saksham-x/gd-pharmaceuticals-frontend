import { useEffect, useState, type DependencyList } from "react";

// ========================================
// USE API
//
// Runs a request when the component
// mounts (and when `deps` change) and
// tracks its state. A response that
// arrives after the page changed is
// dropped.
// ========================================

export type ApiState<T> = {
  data: T | null;
  loading: boolean;
  error: unknown;
};

export function useApi<T>(request: () => Promise<T>, deps: DependencyList = []): ApiState<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    setState((previous) => ({ ...previous, loading: true, error: null }));

    request()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((error: unknown) => {
        console.error(error);
        if (!cancelled) setState({ data: null, loading: false, error });
      });

    return () => {
      cancelled = true;
    };
    // The caller lists what the request
    // depends on, like useEffect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
