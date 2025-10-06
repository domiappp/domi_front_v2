// routes/PrivateRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuthStore } from "../store/auth.store";
import { useSession } from "../services/useAuth";

type PrivateRouteProps = {
  redirectTo?: string;
  requireRole?: any;     // p.ej. "Administrador"
  requireModule?: string;   // p.ej. "dashboard"
  delayMs?: number;         // espera inicial para hidratación del store
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  redirectTo = "/login",
  requireRole,
  requireModule,
  delayMs = 300,
}) => {
  const location = useLocation();

  // 1) Hooks del store (orden fijo)
  const user         = useAuthStore(s => s.user);
  const setFromResp  = useAuthStore(s => s.setFromResponse);
  const clear        = useAuthStore(s => s.clear);

  // 2) Espera inicial (para persist/hidratación)
  const [waiting, setWaiting] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setWaiting(false), delayMs);
    return () => clearTimeout(t);
  }, [delayMs]);

  // 3) Hook remoto SIEMPRE llamado (usa enabled para no pedir si hay user o si seguimos esperando)
  const { data, isLoading, isError } = useSession({ enabled: !user && !waiting });

  // 4) Sincronización del store (una sola vez por montaje) + bandera de “listo”
  const syncedRef = useRef(false);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (syncedRef.current) return;   // ya procesado
    if (waiting) return;             // aún esperando hidratación

    if (user) {
      syncedRef.current = true;
      setAuthReady(true);
      return;
    }

    if (data) {
      setFromResp(data);
      syncedRef.current = true;
      setAuthReady(true);
      return;
    }

    if (isError) {
      clear();
      syncedRef.current = true;
      setAuthReady(true);
    }
  }, [waiting, user, data, isError, setFromResp, clear]);

  // 5) Cálculos de autorización SIEMPRE antes de cualquier return
  const sessionUser = user ?? (data as any) ?? null;

const hasRole = useMemo(() => {
  if (!requireRole) return true;

  // en tu sesión puede venir "rol" (string) o "roles" (array)
  const raw = (sessionUser as any)?.roles ?? (sessionUser as any)?.rol;

    const userRole: string | undefined = Array.isArray(raw) ? raw[0] : raw;

    if (!userRole) return false;

    return userRole.toLowerCase() === requireRole.toLowerCase();
  }, [requireRole, sessionUser]);

  const hasModule = useMemo(() => {
    if (!requireModule) return true;
    const modules: string[] = sessionUser?.modules ?? [];
    return modules.includes(requireModule);
  }, [requireModule, sessionUser]);

  // 6) Returns (sin vista) hasta que esté todo listo
  if (waiting || (!user && isLoading) || !authReady) {
    return null; // ⬅️ no muestra nada hasta que la sesión/store estén listos
  }

  const isAuthenticated = !!sessionUser;
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  if (!hasRole || !hasModule) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
