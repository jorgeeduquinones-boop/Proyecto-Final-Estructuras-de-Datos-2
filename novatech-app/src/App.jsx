import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';
import { StoreProvider } from './Context/StoreContext';
import { AppRoutes } from './Routes/AppRoutes';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <StoreProvider>
          <AppRoutes />
        </StoreProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;