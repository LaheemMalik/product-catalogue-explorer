import { useState, useEffect } from 'react';
import { useProducts } from './hooks/useProducts';
import { useCategories } from './hooks/useCategories';
import { useDebounce } from './hooks/useDebounce';
import { useUrlState } from './hooks/useUrlState';
import { sanitizeSearch } from './utils/validate';
import ProductGrid from './components/ProductGrid/ProductGrid';
import SkeletonGrid from './components/Skeleton/Skeleton';
import ErrorState from './components/ErrorState/ErrorState';
import EmptyState from './components/EmptyState/EmptyState';
import SearchBar from './components/SearchBar/SearchBar';
import FilterPanel from './components/FilterPanel/FilterPanel';
import SortDropdown from './components/SortDropdown/SortDropdown';
import ActiveFilters from './components/ActiveFilters/ActiveFilters';
import Pagination from './components/Pagination/Pagination';
import styles from './App.module.css';

const PAGE_SIZE = 20;

function App() {
  const [urlState, updateUrl] = useUrlState();
  const [searchInput, setSearchInput] = useState(urlState.search);

  const debounced = useDebounce(searchInput, 350);
  const cleanedSearch = sanitizeSearch(debounced);

  useEffect(() => {
    if (cleanedSearch !== urlState.search) {
      updateUrl({ search: cleanedSearch, page: 1 });
    }
  }, [cleanedSearch, urlState.search, updateUrl]);

  useEffect(() => {
    setSearchInput(urlState.search);
  }, [urlState.search]);

  // Scroll to the top when paging so the user sees the new page.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [urlState.page]);

  const categories = useCategories();

  const skip = (urlState.page - 1) * PAGE_SIZE;
  const { status, products, error, retry, total } = useProducts({
    search: urlState.search,
    category: urlState.search ? '' : urlState.category,
    sort: urlState.sort,
    limit: PAGE_SIZE,
    skip,
  });

  // If filters shrink the result set below the current page, snap back to page 1.
  useEffect(() => {
    if (status === 'empty' && urlState.page > 1) {
      updateUrl({ page: 1 });
    }
  }, [status, urlState.page, updateUrl]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

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
          onChange={(c) => updateUrl({ category: c, page: 1 })}
        />

        <div className={styles.content}>
          <div className={styles.toolbar}>
            <span className={styles.count}>
              {status === 'success' ? `${total} products` : ''}
            </span>
            <SortDropdown
              value={urlState.sort}
              onChange={(s) => updateUrl({ sort: s, page: 1 })}
            />
          </div>

          <ActiveFilters
            search={urlState.search}
            category={urlState.category}
            onClearSearch={() => {
              setSearchInput('');
              updateUrl({ search: '', page: 1 });
            }}
            onClearCategory={() => updateUrl({ category: '', page: 1 })}
            onClearAll={() => {
              setSearchInput('');
              updateUrl({ search: '', category: '', sort: '', page: 1 });
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
          {status === 'success' && (
            <>
              <ProductGrid products={products} />
              <Pagination
                page={urlState.page}
                totalPages={totalPages}
                onChange={(p) => updateUrl({ page: p })}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;