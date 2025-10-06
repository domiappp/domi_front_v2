// routes/PublicOnlyRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

const PublicOnlyRoute: React.FC<{ redirectTo?: string }> = ({ redirectTo = "/domicilios-pitalito" }) => {
  const isAuthenticated = !!useAuthStore((s) => s.user);
  return isAuthenticated ? <Navigate to={redirectTo} replace /> : <Outlet />;
};

export default PublicOnlyRoute;
