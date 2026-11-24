import { Menu } from '../../Components/Shared/Menu';
import { useStore } from '../../Hooks/useStore';
import styles from './AdminPage.module.scss';

export function AdminPage() {
  const { orders, dispatchNextOrder } = useStore();

  return (
    <Menu>
      <div className={styles.kpiRow}>
        <div className={`${styles.card} ${styles.kpi}`}>
          <span className={styles.muted}>En Cola (FIFO)</span>
          <strong>{orders.length}</strong>
        </div>
        <div className={`${styles.card} ${styles.kpi}`}>
          <span className={styles.muted}>Siguiente Orden</span>
          <strong>{orders[0] ? orders[0].order_code : 'Vacia'}</strong>
        </div>
        <div className={`${styles.card} ${styles.kpi}`}>
          <span className={styles.muted}>Base de Datos</span>
          <strong className={styles.goldText}>Supabase Realtime</strong>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.panelHead}>
          <div>
            <h3>Cola de Despacho de Pedidos</h3>
            <p className={styles.muted}>
              Atencion estricta por orden de llegada (First-In, First-Out)
            </p>
          </div>
          <button onClick={dispatchNextOrder} className={styles.primaryBtn}>
            Despachar Frente (Dequeue)
          </button>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Posicion</th>
              <th>Codigo</th>
              <th>Cliente</th>
              <th>Nodo Destino</th>
              <th>Total</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className={styles.muted}>
                  No hay pedidos pendientes en la cola.
                </td>
              </tr>
            ) : (
              orders.map((order, idx) => (
                <tr
                  key={order.id}
                  className={idx === 0 ? styles.frontRow : ''}
                >
                  <td>{idx === 0 ? 'Frente (#1)' : `#${idx + 1}`}</td>
                  <td>{order.order_code}</td>
                  <td>{order.customer_name}</td>
                  <td>{order.destination_node}</td>
                  <td>${order.total}</td>
                  <td>
                    <span className={styles.badgeWait}>
                      {idx === 0 ? 'Listo para salida' : 'En espera'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Menu>
  );
}