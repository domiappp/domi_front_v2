import React from "react";
import { ShoppingCart, MapPin, Menu, X, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const BRAND = {
  primary: "#FF6B00",      // naranja principal
  primaryDark: "#E65A00",  // variante más oscura
  primarySoft: "#FF8A33",  // variante más suave
  ink: "#FFFFFF",          // texto blanco
  inkSoft: "#fefefe",      // texto blanco suave
  borderLight: "rgba(255,255,255,0.25)",
  danger: "#FFD4D4",
};

interface NavLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  url?: string;
}

const NavLink: React.FC<NavLinkProps> = ({
  url = "/",
  className = "",
  children,
  ...props
}) => (
  <Link
    to={url}
    className={
      "text-sm md:text-[15px] font-semibold transition-colors text-white hover:text-white/80 " +
      className
    }
    {...props}
  >
    {children}
  </Link>
);

const Navbar: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const close = () => setOpen(false);

  return (
    <header
      className="sticky top-0 z-50 w-full border-b shadow-xl backdrop-blur-xl"
      style={{
        background: `linear-gradient(135deg, ${BRAND.primary} 0%, ${BRAND.primaryDark} 50%, ${BRAND.primarySoft} 100%)`,
        borderColor: BRAND.borderLight,
      }}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-1.5 lg:py-4"
        aria-label="Principal"
      >
        {/* Izquierda */}
        <div className="flex min-w-0 items-center gap-3">
          <a
            href="/"
            className="group inline-flex items-center gap-2"
            aria-label="Inicio"
          >
            <div className="flex items-center gap-1 uppercase">
              <span
                className="truncate text-xl sm:text-2xl tracking-tight font-semibold"
                style={{ color: BRAND.ink }}
              >
                Domicilios
              </span>
              <span
                className="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-[0_4px_14px_rgba(0,0,0,0.22)]"
                style={{ color: "#FFFFFF" }}
              >
                W
              </span>
            </div>
          </a>
        </div>

        {/* Centro (desktop) */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink url="/">Inicio</NavLink>
          <NavLink url="/contacto">Contacto</NavLink>

          <span
            className="hidden lg:inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs sm:text-sm shadow-md border"
            style={{
              borderColor: BRAND.borderLight,
              backgroundColor: "rgba(255,255,255,0.18)",
              color: BRAND.ink,
            }}
          >
            <MapPin size={16} style={{ color: "#FFFFFF" }} />
            <span className="font-medium tracking-wide">
              Pitalito · Huila
            </span>
          </span>
        </div>

        {/* Derecha */}
        <div className="flex items-center gap-3">
          {/* Botón de pedidos (desktop) */}
          <button
            type="button"
            className="hidden md:inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold shadow-lg transition hover:bg-white/20 hover:scale-[1.02]"
            style={{
              backgroundColor: "rgba(255,255,255,0.25)",
              color: "#FFFFFF",
            }}
          >
            <ShoppingCart size={16} />
            <span>Mis pedidos</span>
          </button>

          {/* Cuenta */}
          <details className="group relative">
            <summary
              className="flex cursor-pointer list-none items-center gap-2 rounded-full border px-1.5 pr-3 text-xs sm:text-sm transition hover:bg-white/10"
              style={{
                backgroundColor: "rgba(255,255,255,0.15)",
                borderColor: BRAND.borderLight,
                color: BRAND.ink,
              }}
            >
              <img
                alt="Perfil"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                className="h-8 w-8 rounded-full ring-2 ring-white/40 object-cover shadow-md"
              />
              <span className="hidden sm:inline font-semibold">Mi cuenta</span>
              <ChevronDown size={16} className="transition group-open:rotate-180" />
            </summary>

            <motion.ul
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border p-1.5 text-[15px] shadow-2xl bg-white"
              style={{ borderColor: "#E5E7EB", color: "#111827" }}
            >
              <li>
                <a className="block rounded-lg px-3 py-2 hover:bg-slate-50">Perfil</a>
              </li>
              <li>
                <a className="block rounded-lg px-3 py-2 hover:bg-slate-50">
                  Configuración
                </a>
              </li>
              <li>
                <a className="block rounded-lg px-3 py-2 hover:bg-slate-50">
                  Pedidos
                </a>
              </li>
              <li
                className="mt-1 border-t"
                style={{ borderColor: "#E5E7EB" }}
              />
              <li>
                <a
                  className="block rounded-lg px-3 py-2 font-semibold"
                  style={{ color: "#EF4444" }}
                >
                  Cerrar sesión
                </a>
              </li>
            </motion.ul>
          </details>

          {/* Menú móvil */}
          <button
            className="md:hidden grid size-10 place-items-center rounded-xl border transition hover:bg-white/10"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            style={{
              backgroundColor: "rgba(255,255,255,0.15)",
              borderColor: BRAND.borderLight,
            }}
          >
            {open ? (
              <X size={20} style={{ color: "white" }} />
            ) : (
              <Menu size={20} style={{ color: "white" }} />
            )}
          </button>
        </div>
      </nav>

      {/* Menú móvil */}
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        className="md:hidden overflow-hidden border-t"
        style={{
          borderColor: "rgba(255,255,255,0.25)",
          backgroundColor: "rgba(0,0,0,0.05)",
        }}
      >
        <div className="px-4 py-3 space-y-3">
          <div
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs shadow-sm"
            style={{
              backgroundColor: "rgba(255,255,255,0.25)",
              borderColor: BRAND.borderLight,
              color: "#FFFFFF",
            }}
          >
            <MapPin size={16} />
            <span className="font-medium">Pitalito · Huila</span>
          </div>

          <div className="grid gap-1.5">
            <a
              onClick={close}
              href="#categorias"
              className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/10 text-white"
            >
              Categorías
            </a>
            <a
              onClick={close}
              href="#contacto"
              className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/10 text-white"
            >
              ¿Quieres ser aliado?
            </a>
          </div>
        </div>
      </motion.div>
    </header>
  );
};

export default Navbar;
