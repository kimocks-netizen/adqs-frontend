import { Navigate, Outlet } from 'react-router-dom';

export function ProtectedRoute() {
  const isAdmin = sessionStorage.getItem('adqs_admin') === '1';
  if (!isAdmin) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}
