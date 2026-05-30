import { useState, useEffect } from 'react';
import { useProducts } from './hooks/useProducts';
import { useCategories } from './hooks/useCategories';
import { useDebounce } from './hooks/useDebounce';
import { useUrlState } from './hooks/useUrlState';
import { sanitizeSearch } from './utils/validate';
import ActiveFilters from './components/ActiveFilters/ActiveFilters';
import ProductGrid from './components/ProductGrid/ProductGrid';
import SkeletonGrid from './components/Skeleton/Skeleton';
import ErrorState from './components/ErrorState/ErrorState';
import EmptyState from './components/EmptyState/EmptyState';
import SearchBar from './components/SearchBar/SearchBar';
import FilterPanel from './components/FilterPanel/FilterPanel';
import SortDropdown from './components/SortDropdown/SortDropdown';
import styles from './App.module.css';

function App() {
  const [urlState, updateUrl] = useUrlState();
  const [searchInput, setSearchInput] = useState(urlState.search);

  const debounced = useDebounce(searchInput, 350);
  const cleanedSearch = sanitizeSearch(debounced);

  // Push the debounced/cleaned search into the URL.
  useEffect(() => {
    if (cleanedSearch !== urlState.search) {
      updateUrl({ search: cleanedSearch });
    }
  }, [cleanedSearch, urlState.search, updateUrl]);

  // Keep the input in sync when the URL changes from back/forward navigation.
  useEffect(() => {
    setSearchInput(urlState.search);
  }, [urlState.search]);

  const categories = useCategories();

  const { status, products, error, retry, total } = useProducts({
    search: urlState.search,
    category: urlState.search ? '' : urlState.category,
    sort: urlState.sort,
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
          selected={urlState.category}
          onChange={(c) => updateUrl({ category: c })}
        />

        <div className={styles.content}>
          <div className={styles.toolbar}>
            <span className={styles.count}>
              {status === 'success' ? `${total} products` : ''}
            </span>
            <SortDropdown
              value={urlState.sort}
              onChange={(s) => updateUrl({ sort: s })}
            />
          </div>
          <ActiveFilters
  search={urlState.search}
  category={urlState.category}
  onClearSearch={() => {
    setSearchInput('');
    updateUrl({ search: '' });
  }}
  onClearCategory={() => updateUrl({ category: '' })}
  onClearAll={() => {
    setSearchInput('');
    updateUrl({ search: '', category: '', sort: '' });
  }}
/>
          {status === 'loading' && <SkeletonGrid count={8} />}
          {status === 'error' && <ErrorState error={error} onRetry={retry} />}
          {status === 'empty' && (
            <EmptyState
              title={urlState.search ? `No results for "${urlState.search}"` : 'No products found.'}
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