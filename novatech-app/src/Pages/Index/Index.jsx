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
        <span className={styles.label}>Categorias (Arbol N-ario):</span>
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
            <h3>Historial (Pila LIFO)</h3>
            <span className={styles.goldBadge}>Top</span>
          </div>
          <p className={styles.muted}>
            Ultimo hardware inspeccionado aparece primero.
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