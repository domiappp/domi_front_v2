import React, { useId } from "react";
import { Heart, ChevronRight, Star, MapPin } from "lucide-react";
import { useComerciosPopulares } from "../../services/useComercios";
import type { Commerce } from "../../shared/types/comercioTypes";

// ========================================================
// Tipos para la card
// ========================================================
export type ComercioLateralCardProps = {
  id?: string;
  nombre: string;
  categoria: string;
  imagen: string;
  esFavorito?: boolean;
  rating?: number; // 0 - 5
  reviews?: number; // cantidad de reseñas
  abierto?: boolean;
  ubicacion?: string;
  onToggleFavorito?: (id?: string) => void;
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
      className="flex items-center gap-0.5 text-yellow-500"
      aria-label={`Calificación ${value} de 5`}
    >
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

// Pill estado abierto/cerrado
const EstadoPill: React.FC<{ abierto?: boolean }> = ({ abierto }) => {
  const isOpen = abierto === true;
  const isClosed = abierto === false;

  const base =
    "inline-flex items-center rounded-full px-2 py-0.5 text-[12px] font-medium";
  const openCls = "bg-emerald-100 text-emerald-700";
  const closedCls = "bg-rose-100 text-rose-700";
  const neutralCls = "bg-gray-100 text-gray-600";

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


// ========================================================
// COMPONENTE: ComercioLateralCard
// ========================================================
const ComercioLateralCard: React.FC<ComercioLateralCardProps> = ({
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


    const imgUrl =
    imagen?.startsWith("http") || imagen?.startsWith("data:")
      ? imagen
      : `${Base}/archivos/${imagen}`;

  return (
    <article className="group relative overflow-hidden rounded-2xl bg-white ring-1 ring-[#F2F2F2] shadow-sm transition supports-[hover:hover]:hover:shadow-md">
      {/* Contenedor responsive: en sm stack; en md horizontal */}
      <div className="flex flex-col md:flex-row">
        {/* Imagen a la izquierda en md+ */}
        <div className="relative md:w-48 md:h-48 w-full h-40 shrink-0">
          <img
            src={imgUrl}
            alt={nombre}
            className="absolute inset-0 h-full w-full object-cover md:rounded-l-2xl md:rounded-r-none rounded-t-2xl"
          />
          <div className="absolute left-2 top-2">
            <EstadoPill abierto={abierto} />
          </div>

          {/* Botón favorito */}
          <button
            type="button"
            aria-label={esFavorito ? "Quitar de favoritos" : "Agregar a favoritos"}
            onClick={() => onToggleFavorito?.(id)}
            className="absolute right-2 top-2 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/95 backdrop-blur-sm shadow ring-1 ring-[#F2F2F2] transition active:scale-95 focus-visible:outline-2 focus-visible:outline-[#FF6600]"
          >
            <Heart
              className={`h-5 w-5 ${
                esFavorito ? "text-[#FF6600] fill-[#FF6600]" : "text-gray-300"
              }`}
            />
          </button>
        </div>

        {/* Contenido a la derecha */}
        <div className="flex min-w-0 flex-1 flex-col gap-2 p-3 sm:p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-[15px] sm:text-base font-semibold text-[#333333] line-clamp-2">
                {nombre}
              </h3>
              <p className="text-xs text-gray-500 truncate">{categoria}</p>
            </div>

            {/* CTA redonda (desktop) */}
            <div className="shrink-0 hidden md:grid h-9 w-9 place-items-center rounded-full bg-[#FF6600]">
              <ChevronRight className="h-5 w-5 text-white" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-700">
            <Stars value={round(rating)} />
            <span className="font-medium text-[#333333]">
              {round(rating) ?? 0}
            </span>
            {typeof reviews === "number" && (
              <span className="text-gray-500">• {reviews}</span>
            )}
          </div>

          {ubicacion && (
            <div className="flex items-center gap-1 text-[13px] text-gray-600 truncate">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden />
              <span className="truncate">{ubicacion}</span>
            </div>
          )}

          {/* CTA en móviles */}
          <div className="mt-1 md:hidden">
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full bg-[#FF6600] px-3 py-1.5 text-sm font-medium text-white active:scale-95"
            >
              Ver más <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ComercioLateralCard;

// ========================================================
// MAPEO: Commerce -> ComercioLateralCardProps
// ========================================================
const mapCommerceToCardProps = (c: Commerce): ComercioLateralCardProps => {
  return {
    id: String(c.id),
    nombre: String(c.nombre_comercial),
    categoria: (c as any).servicio?.nombre ?? "Comercio", // ajusta si tu tipo tiene servicio
    imagen: c.logo_url || "/images/placeholder-comercio.jpg", // fallback
    esFavorito: false, // aquí luego puedes conectar con tu sistema de favoritos
    rating: (c as any).stats?.ratingPromedio ?? 0, // si no tienes stats, deja 0
    reviews: (c as any).stats?.totalReviews,
    abierto: Number(c.estado) === 1,
    ubicacion: c.direccion,
  };
};

// ========================================================
// Lista de comercios POPULARES (consumiendo el hook)
// ========================================================
export const ListaComerciosLateralPopulares: React.FC = () => {
  const { data, isLoading, error } = useComerciosPopulares({
    page: 1,
    limit: 8,
    estado: String(1), // solo activos
  });

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-9xl p-3 sm:p-4">
        <h2 className="mb-3 text-base sm:text-lg font-semibold">Recomendados</h2>
        <p className="text-sm text-gray-500">Cargando comercios populares...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-9xl p-3 sm:p-4">
        <h2 className="mb-3 text-base sm:text-lg font-semibold">Recomendados</h2>
        <p className="text-sm text-red-500">
          Ocurrió un error al cargar los comercios populares.
        </p>
      </div>
    );
  }

  const items = data?.items ?? [];

  if (!items.length) {
    return (
      <div className="mx-auto w-full max-w-9xl p-3 sm:p-4">
        <h2 className="mb-3 text-base sm:text-lg font-semibold">Recomendados</h2>
        <p className="text-sm text-gray-500">No hay comercios populares por ahora.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-9xl p-3 sm:p-4">
      <h2 className="mb-3 text-base sm:text-lg font-semibold">Recomendados</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        {items.map((c) => {
          const cardProps = mapCommerceToCardProps(c);
          return (
            <ComercioLateralCard
              key={c.id}
              {...cardProps}
              onToggleFavorito={(id) => console.log("toggle favorito", id)}
            />
          );
        })}
      </div>
    </div>
  );
};
