import { useState } from 'react';
import { useProducts } from './hooks/useProducts';
import { useCategories } from './hooks/useCategories';
import { useDebounce } from './hooks/useDebounce';
import { sanitizeSearch } from './utils/validate';
import ProductGrid from './components/ProductGrid/ProductGrid';
import SkeletonGrid from './components/Skeleton/Skeleton';
import ErrorState from './components/ErrorState/ErrorState';
import EmptyState from './components/EmptyState/EmptyState';
import SearchBar from './components/SearchBar/SearchBar';
import FilterPanel from './components/FilterPanel/FilterPanel';
import styles from './App.module.css';

function App() {
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState('');

  const debouncedSearch = useDebounce(searchInput, 350);
  const cleanedSearch = sanitizeSearch(debouncedSearch);
  const categories = useCategories();

  const { status, products, error, retry, total } = useProducts({
    search: cleanedSearch,
    // An active search ignores the category filter (no combined endpoint upstream).
    category: cleanedSearch ? '' : category,
    sort: '',
    limit: 20,
    skip: 0,
  });

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <h1 className={styles.logo}>Catalog</h1>
            <span className={styles.tagline}>Browse products</span>
          </div>
          <SearchBar value={searchInput} onChange={setSearchInput} />
        </div>
      </header>

      <main className={styles.main}>
        <FilterPanel
          categories={categories}
          selected={category}
          onChange={setCategory}
        />

        <div className={styles.content}>
          <div className={styles.toolbar}>
            <span className={styles.count}>
              {status === 'success' ? `${total} products` : ''}
            </span>
          </div>

          {status === 'loading' && <SkeletonGrid count={8} />}
          {status === 'error' && <ErrorState error={error} onRetry={retry} />}
          {status === 'empty' && (
            <EmptyState
              title={cleanedSearch ? `No results for "${cleanedSearch}"` : 'No products found.'}
              body="Try a different search or category."
            />
          )}
          {status === 'success' && <ProductGrid products={products} />}
        </div>
      </main>
    </div>
  );
}

export default App;