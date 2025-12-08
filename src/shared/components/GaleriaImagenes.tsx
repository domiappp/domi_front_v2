import React from "react"

interface ProductoImagen {
  id: string
  nombre: string
  descripcion?: string
  imagen: string      // aquí recibes solo el path del backend
}

interface Props {
  productos: ProductoImagen[]
}

const GaleriaImagenes: React.FC<Props> = ({ productos }) => {
  const API_BASE_URL = import.meta.env.VITE_API_URL

  console.log(productos)

  const getImageUrl = (path?: string) => {
    if (!path) return ""
    // Si ya viene como URL completa
    if (/^https?:\/\//i.test(path)) return path

    // ✔️ RUTA CORRECTA SEGÚN TU BACKEND
    return `${API_BASE_URL}/archivos/${path}`
  }

  if (!productos || productos.length === 0) {
    return (
      <div className="mt-6 text-center text-gray-500">
        No hay imágenes para mostrar todavía.
      </div>
    )
  }

  const soloCuatro = productos.slice(0, 4)

  return (
    <div className="mt-6">
      <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800">
        Galería de imágenes
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {soloCuatro.map((producto) => (
          <div
            key={producto.id}
            className="group relative overflow-hidden rounded-xl shadow-md bg-white"
          >
            <img
              src={getImageUrl(producto.imagen)}
              alt={producto.nombre}
              className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
              <div className="p-2 text-xs text-white">
                <p className="font-semibold truncate">{producto.nombre}</p>
                {producto.descripcion && (
                  <p className="text-[11px] line-clamp-2">
                    {producto.descripcion}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GaleriaImagenes
