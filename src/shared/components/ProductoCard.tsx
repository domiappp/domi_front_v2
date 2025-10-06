import React from 'react'

type Props = {
  id: string
  nombre: string
  descripcion?: string
  precio: number
  imagen: string
  onAdd: (id: string) => void
}

const ProductoCard: React.FC<Props> = ({ id, nombre, descripcion, precio, imagen, onAdd }) => {
  return (
    <div className="bg-white rounded-xl shadow p-3 flex flex-col">
      <img src={imagen} alt={nombre} className="h-32 w-full object-cover rounded-lg mb-2" />
      <h3 className="font-semibold text-sm">{nombre}</h3>
      <p className="text-xs text-gray-500 line-clamp-2">{descripcion}</p>
      <div className="flex justify-between items-center mt-2">
        <span className="text-orange-600 font-bold">${precio.toLocaleString()}</span>
        <button
          className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center"
          onClick={() => onAdd(id)}
        >
          +
        </button>
      </div>
    </div>
  )
}

export default ProductoCard
