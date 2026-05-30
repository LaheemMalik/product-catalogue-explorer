import styles from './Pagination.module.css';

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <nav className={styles.wrap} aria-label="Pagination">
      <button
        type="button"
        className={styles.btn}
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
      >
        ← Previous
      </button>
      <span className={styles.indicator}>
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        className={styles.btn}
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
      >
        Next →
      </button>
    </nav>
  );
}

export default Pagination;