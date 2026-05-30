import { useState, useEffect, useCallback } from 'react';

function readFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const page = Number(params.get('page'));
  return {
    search: params.get('q') ?? '',
    category: params.get('category') ?? '',
    sort: params.get('sort') ?? '',
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

export function useUrlState() {
  const [state, setState] = useState(readFromUrl);

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
      if (next.page > 1) params.set('page', next.page);
      const qs = params.toString();
      const url = qs ? `?${qs}` : window.location.pathname;
      window.history.replaceState(null, '', url);
      return next;
    });
  }, []);

  return [state, update];
}