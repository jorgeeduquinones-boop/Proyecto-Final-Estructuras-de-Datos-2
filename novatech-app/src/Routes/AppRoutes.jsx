import { Navigate, Route, Routes } from 'react-router-dom';
import { Index } from '../Pages/Index/Index';
import { AuthPage } from '../Pages/Auth/AuthPage';
import { UserPage } from '../Pages/User/UserPage';
import { AdminPage } from '../Pages/Admin/AdminPage';
import { UserRoutes } from './UserRoutes';
import { AdminRoutes } from './AdminRoutes';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<AuthPage />} />
      <Route
        path="/carrito"
        element={
          <UserRoutes>
            <UserPage />
          </UserRoutes>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoutes>
            <AdminPage />
          </AdminRoutes>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}