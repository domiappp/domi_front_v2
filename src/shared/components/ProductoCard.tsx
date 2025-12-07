import React from "react"
import { Plus } from "lucide-react"

type Props = {
  id: string
  nombre: string
  descripcion?: string
  precio: number
  imagen: string
  onAdd: (id: string) => void
}

const ProductoCard: React.FC<Props> = ({
  id,
  nombre,
  descripcion,
  precio,
  imagen,
  onAdd,
}) => {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      {/* Imagen */}
      <div className="relative mb-2 overflow-hidden rounded-xl bg-slate-100">
        <img
          src={imagen}
          alt={nombre}
          className="h-40 w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Info producto */}
      <div className="flex flex-1 flex-col">
        <h3 className="text-sm font-semibold text-slate-900 line-clamp-2">
          {nombre}
        </h3>
        {descripcion && (
          <p className="mt-1 text-xs text-slate-500 line-clamp-2">
            {descripcion}
          </p>
        )}

        {/* Precio + botón */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-bold text-[#E76B51]">
            ${precio.toLocaleString()}
          </span>

          <button
            type="button"
            onClick={() => onAdd(id)}
            className="group relative inline-flex items-center gap-1 overflow-hidden rounded-full bg-[#E76B51] px-3 py-1.5 text-xs font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#d85f46] hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#E76B51]/60 focus:ring-offset-1"
          >
            {/* brillo animado */}
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-300 ease-out group-hover:translate-x-full" />
            <span className="relative flex items-center gap-1">
              <Plus className="h-3 w-3" />
              <span>Agregar</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductoCard
