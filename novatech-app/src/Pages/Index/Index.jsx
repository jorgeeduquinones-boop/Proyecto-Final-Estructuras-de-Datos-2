import { Menu } from '../../Components/Shared/Menu';
import { CardItem } from '../../Components/Index/CardItem';
import { useStore } from '../../Hooks/useStore';
import styles from './Index.module.scss';

export function Index() {
  const {
    filteredProducts,
    categoriesList,
    selectedCategory,
    setSelectedCategory,
    recentViews
  } = useStore();

  return (
    <Menu>
      <div className={styles.treeBar}>
        <span className={styles.label}>Categorias:</span>
        <div className={styles.pills}>
          {categoriesList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`${styles.pill} ${
                selectedCategory === cat.id ? styles.pillActive : ''
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.split}>
        <div className={styles.productsCol}>
          {filteredProducts.length === 0 ? (
            <p className={styles.muted}>No se encontraron equipos con ese filtro.</p>
          ) : (
            filteredProducts.map((product) => (
              <CardItem key={product.id} product={product} />
            ))
          )}
        </div>

        <aside className={styles.stackPanel}>
          <div className={styles.panelHead}>
            <h3>Vistos Recientemente</h3>
            <span className={styles.goldBadge}>Reciente</span>
          </div>
          <p className={styles.muted}>
            Ultimos equipos consultados en tu sesion.
          </p>
          <ul className={styles.stackList}>
            {recentViews.map((name, idx) => (
              <li key={`${name}-${idx}`}>
                <span>0{idx + 1}</span> {name}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </Menu>
  );
}