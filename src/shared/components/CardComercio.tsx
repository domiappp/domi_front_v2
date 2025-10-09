import React, { useId } from "react";
import { Heart, ChevronRight, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export type CardComercioProps = {
  id?: string;
  nombre: string;
  categoria: string;
  imagen: string; // puede ser URL completa o path relativo
  esFavorito?: boolean;
  precioDesde?: number;
  rating?: number;
  reviews?: number;
  abierto?: boolean;
  ubicacion?: string;
  distanciaKm?: number;
  tiempoEntregaMin?: number;
  tiempoEntregaMax?: number;
  costoEnvio?: number | "Gratis";
  onToggleFavorito?: (id?: string) => void;
};

const round = (n?: number) => (typeof n === "number" ? Math.round(n * 10) / 10 : undefined);

const Stars: React.FC<{ value?: number }> = ({ value = 0 }) => {
  const full = Math.floor(value);
  const hasHalf = value - full >= 0.5;
  const empty = 5 - full - (hasHalf ? 1 : 0);
  const gid = useId();
  return (
    <div className="flex items-center gap-0.5 text-yellow-500" aria-label={`Calificación ${value} de 5`}>
      {Array.from({ length: full }).map((_, i) => (
        <Star key={"f" + i} className="h-4 w-4 fill-current" />
      ))}
      {hasHalf && (
        <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden>
          <defs>
            <linearGradient id={`half-${gid}`}>
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path
            d="M10 15.27 15.18 18l-1.64-5.03L18 9.24l-5.19-.04L10 4 7.19 9.2 2 9.24l4.46 3.73L4.82 18z"
            fill={`url(#half-${gid})`}
            stroke="currentColor"
            className="text-yellow-500"
          />
        </svg>
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={"e" + i} className="h-4 w-4 text-gray-300" />
      ))}
    </div>
  );
};

const EstadoPill: React.FC<{ abierto?: boolean }> = ({ abierto }) => {
  const isOpen = abierto === true;
  const isClosed = abierto === false;

  const base = "inline-flex items-center rounded-full px-2 py-0.5 text-[13px] font-medium";
  const openCls = "bg-emerald-100 text-emerald-700";
  const closedCls = "bg-rose-100 text-rose-700";
  const neutralCls = "bg-gray-100 text-gray-600";

  return (
    <span className={`${base} ${isOpen ? openCls : isClosed ? closedCls : neutralCls}`}>
      {isOpen ? "Abierto" : isClosed ? "Cerrado" : "Horario no disponible"}
    </span>
  );
};

const Base = import.meta.env.VITE_API_URL;

const CardComercio: React.FC<CardComercioProps> = ({
  id,
  nombre,
  categoria,
  imagen,
  esFavorito,
  rating = 0,
  reviews,
  abierto,
  ubicacion,
  onToggleFavorito,
}) => {
  const navigate = useNavigate();

  const goDetail = () => {
    if (!id) return;
    navigate(`/local-comercial/${id}`);
  };

  const onKeyGoDetail: React.KeyboardEventHandler<HTMLElement> = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      goDetail();
    }
  };

  // Soporta imágenes absolutas (http...) o relativas (se antepone Base)
  const imgUrl =
    imagen?.startsWith("http") || imagen?.startsWith("data:")
      ? imagen
      : `${Base}/archivos/${imagen}`;

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={goDetail}
      onKeyDown={onKeyGoDetail}
      aria-label={`Ver ${nombre}`}
      className="group cursor-pointer pb-3 relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#F2F2F2] transition supports-[hover:hover]:hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6600]"
    >
      {/* Botón favorito (no navega) */}
      <button
        type="button"
        aria-label={esFavorito ? "Quitar de favoritos" : "Agregar a favoritos"}
        onClick={(e) => {
          e.stopPropagation(); // ⛔️ evita navegar
          onToggleFavorito?.(id);
        }}
        className="absolute right-2 top-2 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/95 backdrop-blur-sm shadow ring-1 ring-[#F2F2F2] transition active:scale-95 focus-visible:outline-2 focus-visible:outline-[#FF6600]"
      >
        <Heart
          className={`h-5 w-5 ${esFavorito ? "text-[#FF6600] fill-[#FF6600]" : "text-gray-300"}`}
        />
      </button>

      {/* Imagen */}
      <div className="w-full relative h-[120px] lg:h-[180px] rounded-2xl bg-[#FFB84D] object-cover transition-transform truncate">
        <img src={imgUrl} alt={nombre} className="w-full h-full object-cover" />
        <div className="absolute bottom-2 left-2">
          <EstadoPill abierto={abierto} />
        </div>
      </div>

      {/* Info principal */}
      <div className="min-w-0 px-3 sm:px-4 space-y-1 text-center">
        <h3 className="text-[15px] sm:text-base font-semibold text-[#333333] line-clamp-2">
          {nombre}
        </h3>
        <p className="truncate text-xs text-gray-500">{categoria}</p>
      </div>

      {/* Footer */}
      <div className="mt-3 px-3 sm:px-4 flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Stars value={round(rating)} />
            <span className="ml-1 font-medium text-[#333333]">{round(rating) ?? 0}</span>
            {typeof reviews === "number" && <span className="truncate">• {reviews}</span>}
          </div>

          {/* Estado + Ubicación */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-gray-600">
            {ubicacion && (
              <span className="truncate max-w-full sm:max-w-[220px] lg:max-w-[260px]">{ubicacion}</span>
            )}
          </div>
        </div>

        {/* Botón de acción (también navega) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation(); // evita que el click burbujee dos veces
            goDetail();
          }}
          className="shrink-0 grid h-9 w-9 place-items-center rounded-full bg-[#FF783B] focus-visible:outline-2 focus-visible:outline-[#FF6600]"
          aria-label={`Ir a ${nombre}`}
          title="Ver detalles"
        >
          <ChevronRight className="h-5 w-5 text-white transition group-hover:scale-110" />
        </button>
      </div>
    </article>
  );
};

export default CardComercio;
