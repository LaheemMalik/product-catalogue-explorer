import styles from './EmptyState.module.css';

function EmptyState({
  title = 'No products found.',
  body = 'Try a different search or filter.',
}) {
  return (
    <div className={styles.wrap}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.body}>{body}</p>
    </div>
  );
}

export default EmptyState;