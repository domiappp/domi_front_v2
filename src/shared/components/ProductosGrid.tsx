import React from 'react'
import ProductoCard from './ProductoCard'

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

const ProductosGrid: React.FC<Props> = ({ productos, query, onSearch, onAdd }) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Buscar productos..."
        className="w-full border rounded-lg px-3 py-2 mb-4"
        value={query}
        onChange={(e) => onSearch(e.target.value)}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {productos.map((p) => (
          <ProductoCard key={p.id} {...p} onAdd={onAdd} />
        ))}
      </div>
    </div>
  )
}

export default ProductosGrid
