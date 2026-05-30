import { useProducts } from './hooks/useProducts';
import SkeletonGrid from './components/Skeleton/Skeleton';
import ProductGrid from './components/ProductGrid/ProductGrid';
import styles from './App.module.css';

function App() {
  const { status, products } = useProducts({ limit: 20, skip: 0 });

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
        {status === 'error' && <p>Something went wrong.</p>}
        {status === 'empty' && <p>No products found.</p>}
        {status === 'success' && <ProductGrid products={products} />}
      </main>
    </div>
  );
}

export default App;