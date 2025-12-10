// routes/PublicOnlyRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { useEffect, useRef, useState } from "react";
import { useSession } from "../services/useAuth";

const PublicOnlyRoute: React.FC<{ redirectTo?: string; delayMs?: number }> = ({
  redirectTo = "/domicilios-pitalito", // fallback si el rol es raro
  delayMs = 300,
}) => {
  // 1) Store
  const user        = useAuthStore((s) => s.user);
  const setFromResp = useAuthStore((s) => s.setFromResponse);
  const clear       = useAuthStore((s) => s.clear);

  // 2) Pequeño delay inicial (igual idea que en PrivateRoute)
  const [waiting, setWaiting] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setWaiting(false), delayMs);
    return () => clearTimeout(t);
  }, [delayMs]);

  // 3) Llamamos a useSession SOLO si:
  //    - no hay user en el store
  //    - y ya no estamos en el delay inicial
  const { data, isLoading, isError } = useSession({
    enabled: !user && !waiting,
  });

  // 4) Sincronizar una sola vez con el store
  const syncedRef = useRef(false);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (syncedRef.current) return;
    if (waiting) return;

    if (user) {
      // Ya hay usuario en el store (ej: acabas de loguearte)
      syncedRef.current = true;
      setAuthReady(true);
      return;
    }

    if (data) {
      // Hay sesión válida en el backend → llenamos el store
      setFromResp(data);
      syncedRef.current = true;
      setAuthReady(true);
      return;
    }

    if (isError) {
      // No hay sesión o falló → limpiamos y seguimos como público
      clear();
      syncedRef.current = true;
      setAuthReady(true);
    }
  }, [waiting, user, data, isError, setFromResp, clear]);

  // 5) Mientras todo se resuelve, no mostramos nada
  if (waiting || (!user && isLoading) || !authReady) {
    return null;
  }

  // 6) Decisión final: si hay user → redirijo según rol
  const sessionUser = user;

  if (sessionUser) {
    if (sessionUser.rol === "administrador") {
      return <Navigate to="/dashboard" replace />;
    }

    if (sessionUser.rol === "comercio") {
      return <Navigate to="/productos" replace />;
    }

    // Rol desconocido → fallback
    return <Navigate to={redirectTo} replace />;
  }

  // 7) No hay usuario (ni en backend ni en store) → puede ver login
  return <Outlet />;
};

export default PublicOnlyRoute;
