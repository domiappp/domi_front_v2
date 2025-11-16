import React from "react";
import { ShoppingCart, MapPin, Menu, X, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const BRAND = {
  primary: "#E76B51", // coral (fondo/acento principal)
  accent: "#F4B93B",  // mostaza (acentos: W, badges)
  ink: "#225B60",     // azul petróleo (texto en superficies claras)
  action: "#1D90A2",  // azul brillante (acciones/badge)
  neutral: "#F8E8D0", // crema (chips/fondos suaves)
};

const NavLink: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>> = ({
  className = "",
  children,
  ...props
}) => (
  <a
    className={
      "text-sm md:text-[15px] font-medium text-white/80 hover:text-white transition-colors " +
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-md px-2 py-1 " +
      className
    }
    {...props}
  >
    {children}
  </a>
);

const Navbar: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const close = () => setOpen(false);

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-white/10 backdrop-blur-xl"
      style={{
        background: `linear-gradient(120deg, rgba(0,0,0,0.96), rgba(0,0,0,0.86), rgba(0,0,0,0.96))`,
        boxShadow:
          "0 18px 45px rgba(0,0,0,0.55), 0 0 0 1px rgba(249, 115, 22, 1)",
      }}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-2.5 md:py-3.5"
        aria-label="Principal"
      >
        {/* Izquierda: Logo + Marca */}
        <div className="flex min-w-0 items-center gap-3">
          <a
            href="/"
            className="group inline-flex items-center gap-2"
            aria-label="Inicio"
          >
            {/* Logo circular opcional
            <div
              className="relative grid size-10 place-items-center overflow-hidden rounded-full transition-transform group-hover:scale-105 ring-2 ring-white/30 bg-base-100/90 shadow-lg"
            >
              <img
                src="/moto.png"
                alt="Domicilios W"
                className="relative z-10 h-6 w-6 object-contain"
                loading="lazy"
              />
            </div> */}
            <div className="flex items-center gap-1 uppercase">
              <span className="truncate text-xl sm:text-2xl tracking-tight text-white font-semibold">
                Domicilios
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-warning drop-shadow-[0_4px_14px_rgba(0,0,0,0.55)]">
                W
              </span>
            </div>
          </a>
        </div>

        {/* Centro: enlaces + ubicación */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink href="#contacto">Contacto</NavLink>

          <span
            className="hidden lg:inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs sm:text-sm text-white/90 shadow-md backdrop-blur-md border"
            style={{
              borderColor: "rgba(255,255,255,0.18)",
              backgroundColor: "rgba(0,0,0,0.55)",
            }}
          >
            <MapPin size={16} aria-hidden="true" className="text-warning" />
            <span className="font-medium tracking-wide">
              Pitalito · Huila
            </span>
          </span>
        </div>

        {/* Derecha: perfil + menú móvil (buscador y carrito siguen comentados) */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Buscador desktop
          <div className="relative hidden md:block">
            <input
              type="search"
              placeholder="Buscar restaurantes o platos…"
              className="w-56 lg:w-72 rounded-xl border px-3 py-2 text-sm text-white placeholder-white/60 backdrop-blur-md outline-none focus:ring-2 focus:ring-white/70"
              style={{
                backgroundColor: "rgba(255,255,255,0.10)",
                borderColor: "rgba(255,255,255,0.14)",
                boxShadow: "inset 0 0 0 9999px rgba(0,0,0,0.10)",
              }}
            />
          </div> */}

          {/* Carrito
          <button
            type="button"
            aria-label="Abrir carrito"
            className="relative grid size-10 place-items-center rounded-xl border backdrop-blur-md transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            style={{
              backgroundColor: "rgba(248,232,208,0.22)",
              borderColor: "rgba(255,255,255,0.15)",
            }}
          >
            <ShoppingCart size={20} className="text-white" />
            <span
              aria-label="Artículos en el carrito"
              className="absolute -right-1 -top-1 min-w-5 rounded-full border px-1.5 text-center text-[11px] font-semibold leading-5 text-white shadow"
              style={{
                borderColor: "rgba(255,255,255,0.20)",
                background: `linear-gradient(180deg, ${BRAND.action}, ${BRAND.ink})`,
              }}
            >
              2
            </span>
          </button> */}

          {/* Dropdown de cuenta */}
          <details className="group relative">
            <summary
              className="flex cursor-pointer list-none items-center gap-2 rounded-full border px-1.5 pr-2.5 text-xs sm:text-sm text-white/90 backdrop-blur-md transition hover:bg-white/10"
              style={{
                backgroundColor: "rgba(255,255,255,0.06)",
                borderColor: "rgba(255,255,255,0.20)",
              }}
            >
              <img
                alt="Perfil"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                className="h-8 w-8 rounded-full ring-2 ring-white/40 object-cover shadow-md"
              />
              <span className="hidden sm:inline font-medium tracking-tight">
                Mi cuenta
              </span>
              <ChevronDown
                className="transition group-open:rotate-180"
                size={16}
              />
            </summary>
            <motion.ul
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border p-1.5 text-[15px] shadow-2xl backdrop-blur-2xl"
              style={{
                backgroundColor: "rgba(248,248,248,0.97)",
                borderColor: "rgba(0,0,0,0.04)",
                color: BRAND.ink,
              }}
            >
              <li>
                <a className="block rounded-lg px-3 py-2 hover:bg-black/[0.03]">
                  Perfil
                </a>
              </li>
              <li>
                <a className="block rounded-lg px-3 py-2 hover:bg-black/[0.03]">
                  Configuración
                </a>
              </li>
              <li>
                <a className="block rounded-lg px-3 py-2 hover:bg-black/[0.03]">
                  Pedidos
                </a>
              </li>
              <li
                className="mt-1 border-t"
                style={{ borderColor: "rgba(0,0,0,0.10)" }}
              />
              <li>
                <a
                  className="block rounded-lg px-3 py-2 font-semibold"
                  style={{ color: "#ef4444" }}
                >
                  Cerrar sesión
                </a>
              </li>
            </motion.ul>
          </details>

          {/* Botón menú móvil */}
          <button
            className="md:hidden grid size-10 place-items-center rounded-xl border backdrop-blur-md transition hover:bg-white/10"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Abrir menú de navegación"
            style={{
              backgroundColor: "rgba(255,255,255,0.06)",
              borderColor: "rgba(255,255,255,0.20)",
            }}
          >
            {open ? (
              <X size={20} className="text-white" />
            ) : (
              <Menu size={20} className="text-white" />
            )}
          </button>
        </div>
      </nav>

      {/* Menú móvil */}
      <motion.div
        id="mobile-menu"
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        className="md:hidden overflow-hidden border-t"
        style={{
          borderColor: "rgba(255,255,255,0.10)",
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.92), rgba(0,0,0,0.86))",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 py-3 space-y-3">
          <div
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs text-white/90 shadow-sm"
            style={{
              backgroundColor: "rgba(248,232,208,0.22)",
              borderColor: "rgba(255,255,255,0.20)",
            }}
          >
            <MapPin size={16} className="text-warning" />
            <span className="font-medium">Pitalito · Huila</span>
          </div>

          <div className="grid gap-1.5">
            <a
              onClick={close}
              href="#categorias"
              className="rounded-lg px-3 py-2 text-sm font-medium text-white/90 hover:bg-white/10"
            >
              Categorías
            </a>
            <a
              onClick={close}
              href="#contacto"
              className="rounded-lg px-3 py-2 text-sm font-medium text-white/90 hover:bg-white/10"
            >
              Quieres ser aliado?
            </a>
          </div>
        </div>
      </motion.div>
    </header>
  );
};

export default Navbar;
