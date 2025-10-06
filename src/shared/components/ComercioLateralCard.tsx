import React, { useId } from "react";
import { Heart, ChevronRight, Star, MapPin } from "lucide-react";

// ========================================================
// ComercioLateralCard: variante con IMAGEN A LA IZQUIERDA
// - Layout responsive: en móviles stack (1 columna);
//   en md+ usa layout horizontal con imagen a la izquierda.
// - Cambiado el nombre del componente.
// - Solo muestra información clave (estado, categoría, rating, ubicación).
// - Accesible y listo para teclado.
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

// Pill estado abierto/cerrado
const EstadoPill: React.FC<{ abierto?: boolean }> = ({ abierto }) => {
  const isOpen = abierto === true;
  const isClosed = abierto === false;

  const base = "inline-flex items-center rounded-full px-2 py-0.5 text-[12px] font-medium";
  const openCls = "bg-emerald-100 text-emerald-700";
  const closedCls = "bg-rose-100 text-rose-700";
  const neutralCls = "bg-gray-100 text-gray-600";

  return (
    <span className={`${base} ${isOpen ? openCls : isClosed ? closedCls : neutralCls}`}>
      {isOpen ? "Abierto" : isClosed ? "Cerrado" : "Horario no disponible"}
    </span>
  );
};

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
  return (
    <article className="group relative overflow-hidden rounded-2xl bg-white ring-1 ring-[#F2F2F2] shadow-sm transition supports-[hover:hover]:hover:shadow-md">
      {/* Contenedor responsive: en sm stack; en md horizontal */}
      <div className="flex flex-col md:flex-row">
        {/* Imagen a la izquierda en md+ */}
        <div className="relative md:w-48 md:h-48 w-full h-40 shrink-0">
          <img
            src={imagen}
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
            <span className="font-medium text-[#333333]">{round(rating) ?? 0}</span>
            {typeof reviews === "number" && <span className="text-gray-500">• {reviews}</span>}
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
// Demo de lista responsive
// - Móvil: 1 columna
// - md: 2 columnas
// - lg: 3 columnas
// SOLO 5 EJEMPLOS
// ========================================================
export const ListaComerciosLateralDemo: React.FC = () => {
  const data: ComercioLateralCardProps[] = [
    {
      id: "a1",
      nombre: "Hamburguesas Mix",
      categoria: "Hamburguesería",
      imagen:
        "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=600&auto=format&fit=crop",
      rating: 4.7,
      reviews: 201,
      esFavorito: true,
      abierto: true,
      ubicacion: "Cll 45 #18-22",
    },
    {
      id: "a2",
      nombre: "Café Central",
      categoria: "Cafetería",
      imagen:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&auto=format&fit=crop",
      rating: 4.2,
      reviews: 98,
      esFavorito: false,
      abierto: false,
      ubicacion: "Av. 7 #114-09",
    },
    {
      id: "a3",
      nombre: "Sushi House",
      categoria: "Sushi",
      imagen:
        "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=600&auto=format&fit=crop",
      rating: 4.6,
      reviews: 156,
      esFavorito: false,
      abierto: true,
      ubicacion: "Transv. 93 #65-30",
    },
    {
      id: "a4",
      nombre: "Pizzería La Nonna",
      categoria: "Pizzería",
      imagen:
        "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=600&auto=format&fit=crop",
      rating: 4.5,
      reviews: 312,
      esFavorito: true,
      abierto: true,
      ubicacion: "Cra 9 #72-34",
    },
    {
      id: "a5",
      nombre: "Arepas Doña Luz",
      categoria: "Comida típica",
      imagen:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&auto=format&fit=crop",
      rating: 4.3,
      reviews: 87,
      esFavorito: false,
      abierto: true,
      ubicacion: "Calle 3 #10-21",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl p-3 sm:p-4">
      <h2 className="mb-3 text-base sm:text-lg font-semibold">Recomendados</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {data.map((c) => (
          <ComercioLateralCard key={c.id} {...c} onToggleFavorito={(id) => console.log("toggle", id)} />)
        )}
      </div>
    </div>
  );
};
