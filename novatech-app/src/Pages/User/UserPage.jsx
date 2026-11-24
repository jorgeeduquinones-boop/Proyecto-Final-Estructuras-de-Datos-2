import { useState } from 'react';
import { Menu } from '../../Components/Shared/Menu';
import { useAuth } from '../../Hooks/useAuth';
import { useStore } from '../../Hooks/useStore';
import styles from './UserPage.module.scss';

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

  const routeInfo = calculateRoute(destination);

  const handleCheckout = async () => {
    const customerName = user?.user_metadata?.full_name || user?.email;
    const code = await submitOrder(customerName, destination);
    if (code) {
      setOrderNotice(`Orden ${code} enviada a la cola de despacho.`);
    }
  };

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatText.trim()) return;
    const sender = user?.user_metadata?.full_name || 'Cliente';
    await sendRealtimeMessage(sender, chatText);
    setChatText('');
  };

  return (
    <Menu>
      <div className={styles.dashboard}>
        <div className={styles.card}>
          <div className={styles.panelHead}>
            <h3>Orden Actual</h3>
            <button onClick={undoLastCartItem} className={styles.ghostBtn}>
              Deshacer Ultimo (Pop)
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
            Confirmar Compra (Enqueue)
          </button>

          {orderNotice && <p className={styles.feedback}>{orderNotice}</p>}
        </div>

        <div className={styles.rightStack}>
          <div className={styles.card}>
            <div className={styles.panelHead}>
              <h3>Red de Entrega (Grafo Ponderado)</h3>
              <span className={styles.goldOutline}>
                {routeInfo.distanceKm} km · {routeInfo.estimatedMinutes} min
              </span>
            </div>

            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className={styles.nodeSelect}
            >
              <option value="Nodo Sur">Destino: Nodo Sur</option>
              <option value="Nodo Norte">Destino: Nodo Norte</option>
              <option value="Nodo Centro">Destino: Nodo Centro</option>
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
                    {vertex}
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
              <h3>Canal en Vivo (Supabase Realtime)</h3>
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
          </div>
        </div>
      </div>
    </Menu>
  );
}