// src/shared/components/CardComercio.tsx

import React, { useId } from "react";
import { Heart, ChevronRight, Star, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useComercioClickView } from "../../services/useComercios";
import { useFavoritosStore } from "../../store/favoritos.store";

export type CardComercioProps = {
  id?: string;
  nombre: string;
  categoria: string;
  imagen: string; // puede ser URL completa o path relativo
  esFavorito?: boolean; // ya no se usa, pero se deja por compatibilidad
  precioDesde?: number;
  serviceId?: number | string; // 👈 importante para agrupar por servicio
  rating?: number;
  reviews?: number;
  abierto?: boolean;
  ubicacion?: string;
  distanciaKm?: number;
  tiempoEntregaMin?: number;
  tiempoEntregaMax?: number;
  costoEnvio?: number | "Gratis";
  onToggleFavorito?: (id?: string) => void; // ya no se usa, lo maneja Zustand
};

const round = (n?: number) =>
  typeof n === "number" ? Math.round(n * 10) / 10 : undefined;

const Stars: React.FC<{ value?: number }> = ({ value = 0 }) => {
  const full = Math.floor(value);
  const hasHalf = value - full >= 0.5;
  const empty = 5 - full - (hasHalf ? 1 : 0);
  const gid = useId();
  return (
    <div
      className="flex items-center gap-0.5 text-amber-400"
      aria-label={`Calificación ${value} de 5`}
    >
      {Array.from({ length: full }).map((_, i) => (
        <Star key={"f" + i} className="h-3.5 w-3.5 fill-current" />
      ))}
      {hasHalf && (
        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" aria-hidden>
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
            className="text-amber-400"
          />
        </svg>
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={"e" + i} className="h-3.5 w-3.5 text-slate-300" />
      ))}
    </div>
  );
};

const EstadoPill: React.FC<{ abierto?: boolean }> = ({ abierto }) => {
  const isOpen = abierto === true;
  const isClosed = abierto === false;

  const base =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-tight border backdrop-blur-sm";
  const openCls =
    "bg-emerald-100/95 text-emerald-800 border-emerald-200 shadow-sm";
  const closedCls =
    "bg-rose-100/95 text-rose-800 border-rose-200 shadow-sm";
  const neutralCls =
    "bg-slate-100/95 text-slate-700 border-slate-200 shadow-sm";

  return (
    <span
      className={`${base} ${
        isOpen ? openCls : isClosed ? closedCls : neutralCls
      }`}
    >
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
  serviceId,
  esFavorito, // no se usa
  rating = 0,
  reviews,
  abierto,
  ubicacion,
  onToggleFavorito, // no se usa
}) => {
  const navigate = useNavigate();
  const clickView = useComercioClickView();

  // 🔥 Zustand: favoritos persistentes agrupados por servicio
  const isFav = useFavoritosStore((s) => s.isFavorito(serviceId, id));
  const toggleFav = useFavoritosStore((s) => s.toggleFavorito);

  const goDetail = () => {
    if (!id) return;

    clickView.mutate(id);
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
      className="group relative cursor-pointer flex flex-col shadow-2xl overflow-hidden rounded-2xl bg-white/95 pb-3  ring-1 ring-slate-100 transition-all duration-200 supports-[hover:hover]:hover:-translate-y-1 supports-[hover:hover]:hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6600]"
    >
      {/* Botón favorito (no navega) */}
      <button
        type="button"
        aria-label={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
        onClick={(e) => {
          e.stopPropagation(); // ⛔️ evita navegar
          toggleFav(serviceId, id); // serviceId + id
        }}
        className="absolute right-2 top-2 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/95/90 backdrop-blur-md shadow-md ring-1 ring-slate-200 transition-all duration-150 active:scale-95 group-hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6600]"
      >
        <Heart
          className={`h-5 w-5 ${
            isFav ? "text-[#FF6600] fill-[#FF6600]" : "text-slate-300"
          }`}
        />
      </button>

      {/* Imagen */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={imgUrl}
          alt={nombre}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute left-2 bottom-2">
          <EstadoPill abierto={abierto} />
        </div>
      </div>

      {/* Info principal */}
      <div className="min-w-0 px-3 sm:px-4 pt-2">
        <h3 className="text-[15px] sm:text-base font-semibold text-slate-900 line-clamp-2">
          {nombre}
        </h3>


        {/* Rating (solo si hay valor) */}
        {(rating ?? 0) > 0 && (
          <div className="flex items-center justify-between pt-0.5 text-xs">
            <div className="flex items-center gap-1.5">
              <Stars value={rating} />
              <span className="font-semibold text-slate-800">
                {round(rating)}
              </span>
              {typeof reviews === "number" && (
                <span className="text-[11px] text-slate-500">
                  ({reviews} opiniones)
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 px-3 sm:px-4 flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          {/* Estado + Ubicación */}
          {ubicacion && (
            <div className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-[11px] text-slate-600">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-amber-500" />
              <span className="truncate">{ubicacion}</span>
            </div>
          )}
        </div>

        {/* Botón de acción (también navega) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation(); // evita que el click burbujee dos veces
            goDetail();
          }}
          className="shrink-0 grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#FF783B] to-[#FF4D3B] shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6600]"
          aria-label={`Ir a ${nombre}`}
          title="Ver detalles"
        >
          <ChevronRight className="h-5 w-5 text-white transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>
    </article>
  );
};

export default CardComercio;
