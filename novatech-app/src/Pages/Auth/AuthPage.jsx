import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from '../../Components/Shared/Menu';
import { useAuth } from '../../Hooks/useAuth';
import styles from './AuthPage.module.scss';

export function AuthPage() {
  const [mode, setMode] = useState('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [deliveryNode, setDeliveryNode] = useState('Nodo Sur');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      if (mode === 'login') {
        await login(email, password);
        if (email.toLowerCase().includes('admin')) {
          navigate('/admin');
        } else {
          navigate('/carrito');
        }
      } else {
        await register(email, password, fullName, deliveryNode);
        setMessage('Cuenta creada. Ya puedes iniciar sesion.');
        setMode('login');
      }
    } catch (err) {
      setError(err.message || 'Error de autenticacion');
    }
  };

  return (
    <Menu>
      <div className={styles.center}>
        <div className={styles.card}>
          <div className={styles.tabs}>
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`${styles.tabBtn} ${mode === 'login' ? styles.tabActive : ''}`}
            >
              Iniciar Sesion
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`${styles.tabBtn} ${mode === 'register' ? styles.tabActive : ''}`}
            >
              Crear Cuenta
            </button>
          </div>

          <p className={styles.muted}>
            {mode === 'login'
              ? 'Usa un correo con la palabra admin para acceder al panel de despacho.'
              : 'Registra tu perfil y selecciona tu nodo de entrega en la red.'}
          </p>

          {error && <p className={styles.errorMsg}>{error}</p>}
          {message && <p className={styles.infoMsg}>{message}</p>}

          <form onSubmit={handleSubmit} className={styles.form}>
            {mode === 'register' && (
              <>
                <label>Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ej. Aiko Kurokawa"
                />
              </>
            )}

            <label>Correo Electronico</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@uao.edu.co"
            />

            <label>Contrasena</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimo 6 caracteres"
            />

            {mode === 'register' && (
              <>
                <label>Nodo de Destino (Grafo)</label>
                <select
                  value={deliveryNode}
                  onChange={(e) => setDeliveryNode(e.target.value)}
                >
                  <option value="Nodo Sur">Nodo Sur</option>
                  <option value="Nodo Norte">Nodo Norte</option>
                  <option value="Nodo Centro">Nodo Centro</option>
                </select>
              </>
            )}

            <button type="submit" className={styles.submitBtn}>
              {mode === 'login' ? 'Ingresar' : 'Registrar Cuenta'}
            </button>
          </form>
        </div>
      </div>
    </Menu>
  );
}