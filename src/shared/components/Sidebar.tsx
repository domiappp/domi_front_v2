import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as Icons from "lucide-react";
import { LogOut } from "lucide-react";
import Swal from "sweetalert2";

import { MENU_ESTATICO, type MenuItem } from "../../utils/arrayMenu";
import { useAuthStore } from "../../store/auth.store";
import { useLogout } from "../../services/useAuth";
import { useSidebarStore } from "../../store/sidebar.store"; // 👈

function LucideIcon({
  name,
  className,
  color,
}: { name?: string; className?: string; color?: string }) {
  const Fallback = Icons.Menu;
  const IconComp = (name && (Icons as any)[name]) || Fallback;
  return <IconComp className={className} color={color} />;
}

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // sidebar state
  const isOpen = useSidebarStore((s) => s.isOpen);
  const closeSidebar = useSidebarStore((s) => s.close);

  // auth
  const user = useAuthStore((s) => s.user);
  const hasModule = useAuthStore((s) => s.hasModule);
  const hasRole = useAuthStore((s) => s.hasRole);
  const clear = useAuthStore((s) => s.clear);

  const [activeKey, setActiveKey] = useState<string | null>(null);
  const logout = useLogout();

  const items = useMemo(() => {
    const byPerms = (item: MenuItem) => {
      const okModule = item.requireModule ? hasModule(item.requireModule) : true;
      const okRole = item.requireRole ? hasRole(item.requireRole) : true;
      return okModule && okRole;
    };
    return MENU_ESTATICO
      .filter(byPerms)
      .sort((a, b) => ((a.orden ?? 9999) - (b.orden ?? 9999)));
  }, [hasModule, hasRole, user]);

  useEffect(() => {
    const current = items.find((i) => location.pathname.startsWith(i.ruta));
    setActiveKey(current?.nombre ?? null);
  }, [location.pathname, items]);

  const isActive = (name: string) => activeKey === name;
  const colorFor = (active: boolean) => (active ? "#0277bd" : "white");

  const goTo = (ruta: string, nombre: string) => {
    navigate(ruta);
    setActiveKey(nombre);
    // 👇 cierra en móvil al navegar (no afecta a desktop)
    if (window.innerWidth < 1024) closeSidebar();
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Tu sesión se cerrará y deberás iniciar nuevamente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });
    if (result.isConfirmed) {
      logout.mutate(undefined, {
        onSuccess: () => {
          clear();
          closeSidebar(); // 👈 cerrar en móvil por UX
          navigate("/login", { replace: true });
        },
        onError: (err) => {
          Swal.fire("Error", err.message, "error");
        },
      });
    }
  };

  return (
    <>
      {/* Panel */}
      <div
        className={[
          "fixed z-30 top-0 left-0 h-screen w-[300px] bg-[#33C6BB] flex flex-col justify-between overflow-y-auto",
          // móvil: off-canvas
          "transition-transform duration-300 transform",
          isOpen ? "translate-x-0" : "-translate-x-full",
          // desktop: siempre visible y estático
          "lg:relative lg:translate-x-0",
        ].join(" ")}
        aria-hidden={!isOpen}
      >
        <div>
          {/* Usuario */}
          <div className="flex items-center gap-3 p-4 border-b border-white/20">
            <img
              src="https://cdn-icons-png.flaticon.com/512/204/204191.png"
              alt="avatar"
              className="w-10 h-10 rounded-full border border-white/50"
            />
            <div className="text-white">
              <p className="font-semibold leading-tight">Usuario</p>
              <p className="text-sm text-white/70">{user?.rol ?? ""}</p>
            </div>
          </div>

          {/* Menú */}
          <div className="pt-4">
            {items.length > 0 ? (
              items.map((item) => {
                const active = isActive(item.nombre);
                return (
                  <div
                    key={item.nombre}
                    className={`group flex items-center gap-2 py-3 pr-3 cursor-pointer select-none transition-all
                      ${active
                        ? "text-[#0277bd] bg-gray-50 border-l-4 border-blue-300"
                        : "hover:bg-[#0277bd]/40 text-white"
                      }`}
                    style={{ paddingLeft: "16px" }}
                    onClick={() => goTo(item.ruta, item.nombre)}
                    role="button"
                    aria-current={active ? "page" : undefined}
                  >
                    <LucideIcon name={item.icono} className="w-4 h-4" color={colorFor(active)} />
                    <span className="flex-1 text-[15px] truncate">{item.nombre}</span>
                  </div>
                );
              })
            ) : (
              <p className="px-4 py-3 text-white/80 text-sm">No tienes módulos habilitados.</p>
            )}
          </div>
        </div>

        {/* Logout */}
        <div className="p-4">
          <button
            className="w-full flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white rounded-md py-2 transition"
            onClick={handleLogout}
            disabled={logout.isPending}
          >
            <LogOut className="w-4 h-4" />
            <span>{logout.isPending ? "Saliendo..." : "Salir"}</span>
          </button>
        </div>
      </div>

      {/* Overlay (solo móvil) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={closeSidebar}
          aria-hidden
        />
      )}
    </>
  );
};

export default Sidebar;
