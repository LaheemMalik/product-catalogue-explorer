import { useState, useEffect } from 'react';
import { getProducts } from '../api/products';

export function useProducts({ limit, skip }) {
  const [state, setState] = useState({
    status: 'loading',
    products: [],
    total: 0,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();
    setState((s) => ({ ...s, status: 'loading', error: null }));

    getProducts({ limit, skip, signal: controller.signal })
      .then((data) => {
        const products = data.products ?? [];
        setState({
          status: products.length ? 'success' : 'empty',
          products,
          total: data.total ?? 0,
          error: null,
        });
      })
      .catch((err) => {
        if (err.type === 'aborted') return; // stale request, ignore it
        setState({ status: 'error', products: [], total: 0, error: err });
      });

    return () => controller.abort();
  }, [limit, skip]);

  return state;
}