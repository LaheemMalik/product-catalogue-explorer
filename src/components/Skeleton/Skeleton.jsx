import styles from './Skeleton.module.css';

function SkeletonCard() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={styles.image} />
      <div className={styles.body}>
        <div className={styles.lineShort} />
        <div className={styles.lineLong} />
        <div className={styles.lineLong} />
        <div className={styles.meta}>
          <div className={styles.linePrice} />
          <div className={styles.lineRating} />
        </div>
      </div>
    </div>
  );
}

function SkeletonGrid({ count = 8 }) {
  return (
    <div className={styles.grid} aria-busy="true" aria-label="Loading products">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export default SkeletonGrid;