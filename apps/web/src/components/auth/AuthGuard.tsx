import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/auth-store";
import { UserRole } from "@/types";

interface AuthGuardProps {
  allowedRoles?: UserRole[];
}

export const AuthGuard = ({ allowedRoles }: AuthGuardProps) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // 1. Cek Login
  if (!isAuthenticated || !user) {
    // Redirect ke login, tapi simpan lokasi saat ini agar bisa balik lagi nanti
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Cek Role Access (RBAC)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // User login tapi tidak punya akses ke halaman ini
    return <Navigate to="/unauthorized" replace />;
  }

  // 3. Render Halaman
  return <Outlet />;
};