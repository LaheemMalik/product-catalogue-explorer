import styles from './ActiveFilters.module.css';

function Pill({ label, onRemove }) {
  return (
    <span className={styles.pill}>
      <span>{label}</span>
      <button type="button" onClick={onRemove} aria-label={`Remove ${label}`}>
        ×
      </button>
    </span>
  );
}

function ActiveFilters({ search, category, onClearSearch, onClearCategory, onClearAll }) {
  if (!search && !category) return null;

  return (
    <div className={styles.wrap}>
      {search && <Pill label={`"${search}"`} onRemove={onClearSearch} />}
      {category && (
        <Pill label={category.replace(/-/g, ' ')} onRemove={onClearCategory} />
      )}
      <button type="button" className={styles.clearAll} onClick={onClearAll}>
        Clear all
      </button>
    </div>
  );
}

export default ActiveFilters;