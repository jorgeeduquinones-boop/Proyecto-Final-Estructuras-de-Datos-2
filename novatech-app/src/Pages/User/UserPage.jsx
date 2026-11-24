import { useState } from 'react';
import { Menu } from '../../Components/Shared/Menu';
import { useAuth } from '../../Hooks/useAuth';
import { useStore } from '../../Hooks/useStore';
import styles from './UserPage.module.scss';

const ZONE_LABELS = {
  'Bodega Central': 'Bodega Central',
  'Nodo Sur': 'Zona Sur',
  'Nodo Norte': 'Zona Norte',
  'Nodo Centro': 'Zona Centro'
};

export function UserPage() {
  const { user } = useAuth();
  const {
    cart,
    cartTotal,
    undoLastCartItem,
    calculateRoute,
    submitOrder,
    messages,
    sendRealtimeMessage
  } = useStore();

  const defaultNode = user?.user_metadata?.delivery_node || 'Nodo Sur';
  const [destination, setDestination] = useState(defaultNode);
  const [chatText, setChatText] = useState('');
  const [orderNotice, setOrderNotice] = useState('');
  const [chatNotice, setChatNotice] = useState('');

  const routeInfo = calculateRoute(destination);

  const handleCheckout = async () => {
    setOrderNotice('');
    try {
      const customerName = user?.user_metadata?.full_name || user?.email;
      const code = await submitOrder(customerName, destination);
      if (code) {
        setOrderNotice(`Orden ${code} confirmada y enviada a despacho.`);
      }
    } catch (err) {
      setOrderNotice(`Error al confirmar: ${err.message}`);
    }
  };

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatText.trim()) return;
    setChatNotice('');
    try {
      const sender = user?.user_metadata?.full_name || 'Cliente';
      await sendRealtimeMessage(sender, chatText);
      setChatText('');
    } catch (err) {
      setChatNotice(`Error al enviar: ${err.message}`);
    }
  };

  return (
    <Menu>
      <div className={styles.dashboard}>
        <div className={styles.card}>
          <div className={styles.panelHead}>
            <h3>Orden Actual</h3>
            <button onClick={undoLastCartItem} className={styles.ghostBtn}>
              Quitar Ultimo
            </button>
          </div>

          {cart.length === 0 ? (
            <p className={styles.muted}>Tu carrito esta vacio.</p>
          ) : (
            <ul className={styles.orderItems}>
              {cart.map((item, idx) => (
                <li key={`${item.id}-${idx}`}>
                  <span>{item.name}</span>
                  <strong>${item.price}.00</strong>
                </li>
              ))}
            </ul>
          )}

          <div className={styles.summaryBar}>
            <span>Total Transaccion</span>
            <strong>${cartTotal}.00</strong>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className={`${styles.primaryBtn} ${styles.full}`}
          >
            Confirmar Compra
          </button>

          {orderNotice && <p className={styles.feedback}>{orderNotice}</p>}
        </div>

        <div className={styles.rightStack}>
          <div className={styles.card}>
            <div className={styles.panelHead}>
              <h3>Ruta de Entrega</h3>
              <span className={styles.goldOutline}>
                {routeInfo.distanceKm} km · {routeInfo.estimatedMinutes} min
              </span>
            </div>

            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className={styles.nodeSelect}
            >
              <option value="Nodo Sur">Destino: Zona Sur</option>
              <option value="Nodo Norte">Destino: Zona Norte</option>
              <option value="Nodo Centro">Destino: Zona Centro</option>
            </select>

            <div className={styles.routeTrack}>
              {routeInfo.path.map((vertex, idx) => (
                <div
                  key={vertex}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <span
                    className={`${styles.vertex} ${
                      idx === routeInfo.path.length - 1 ? styles.target : ''
                    }`}
                  >
                    {ZONE_LABELS[vertex] || vertex}
                  </span>
                  {idx < routeInfo.path.length - 1 && (
                    <span className={styles.arc}>--&gt;</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.panelHead}>
              <h3>Soporte en Vivo</h3>
              <span className={styles.liveBadge}>En linea</span>
            </div>

            <div className={styles.chatFeed}>
              {messages.map((msg) => (
                <p key={msg.id}>
                  <strong>{msg.sender}:</strong> {msg.content}
                </p>
              ))}
            </div>

            <form onSubmit={handleSendChat} className={styles.chatControls}>
              <input
                type="text"
                value={chatText}
                onChange={(e) => setChatText(e.target.value)}
                placeholder="Enviar mensaje al despacho..."
              />
              <button type="submit" className={styles.primaryBtn}>
                Enviar
              </button>
            </form>

            {chatNotice && <p className={styles.feedback}>{chatNotice}</p>}
          </div>
        </div>
      </div>
    </Menu>
  );
}