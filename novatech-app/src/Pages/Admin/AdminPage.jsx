import { Menu } from '../../Components/Shared/Menu';
import { useStore } from '../../Hooks/useStore';
import styles from './AdminPage.module.scss';

const ZONE_LABELS = {
  'Nodo Sur': 'Zona Sur',
  'Nodo Norte': 'Zona Norte',
  'Nodo Centro': 'Zona Centro'
};

export function AdminPage() {
  const { orders, dispatchNextOrder } = useStore();

  return (
    <Menu>
      <div className={styles.kpiRow}>
        <div className={`${styles.card} ${styles.kpi}`}>
          <span className={styles.muted}>Pedidos Pendientes</span>
          <strong>{orders.length}</strong>
        </div>
        <div className={`${styles.card} ${styles.kpi}`}>
          <span className={styles.muted}>Siguiente en Despacho</span>
          <strong>{orders[0] ? orders[0].order_code : 'Sin pedidos'}</strong>
        </div>
        <div className={`${styles.card} ${styles.kpi}`}>
          <span className={styles.muted}>Estado del Sistema</span>
          <strong className={styles.goldText}>Sincronizado</strong>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.panelHead}>
          <div>
            <h3>Bandeja de Despacho</h3>
            <p className={styles.muted}>
              Atencion por orden de llegada de clientes
            </p>
          </div>
          <button onClick={dispatchNextOrder} className={styles.primaryBtn}>
            Despachar Siguiente
          </button>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Turno</th>
              <th>Codigo</th>
              <th>Cliente</th>
              <th>Zona de Entrega</th>
              <th>Total</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className={styles.muted}>
                  No hay pedidos pendientes por despachar.
                </td>
              </tr>
            ) : (
              orders.map((order, idx) => (
                <tr
                  key={order.id}
                  className={idx === 0 ? styles.frontRow : ''}
                >
                  <td>{idx === 0 ? 'Siguiente (#1)' : `#${idx + 1}`}</td>
                  <td>{order.order_code}</td>
                  <td>{order.customer_name}</td>
                  <td>{ZONE_LABELS[order.destination_node] || order.destination_node}</td>
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