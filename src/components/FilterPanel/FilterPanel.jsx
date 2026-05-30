import styles from './FilterPanel.module.css';

function FilterPanel({ categories, selected, onChange }) {
  return (
    <aside className={styles.panel}>
      <h2 className={styles.heading}>Category</h2>
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
  );
}

export default FilterPanel;