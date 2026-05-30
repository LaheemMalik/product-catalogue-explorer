import styles from './ProductCard.module.css';

function ProductCard({ product }) {
  const { title, price, thumbnail, rating, category } = product;

  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <img src={thumbnail} alt={title} loading="lazy" />
      </div>
      <div className={styles.body}>
        <span className={styles.category}>{category}</span>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.meta}>
          <span className={styles.price}>${price}</span>
          <span className={styles.rating}>★ {rating}</span>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;