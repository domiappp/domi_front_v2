import React from "react"

interface ProductoImagen {
  id: string
  nombre: string
  descripcion?: string
  imagen: string
}

interface Props {
  productos: ProductoImagen[]
  whatsappNumber?: string
}

const GaleriaImagenes: React.FC<Props> = ({ productos, whatsappNumber }) => {
  const API_BASE_URL = import.meta.env.VITE_API_URL

  const getImageUrl = (path?: string) => {
    if (!path) return ""
    if (/^https?:\/\//i.test(path)) return path
    return `${API_BASE_URL}/archivos/${path}`
  }

  // 👉 abrir WhatsApp con mensaje personalizado
  const handleClickImage = (producto: ProductoImagen) => {
    if (!whatsappNumber) {
      console.warn("No se envió un número de WhatsApp desde ComercioPage")
      return
    }

    const number = whatsappNumber.replace(/\D/g, "") // solo números

    const message = encodeURIComponent(
      `Hola, buenas. Me interesa este producto "${producto.nombre}". ¿Está disponible?`
    )

    const url = `https://wa.me/${number}?text=${message}`

    window.open(url, "_blank")
  }

  if (!productos || productos.length === 0) {
    return (
      <div className="mt-6 flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-8">
        <div className="text-3xl mb-2">🖼️</div>
        <p className="text-sm font-semibold text-slate-800 mb-1">
          Aún no hay imágenes en la galería
        </p>
        <p className="text-xs text-slate-500 max-w-sm">
          Cuando este comercio suba fotos de sus productos, promociones o instalaciones,
          las podrás ver aquí.
        </p>
      </div>
    )
  }

  // mostramos solo las primeras 4 imágenes como antes
  const soloCuatro = productos.slice(0, 4)
  const total = productos.length

  return (
    <section className="mt-4 space-y-3">
      {/* Encabezado elegante */}
      <div className="flex items-end justify-between gap-2">
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-900 flex items-center gap-2">
            Galería de imágenes
            <span className="text-xl md:text-2xl">📸</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md">
            Explora algunas fotos destacadas del comercio y toca una imagen para consultar por WhatsApp.
          </p>
        </div>

        <div className="hidden sm:inline-flex items-center gap-1 rounded-full bg-slate-50 border border-slate-200 px-3 py-1.5 text-[11px] text-slate-600">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
          <span>
            {total} {total === 1 ? "foto" : "fotos"}
          </span>
        </div>
      </div>

      {/* Grid de imágenes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {soloCuatro.map((producto) => (
          <button
            key={producto.id}
            type="button"
            onClick={() => handleClickImage(producto)}
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 text-left shadow-sm hover:shadow-lg transition-shadow duration-300"
          >
            {/* Imagen */}
            <img
              src={getImageUrl(producto.imagen)}
              alt={producto.nombre}
              className="h-full w-full object-cover transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[1deg]"
            />

            {/* Overlay degradado */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

            {/* Badge WhatsApp (si hay número) */}
            {whatsappNumber && (
              <span className="pointer-events-none absolute top-2 right-2 inline-flex items-center rounded-full bg-black/55 px-2.5 py-1 text-[9px] font-medium uppercase tracking-wide text-emerald-200 backdrop-blur-sm">
                Consultar por WhatsApp
              </span>
            )}

            {/* Texto bottom */}
            <div className="absolute inset-x-2 bottom-2 flex flex-col gap-0.5 text-white drop-shadow-sm">
              <p className="text-xs sm:text-sm font-semibold line-clamp-1">
                {producto.nombre}
              </p>
              {producto.descripcion && (
                <p className="text-[10px] sm:text-[11px] text-slate-100/90 line-clamp-2">
                  {producto.descripcion}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Indicador pequeño si hay más de 4 */}
      {total > soloCuatro.length && (
        <p className="text-[11px] text-slate-500 mt-1">
          Mostrando {soloCuatro.length} de {total} imágenes disponibles.
        </p>
      )}
    </section>
  )
}

export default GaleriaImagenes
