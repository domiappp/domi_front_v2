// src/shared/components/ProductosGrid.tsx
import React from "react"
import ProductoCard from "./ProductoCard"

type Producto = {
  id: string
  nombre: string
  descripcion?: string
  precio: number
  imagen: string
}

type Props = {
  productos: Producto[]
  query: string
  onSearch: (q: string) => void
  onAdd: (id: string) => void
}

const ProductosGrid: React.FC<Props> = ({
  productos,
  query,
  onSearch,
  onAdd,
}) => {
  return (
    <div>
      <div className="my-8 flex justify-center">
        <input
          type="text"
          placeholder="Buscar producto.."
          className="w-full max-w-lg px-4 py-3 rounded-md  text-[#E76B51] placeholder-[#E76B51] bg-[#f4e3e3]  focus:border-orange-600 focus:ring-1 focus:ring-orange-600 outline-none transition"
          value={query}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
        {productos.map((p) => (
          <ProductoCard key={p.id} {...p} onAdd={onAdd} />
        ))}
      </div>
    </div>
  )
}

export default ProductosGrid
