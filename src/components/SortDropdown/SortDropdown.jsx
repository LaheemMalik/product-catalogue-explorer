import styles from './SortDropdown.module.css';

const OPTIONS = [
  { value: '', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Top Rated' },
  { value: 'title-asc', label: 'Name: A–Z' },
];

function SortDropdown({ value, onChange }) {
  return (
    <label className={styles.wrap}>
      <span className={styles.label}>Sort by</span>
      <select
        className={styles.select}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </label>
  );
}

export default SortDropdown;