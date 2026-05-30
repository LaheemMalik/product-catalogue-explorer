import { useProducts } from './hooks/useProducts';
import ProductGrid from './components/ProductGrid/ProductGrid';
import SkeletonGrid from './components/Skeleton/Skeleton';
import ErrorState from './components/ErrorState/ErrorState';
import EmptyState from './components/EmptyState/EmptyState';
import styles from './App.module.css';

function App() {
  const { status, products, error, retry } = useProducts({ limit: 20, skip: 0 });

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <h1 className={styles.logo}>Catalog</h1>
          <span className={styles.tagline}>Browse products</span>
        </div>
      </header>

      <main className={styles.main}>
        {status === 'loading' && <SkeletonGrid count={8} />}
        {status === 'error' && <ErrorState error={error} onRetry={retry} />}
        {status === 'empty' && <EmptyState />}
        {status === 'success' && <ProductGrid products={products} />}
      </main>
    </div>
  );
}

export default App;