import styles from './FilterPanel.module.css';

function FilterPanel({ categories, selected, onChange, isOpen, onClose }) {
  return (
    <>
      <div
        className={`${styles.backdrop} ${isOpen ? styles.backdropOpen : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}
        aria-label="Filters"
      >
        <div className={styles.head}>
          <h2 className={styles.heading}>Category</h2>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close filters"
          >
            ×
          </button>
        </div>
        <ul className={styles.list}>
          <li>
            <button
              type="button"
              className={`${styles.option} ${!selected ? styles.active : ''}`}
              onClick={() => onChange('')}
            >
              All
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat}>
              <button
                type="button"
                className={`${styles.option} ${selected === cat ? styles.active : ''}`}
                onClick={() => onChange(cat)}
              >
                {cat.replace(/-/g, ' ')}
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}

export default FilterPanel;