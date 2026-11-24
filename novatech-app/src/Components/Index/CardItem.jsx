import { useStore } from '../../Hooks/useStore';
import styles from './CardItem.module.scss';

export function CardItem({ product }) {
  const { inspectProduct, addToCart } = useStore();

  return (
    <article className={styles.card}>
      <div className={styles.codeBox}>{product.code}</div>
      <div className={styles.info}>
        <div className={styles.header}>
          <h4>{product.name}</h4>
          <span className={styles.score}>Score: {product.score}</span>
        </div>
        <p className={styles.specs}>{product.specs}</p>
        <div className={styles.bottom}>
          <strong className={styles.price}>${product.price}.00</strong>
          <div className={styles.actions}>
            <button
              className={styles.ghostBtn}
              onClick={() => inspectProduct(product.name)}
            >
              Inspeccionar
            </button>
            <button
              className={styles.primaryBtn}
              onClick={() => addToCart(product)}
            >
              Agregar
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}