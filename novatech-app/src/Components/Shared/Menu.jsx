import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Hooks/useAuth';
import { useStore } from '../../Hooks/useStore';
import styles from './Menu.module.scss';

export function Menu({ children }) {
  const { user, isAdmin, logout } = useAuth();
  const { cart, searchQuery, setSearchQuery } = useStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className={styles.shell}>
      <aside className={styles.rail}>
        <div className={styles.brandBox}>
          <span className={styles.brandMark}>NT</span>
          <div>
            <div className={styles.brandTitle}>NovaTech</div>
            <div className={styles.brandSub}>Hardware Store</div>
          </div>
        </div>

        <nav className={styles.navList}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
          >
            <span>Catalogo</span>
            <small>Equipos y perifericos</small>
          </NavLink>

          {!user && (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
            >
              <span>Acceso y Cuenta</span>
              <small>Ingresar o registrarse</small>
            </NavLink>
          )}

          {user && (
            <NavLink
              to="/carrito"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
            >
              <span>Carrito y Envio ({cart.length})</span>
              <small>Orden y seguimiento</small>
            </NavLink>
          )}

          {user && isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
            >
              <span>Panel de Despacho</span>
              <small>Gestion de pedidos</small>
            </NavLink>
          )}
        </nav>

        <div className={styles.footer}>
          <div className={styles.statusPill}>
            <span className={styles.dot}></span>
            <span>{user ? user.email : 'Modo Invitado'}</span>
          </div>
          {user && (
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Cerrar Sesion
            </button>
          )}
        </div>
      </aside>

      <div className={styles.mainWrapper}>
        <header className={styles.topbar}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Buscar productos, marcas o modelos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className={styles.goldTag}>
            Destacados: MacBook Pro · Keychron Q1
          </span>
        </header>

        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}