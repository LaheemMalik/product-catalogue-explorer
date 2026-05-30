import { useState, useEffect } from 'react';
import { getCategoryList } from '../api/products';

export function useCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    getCategoryList({ signal: controller.signal })
      .then(setCategories)
      .catch((err) => {
        // Categories aren't critical — the app still works without filters.
        if (err.type !== 'aborted') setCategories([]);
      });
    return () => controller.abort();
  }, []);

  return categories;
}