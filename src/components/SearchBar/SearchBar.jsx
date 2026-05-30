import styles from './SearchBar.module.css';

function SearchBar({ value, onChange, placeholder = 'Search products…' }) {
  return (
    <div className={styles.wrap}>
      <input
        type="search"
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search products"
        maxLength={100}
      />
    </div>
  );
}

export default SearchBar;