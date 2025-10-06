import React, { useId } from "react";
import { Heart, ChevronRight, Star } from "lucide-react";

// ========================================================
// CardComercio: versión enfocada en LOCALES DE COMIDA
// - Quitado del render: distancia, tiempos min-max, costo de envío.
// - Agregado: estado Abierto/Cerrado y Ubicación.
// - Mejorado responsive y accesibilidad.
// - Botones con íconos de lucide-react.
// ========================================================

export type CardComercioProps = {
  id?: string;
  nombre: string;
  categoria: string; // p. ej. Pizzería, Sushi, Cafetería
  imagen: string;
  esFavorito?: boolean;
  /** @deprecated Ya no se muestra en la tarjeta */
  precioDesde?: number;
  rating?: number; // 0 - 5
  reviews?: number; // cantidad de reseñas

  /** NUEVO: estado del local */
  abierto?: boolean;
  /** NUEVO: dirección mostrada en la tarjeta (ej. "Cra 2E #12-7 sur") */
  ubicacion?: string;

  /** @deprecated Ya no se muestra en la tarjeta */
  distanciaKm?: number; // opcional
  /** @deprecated Ya no se muestra en la tarjeta */
  tiempoEntregaMin?: number; // en minutos
  /** @deprecated Ya no se muestra en la tarjeta */
  tiempoEntregaMax?: number; // en minutos
  /** @deprecated Ya no se muestra en la tarjeta */
  costoEnvio?: number | "Gratis"; // opcional

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

// Pequeño pill para estado abierto/cerrado
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


const Base = import.meta.env.VITE_API_URL

// ========================================================
// Card
// ========================================================
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
  return (
    <article className="group pb-3 relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#F2F2F2] transition supports-[hover:hover]:hover:shadow-md">
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

      {/* Imagen */}
      <div className="w-full relative h-[120px] lg:h-[180px] rounded-2xl bg-[#FFB84D] object-cover transition-transform truncate">
        <img
          src={`${Base}/archivos/${imagen}`}
          alt={nombre}
          className="w-full h-full object-cover"
        />
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
            <span className="ml-1 font-medium text-[#333333]">
              {round(rating) ?? 0}
            </span>
            {typeof reviews === "number" && (
              <span className="truncate">• {reviews}</span>
            )}
          </div>

          {/* Estado + Ubicación */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-gray-600">
            {ubicacion && (
              <span className="truncate max-w-full sm:max-w-[220px] lg:max-w-[260px]">
                {ubicacion}
              </span>
            )}
          </div>
        </div>

        {/* Botón de acción */}
        <div className="shrink-0 grid h-9 w-9 place-items-center rounded-full bg-[#FF783B]">
          <ChevronRight className="h-5 w-5 text-white transition group-hover:scale-110" />
        </div>
      </div>
    </article>
  );
};


export default CardComercio;

// ========================================================
// Demo de lista responsive (móvil 2 col, md 3, lg 4)
// ========================================================
export const ListaComerciosDemo: React.FC = () => {
  const data: CardComercioProps[] = [

    {
      id: "2",
      nombre: "Hamburguesas Mix",
      categoria: "Hamburguesería",
      imagen:
        "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=512&auto=format&fit=crop",
      rating: 4.7,
      reviews: 201,
      esFavorito: true,
      abierto: true,
      ubicacion: "Cll 45 #18-22",
    },
    {
      id: "3",
      nombre: "Café Central",
      categoria: "Cafetería",
      imagen:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=512&auto=format&fit=crop",
      rating: 4.2,
      reviews: 98,
      esFavorito: false,
      abierto: false,
      ubicacion: "Av. 7 #114-09",
    },
    {
      id: "4",
      nombre: "Sushi House",
      categoria: "Sushi",
      imagen:
        "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=512&auto=format&fit=crop",
      rating: 4.6,
      reviews: 156,
      esFavorito: false,
      abierto: true,
      ubicacion: "Transv. 93 #65-30",
    },
    {
      id: "6",
      nombre: "Hamburguesas Mix",
      categoria: "Hamburguesería",
      imagen:
        "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=512&auto=format&fit=crop",
      rating: 4.7,
      reviews: 201,
      esFavorito: true,
      abierto: true,
      ubicacion: "Cll 45 #18-22",
    },
    {
      id: "7",
      nombre: "Café Central",
      categoria: "Cafetería",
      imagen:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=512&auto=format&fit=crop",
      rating: 4.2,
      reviews: 98,
      esFavorito: false,
      abierto: false,
      ubicacion: "Av. 7 #114-09",
    },
    {
      id: "8",
      nombre: "Sushi House",
      categoria: "Sushi",
      imagen:
        "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=512&auto=format&fit=crop",
      rating: 4.6,
      reviews: 156,
      esFavorito: false,
      abierto: true,
      ubicacion: "Transv. 93 #65-30",
    },
    {
      id: "10",
      nombre: "Hamburguesas Mix",
      categoria: "Hamburguesería",
      imagen:
        "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=512&auto=format&fit=crop",
      rating: 4.7,
      reviews: 201,
      esFavorito: true,
      abierto: true,
      ubicacion: "Cll 45 #18-22",
    },
    {
      id: "11",
      nombre: "Café Central",
      categoria: "Cafetería",
      imagen:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=512&auto=format&fit=crop",
      rating: 4.2,
      reviews: 98,
      esFavorito: false,
      abierto: false,
      ubicacion: "Av. 7 #114-09",
    },
    {
      id: "12",
      nombre: "Sushi House",
      categoria: "Sushi",
      imagen:
        "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=512&auto=format&fit=crop",
      rating: 4.6,
      reviews: 156,
      esFavorito: false,
      abierto: true,
      ubicacion: "Transv. 93 #65-30",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-8xl p-3 sm:p-4">
      <h2 className="mb-3 text-base sm:text-lg font-semibold">Cerca de ti</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 sm:gap-3 lg:gap-4">
        {data.map((c) => (
          <CardComercio key={c.id} {...c} onToggleFavorito={(id) => console.log("toggle", id)} />
        ))}
      </div>
    </div>
  );
};
