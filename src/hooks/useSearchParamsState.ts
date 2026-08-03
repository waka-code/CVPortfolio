import { useCallback, useEffect, useMemo, useState } from 'react';

type ParamChanges = Record<string, string | null>;

/**
 * Reads the URL query string and keeps it in sync with React state.
 *
 * Updates use replaceState so that changing a filter does not pile up history
 * entries, while still surviving a page reload.
 */
export function useSearchParamsState() {
  const [search, setSearch] = useState(() => window.location.search);

  useEffect(() => {
    const sync = () => setSearch(window.location.search);
    window.addEventListener('popstate', sync);
    // Navigating to a section clears the filter params via replaceState, which fires
    // no popstate; it announces itself with a hashchange instead.
    window.addEventListener('hashchange', sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener('hashchange', sync);
    };
  }, []);

  const params = useMemo(() => new URLSearchParams(search), [search]);

  const setParams = useCallback((changes: ParamChanges) => {
    const next = new URLSearchParams(window.location.search);

    Object.entries(changes).forEach(([key, value]) => {
      if (value === null || value === '') {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });

    const queryString = next.toString();
    const nextSearch = queryString ? `?${queryString}` : '';
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${nextSearch}${window.location.hash}`
    );
    setSearch(nextSearch);
  }, []);

  return [params, setParams] as const;
}
