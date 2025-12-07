import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

import CategoriaProductos from "../../shared/components/CategoriaProductos"
import ProductosGrid from "../../shared/components/ProductosGrid"
import GaleriaImagenes from "../../shared/components/GaleriaImagenes"

import { useCategoriaByComercio2 } from "../../services/useCategorias"
import { useProductsByComercioCategoria } from "../../services/useProducts"
import { useCartStore } from "../../store/cart.store"
import { useGlobalModal } from "../../store/modal.store"

import {
  ShoppingCart,
  ArrowLeft,
  Share2,
  MapPin,
  Info,
} from "lucide-react"

interface ProductoAdaptado {
  id: string
  nombre: string
  descripcion?: string
  precio: number
  imagen: string
}

const productosImg = [
  {
    id: "1",
    nombre: "Imagen 1",
    imagen:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0TXbb0QH6YAytgZTGJbPdqH06UNZShNGQ0A&s",
  },
  {
    id: "2",
    nombre: "Imagen 2",
    imagen:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0OJmpccbG0Eq7zWnULcZVSdILsqZBTqEDFg&s",
  },
  {
    id: "3",
    nombre: "Imagen 3",
    imagen:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcFPOgWraYIg-tD9CVg7GUBqzI7tw75hKr-g&s",
  },
  {
    id: "4",
    nombre: "Banner Restaurante",
    imagen:
      "https://img.freepik.com/vector-gratis/conjunto-banners-restaurante-foto_23-2147859055.jpg?semt=ais_hybrid&w=740&q=80",
  },
]

const ComercioPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const comercioId = Number(id)

  const [categoriaActiva, setCategoriaActiva] = useState<"Todas" | number>("Todas")
  const [query, setQuery] = useState("")
  const [viewMode, setViewMode] = useState<"productos" | "galeria">("productos")

  // 🛒 Zustand carrito
  const setActiveComercio = useCartStore((s) => s.setActiveComercio)
  const addItem = useCartStore((s) => s.addItem)
  const toggleCart = useCartStore((s) => s.toggle)
  const activeComercioId = useCartStore((s) => s.activeComercioId)
  const getUniqueCount = useCartStore((s) => s.getUniqueCount)
  const uniqueCount = getUniqueCount(activeComercioId)

  // 🌐 Modal global
  const { open } = useGlobalModal()

  // marcar comercio activo
  useEffect(() => {
    if (!Number.isNaN(comercioId)) {
      setActiveComercio(comercioId)
    }
  }, [comercioId, setActiveComercio])

  // Categorías + info del comercio
  const {
    data: categoriasProductos,
    isLoading: loadingCategorias,
    isError: errorCategorias,
  } = useCategoriaByComercio2(comercioId)

  // Productos
  const {
    data: productosData,
    isLoading: loadingProductos,
    isError: errorProductos,
  } = useProductsByComercioCategoria({
    comercioId,
    categoriaId: categoriaActiva === "Todas" ? undefined : categoriaActiva,
    search: query || undefined,
    page: 1,
  })

  const comercio = categoriasProductos?.comercio
  const categorias = categoriasProductos?.categorias || []

  // 👇 según backend:
  // 0 = productos, 1 = imágenes, 2 = ambos
  const estadoServicio = comercio?.estado_servicio

  const showProductos =
    estadoServicio === 0 || estadoServicio === 2 || estadoServicio === undefined
  const showGaleria = estadoServicio === 1 || estadoServicio === 2

  // 🔁 este useEffect debe llamarse SIEMPRE, no después de returns condicionales
  useEffect(() => {
    if (!comercio) return
    if (estadoServicio === 1) {
      setViewMode("galeria")
    } else {
      setViewMode("productos")
    }
  }, [comercio, estadoServicio])

  // 👉 abrir modal de compartir
  const handleOpenShareModal = () => {
    const url = typeof window !== "undefined" ? window.location.href : ""
    const encodedUrl = encodeURIComponent(url)
    const title = comercio?.nombre_comercial || "Este comercio"

    open({
      title: "Compartir comercio",
      size: "md",
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Comparte este comercio con tus amigos:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* WhatsApp */}
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `Mira este comercio: ${title} ${url}`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50/70 px-3 py-3 text-sm font-medium text-emerald-700 hover:bg-emerald-50 transition"
            >
              <span className="text-lg">🟢</span>
              <span>WhatsApp</span>
            </a>

            {/* Facebook */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center justify-center rounded-xl border border-blue-100 bg-blue-50/70 px-3 py-3 text-sm font-medium text-blue-700 hover:bg-blue-50 transition"
            >
              <span className="text-lg">📘</span>
              <span>Facebook</span>
            </a>

            {/* Instagram (abre la app / web con la URL) */}
            <a
              href={`https://www.instagram.com/?url=${encodedUrl}`}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center justify-center rounded-xl border border-pink-100 bg-pink-50/70 px-3 py-3 text-sm font-medium text-pink-700 hover:bg-pink-50 transition"
            >
              <span className="text-lg">📸</span>
              <span>Instagram</span>
            </a>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <p className="text-xs font-medium text-slate-500 mb-1">
              Enlace directo
            </p>
            <div className="flex items-center gap-2 text-xs bg-slate-50 rounded-lg px-3 py-2 border border-slate-200">
              <span className="truncate">{url}</span>
            </div>
          </div>
        </div>
      ),
    })
  }

  // 🚨 A PARTIR DE AQUÍ, NINGÚN HOOK NUEVO
  if (!id || Number.isNaN(comercioId)) {
    return <div className="p-4 text-center text-red-500">ID de comercio inválido</div>
  }

  if (loadingCategorias)
    return <div className="p-4 text-center">Cargando categorías...</div>
  if (errorCategorias)
    return (
      <div className="p-4 text-center text-red-500">
        Error al cargar categorías
      </div>
    )

  // Adaptamos los productos
  const productos: ProductoAdaptado[] = (productosData?.items || []).map((p) => ({
    id: String(p.id),
    nombre: p.nombre,
    descripcion: p.descripcion,
    precio: p.precio,
    imagen:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqIvY_EddgWVLKNZD3S-xTjijRkfogKFxFkA&s",
  }))

  const handleAddToCart = (productId: string) => {
    const product = productos.find((p) => p.id === productId)
    if (!product) return

    addItem(comercioId, {
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      imagen: product.imagen,
    })
  }

  return (
    <div className="mb-32">
      {/* HEADER PROFESIONAL */}
      <header className="relative w-full bg-gradient-to-b from-[#FFE3D3] via-[#FFECE0] to-white border-b border-orange-100/60">
        <div className="mx-auto max-w-6xl px-4 pt-4 pb-6 sm:pt-5 sm:pb-8">
          {/* Top row: volver + compartir + resumen carrito */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-white/90 px-3 py-1.5 text-xs sm:text-sm font-medium text-[#E76B51] shadow-sm hover:bg-orange-50 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </button>

            <div className="flex items-center gap-2">
              {uniqueCount > 0 && (
                <div className="hidden sm:inline-flex items-center gap-2 rounded-full bg-white/90 border border-orange-100 px-3 py-1.5 text-xs text-slate-700 shadow-sm">
                  <ShoppingCart className="w-4 h-4 text-[#E76B51]" />
                  <span className="font-medium">{uniqueCount}</span>
                  <span className="text-[11px] text-slate-500">
                    productos en el carrito
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={handleOpenShareModal}
                className="inline-flex items-center justify-center rounded-full bg-white/90 border border-orange-100 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 shadow-sm hover:bg-orange-50 transition"
                aria-label="Compartir comercio"
              >
                <Share2 className="w-4 h-4 mr-1 text-[#E76B51]" />
                <span className="hidden sm:inline">Compartir</span>
              </button>
            </div>
          </div>

          {/* Bloque principal header */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 sm:gap-6">
            <div className="flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#E76B51]/80 mb-1">
                Comercio aliado
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                {comercio?.nombre_comercial || "Comercio"}
              </h1>

              <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-xl">
                {comercio?.descripcion || "Descripción del comercio"}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs sm:text-[13px] text-slate-600">
                {comercio?.direccion && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/80 border border-slate-200 px-3 py-1">
                    <MapPin className="w-3 h-3 text-[#E76B51]" />
                    <span className="truncate max-w-[180px] sm:max-w-xs">
                      {comercio.direccion}
                    </span>
                  </span>
                )}

                {estadoServicio === 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-emerald-700">
                    <Info className="w-3 h-3" />
                    Solo productos
                  </span>
                )}
                {estadoServicio === 1 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-blue-700">
                    <Info className="w-3 h-3" />
                    Solo galería
                  </span>
                )}
                {estadoServicio === 2 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#E76B51]/10 border border-[#E76B51]/30 px-3 py-1 text-[#E76B51]">
                    <Info className="w-3 h-3" />
                    Productos y galería
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-center md:justify-end">
              <div className="relative">
                <div className="rounded-2xl bg-white/80 border border-orange-100 shadow-lg p-2">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center">
                    <img
                      src={
                        (comercio as any)?.logo_url ||
                        "https://img.daisyui.com/images/profile/demo/yellingcat@192.webp"
                      }
                      alt={comercio?.nombre_comercial || "Logo del comercio"}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {uniqueCount > 0 && (
                    <div className="absolute -bottom-2 right-2 inline-flex items-center justify-center rounded-full bg-[#E76B51] text-white text-[11px] px-2 py-0.5 shadow-md">
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      {uniqueCount}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENIDO */}
      <div className="container mx-auto px-4 py-6">
        {/* SWITCH PRODUCTOS / GALERÍA */}
        {showProductos && showGaleria && (
          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-full bg-white/80 shadow-md border border-gray-200 p-1">
              <button
                type="button"
                onClick={() => setViewMode("productos")}
                className={`px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base rounded-full transition-all ${
                  viewMode === "productos"
                    ? "bg-[#E76B51] text-white shadow"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Productos
              </button>

              <button
                type="button"
                onClick={() => setViewMode("galeria")}
                className={`px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base rounded-full transition-all ${
                  viewMode === "galeria"
                    ? "bg-[#E76B51] text-white shadow"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Galería
              </button>
            </div>
          </div>
        )}

        {/* Vista PRODUCTOS */}
        {showProductos && viewMode === "productos" && (
          <>
            <CategoriaProductos
              categorias={categorias}
              categoriaActiva={categoriaActiva}
              onChange={(catId) => setCategoriaActiva(catId)}
            />

            {loadingProductos && <div className="mt-4">Cargando productos...</div>}
            {errorProductos && (
              <div className="mt-4 text-red-500">Error al cargar productos</div>
            )}

            {!loadingProductos && !errorProductos && (
              <div className="mt-4">
                <ProductosGrid
                  productos={productos}
                  query={query}
                  onSearch={setQuery}
                  onAdd={handleAddToCart}
                />
              </div>
            )}
          </>
        )}

        {/* Vista GALERÍA */}
        {showGaleria && viewMode === "galeria" && (
          <GaleriaImagenes productos={productosImg} />
        )}

        {/* BOTÓN CARRITO */}
        <button
          type="button"
          onClick={toggleCart}
          className="fixed bottom-20 right-4 sm:right-6 z-30 bg-[#E76B51] text-white rounded-full shadow-lg px-4 py-3 flex items-center gap-2"
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="hidden sm:inline">Ver carrito</span>

          {uniqueCount > 0 && (
            <span className="absolute -top-2 -right-2 inline-flex items-center justify-center min-w-[22px] h-[22px] text-xs font-bold rounded-full bg-white text-[#E76B51] shadow-md">
              {uniqueCount}
            </span>
          )}
        </button>
      </div>
    </div>
  )
}

export default ComercioPage
