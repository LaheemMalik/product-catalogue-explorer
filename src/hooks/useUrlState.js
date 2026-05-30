import { useState, useEffect, useCallback } from 'react';

function readFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return {
    search: params.get('q') ?? '',
    category: params.get('category') ?? '',
    sort: params.get('sort') ?? '',
  };
}

export function useUrlState() {
  const [state, setState] = useState(readFromUrl);

  // Re-read state when the user navigates with the browser back/forward buttons.
  useEffect(() => {
    const onPop = () => setState(readFromUrl());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const update = useCallback((partial) => {
    setState((prev) => {
      const next = { ...prev, ...partial };
      const params = new URLSearchParams();
      if (next.search) params.set('q', next.search);
      if (next.category) params.set('category', next.category);
      if (next.sort) params.set('sort', next.sort);
      const qs = params.toString();
      const url = qs ? `?${qs}` : window.location.pathname;
      window.history.replaceState(null, '', url);
      return next;
    });
  }, []);

  return [state, update];
}