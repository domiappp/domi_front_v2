import React from "react";
import { ShoppingCart, MapPin, Menu, X, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const BRAND = {
  primary: "#E76B51", // coral (fondo principal)
  accent: "#F4B93B",  // mostaza (acentos: W, anillos)
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
      "text-sm md:text-[15px] font-medium text-white/90 hover:text-white transition-colors " +
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
    <header className="sticky top-0 z-50 w-full" style={{ backgroundColor: BRAND.primary }}>

      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-2 md:py-3"
        aria-label="Principal"
      >
        {/* Izquierda: Logo + Marca */}
        <div className="flex min-w-0 items-center gap-3">
          <a href="/" className="group inline-flex items-center gap-2" aria-label="Inicio">
            {/* <div
              className="relative grid size-10 place-items-center overflow-hidden rounded-full transition-transform group-hover:scale-105 ring-2"
              style={{
                ringColor: BRAND.ink,
                boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
                background: BRAND.neutral,
              } as React.CSSProperties}
            >
              <div className="absolute inset-0 opacity-0" />
              <img
                src="/moto.png"
                alt="Domicilios W"
                className="relative z-10 h-6 w-6 object-contain"
                loading="lazy"
              />
            </div> */}
            <div className="flex items-center uppercase gap-1">
              <span className="truncate text-2xl tracking-tight text-white">
                Domicilios
              </span>
              <span className="text-2xl font-bold text-warning ">
                W
              </span>
            </div>
          </a>
        </div>

        {/* Centro: enlaces + ubicación */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink href="#ofertas">Ofertas</NavLink>
          <NavLink href="#contacto">Contacto</NavLink>

          <span
            className="hidden lg:inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm text-white/90 shadow-sm backdrop-blur-sm"
            style={{
              borderColor: "rgba(255,255,255,0.15)",
              backgroundColor: "rgba(248,232,208,0.18)", // crema translúcido
            }}
          >
            <MapPin size={16} aria-hidden="true" /> Pitalito · Huila
          </span>
        </div>

        {/* Derecha: buscador, carrito, perfil */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* <div className="relative hidden md:block">
            <input
              type="search"
              placeholder="Buscar restaurantes o platos…"
              className="w-56 lg:w-72 rounded-xl border px-3 py-2 text-sm text-white placeholder-white/60 backdrop-blur-md outline-none focus:ring-2"
              style={{
                backgroundColor: "rgba(255,255,255,0.12)",
                borderColor: "rgba(255,255,255,0.10)",
                boxShadow: "inset 0 0 0 9999px rgba(255,255,255,0.02)",
              }}
            />
          </div> */}

          {/* <button
            type="button"
            aria-label="Abrir carrito"
            className="relative grid size-10 place-items-center rounded-xl border backdrop-blur-md transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            style={{
              backgroundColor: "rgba(248,232,208,0.22)", // crema
              borderColor: "rgba(255,255,255,0.15)",
            }}
          >
            <ShoppingCart size={20} />
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

          <details className="group relative">
            <summary
              className="flex cursor-pointer list-none items-center gap-2 rounded-xl border p-1 pr-2 text-sm text-white/90 backdrop-blur-md transition"
              style={{
                backgroundColor: "rgba(255,255,255,0.12)",
                borderColor: "rgba(255,255,255,0.15)",
              }}
            >
              <img
                alt="Perfil"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                className="h-8 w-8 rounded-lg ring-1 object-cover"
                style={{ ringColor: "rgba(255,255,255,0.30)" } as React.CSSProperties}
              />
              <span className="hidden sm:inline">Mi cuenta</span>
              <ChevronDown className="transition group-open:rotate-180" size={16} />
            </summary>
            <motion.ul
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border p-1 text-[15px] shadow-2xl backdrop-blur-xl"
              style={{
                backgroundColor: "rgba(255,255,255,0.95)",
                borderColor: "rgba(255,255,255,0.10)",
                color: BRAND.ink,
              }}
            >
              <li><a className="block rounded-lg px-3 py-2 hover:bg-black/[0.03]">Perfil</a></li>
              <li><a className="block rounded-lg px-3 py-2 hover:bg-black/[0.03]">Configuración</a></li>
              <li><a className="block rounded-lg px-3 py-2 hover:bg-black/[0.03]">Pedidos</a></li>
              <li className="mt-1 border-t" style={{ borderColor: "rgba(0,0,0,0.10)" }} />
              <li><a className="block rounded-lg px-3 py-2" style={{ color: "#ef4444" }}>Cerrar sesión</a></li>
            </motion.ul>
          </details>

          <button
            className="md:hidden grid size-10 place-items-center rounded-xl border backdrop-blur-md"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            style={{
              backgroundColor: "rgba(255,255,255,0.12)",
              borderColor: "rgba(255,255,255,0.15)",
            }}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <motion.div
        id="mobile-menu"
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        className="md:hidden overflow-hidden border-t backdrop-blur"
        style={{
          borderColor: "rgba(255,255,255,0.10)",
          backgroundColor: "rgba(0,0,0,0.55)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div
            className="mb-2 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm text-white/90"
            style={{
              backgroundColor: "rgba(248,232,208,0.22)",
              borderColor: "rgba(255,255,255,0.15)",
            }}
          >
            <MapPin size={16} /> Pitalito · Huila
          </div>
          <div className="grid gap-1">
            <a onClick={close} href="#categorias" className="rounded-lg px-3 py-2 text-white/90 hover:bg-white/10">Categorías</a>
            <a onClick={close} href="#ofertas" className="rounded-lg px-3 py-2 text-white/90 hover:bg-white/10">Ofertas</a>
            <a onClick={close} href="#contacto" className="rounded-lg px-3 py-2 text-white/90 hover:bg-white/10">Contacto</a>
          </div>
          <div className="mt-3">
            <input
              type="search"
              placeholder="Buscar…"
              className="w-full rounded-xl border px-3 py-2 text-sm text-white placeholder-white/60"
              style={{
                backgroundColor: "rgba(255,255,255,0.12)",
                borderColor: "rgba(255,255,255,0.10)",
              }}
            />
          </div>
        </div>
      </motion.div>
    </header>
  );
};

export default Navbar;
