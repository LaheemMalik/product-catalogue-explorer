import styles from './App.module.css';

function App() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <h1 className={styles.logo}>Catalog</h1>
          <span className={styles.tagline}>Browse products</span>
        </div>
      </header>

      <main className={styles.main}>
        <p>Products will appear here.</p>
      </main>
    </div>
  );
}

export default App;