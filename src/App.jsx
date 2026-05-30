import { useState } from 'react';
import { useProducts } from './hooks/useProducts';
import { useDebounce } from './hooks/useDebounce';
import { sanitizeSearch } from './utils/validate';
import ProductGrid from './components/ProductGrid/ProductGrid';
import SkeletonGrid from './components/Skeleton/Skeleton';
import ErrorState from './components/ErrorState/ErrorState';
import EmptyState from './components/EmptyState/EmptyState';
import SearchBar from './components/SearchBar/SearchBar';
import styles from './App.module.css';

function App() {
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 350);
  const cleanedSearch = sanitizeSearch(debouncedSearch);

  const { status, products, error, retry } = useProducts({
    search: cleanedSearch,
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
        {status === 'loading' && <SkeletonGrid count={8} />}
        {status === 'error' && <ErrorState error={error} onRetry={retry} />}
        {status === 'empty' && (
          <EmptyState
            title={cleanedSearch ? `No results for "${cleanedSearch}"` : 'No products found.'}
            body="Try a different search."
          />
        )}
        {status === 'success' && <ProductGrid products={products} />}
      </main>
    </div>
  );
}

export default App;