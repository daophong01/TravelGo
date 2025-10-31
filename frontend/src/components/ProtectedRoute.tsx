// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentUser } from '../lib/auth';

export default function ProtectedRoute() {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/signin" replace />;
  return <Outlet />;
}