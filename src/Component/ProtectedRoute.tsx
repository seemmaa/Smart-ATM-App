import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../Context/authSContext';

export default function ProtectedRoute() {
  const isAuth = useAuthStore((state) => state.isAuth);
  console.log(isAuth);
  return isAuth ? <Outlet /> : <Navigate to="/" />;
}
