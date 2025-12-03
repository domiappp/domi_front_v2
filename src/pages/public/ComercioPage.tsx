// src/pages/comercio/ComercioPage.tsx
import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"

import CategoriaProductos from "../../shared/components/CategoriaProductos"
import ProductosGrid from "../../shared/components/ProductosGrid"
import GaleriaImagenes from "../../shared/components/GaleriaImagenes"

import { useCategoriaByComercio } from "../../services/useCategorias"
import { useProductsByComercioCategoria } from "../../services/useProducts"
import { useCartStore } from "../../store/cart.store"   // 👈 importar
import { ShoppingCart } from "lucide-react"

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
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0TXbb0QH6YAytgZTGJbPdqH06UNZShNGQ0A&s"
  },
  {
    id: "2",
    nombre: "Imagen 2",
    imagen:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0OJmpccbG0Eq7zWnULcZVSdILsqZBTqEDFg&s"
  },
  {
    id: "3",
    nombre: "Imagen 3",
    imagen:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcFPOgWraYIg-tD9CVg7GUBqzI7tw75hKr-g&s"
  },
  {
    id: "4",
    nombre: "Banner Restaurante",
    imagen:
      "https://img.freepik.com/vector-gratis/conjunto-banners-restaurante-foto_23-2147859055.jpg?semt=ais_hybrid&w=740&q=80"
  }
]


const ComercioPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const comercioId = Number(id)

  const [categoriaActiva, setCategoriaActiva] = useState<"Todas" | number>("Todas")
  const [query, setQuery] = useState("")
  const [viewMode, setViewMode] = useState<"productos" | "galeria">("productos")

  // 🛒 Zustand carrito
  const setActiveComercio = useCartStore((s) => s.setActiveComercio)
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.open)

  const toggleCart = useCartStore((s) => s.toggle)

const activeComercioId = useCartStore((s) => s.activeComercioId);
const getUniqueCount = useCartStore((s) => s.getUniqueCount);
const uniqueCount = getUniqueCount(activeComercioId);

  // 🔹 marcar comercio activo en el store cuando cambie
  useEffect(() => {
    if (!Number.isNaN(comercioId)) {
      setActiveComercio(comercioId)
    }
  }, [comercioId, setActiveComercio])

  // 🔹 Categorías del comercio
  const {
    data: categoriasProductos,
    isLoading: loadingCategorias,
    isError: errorCategorias,
  } = useCategoriaByComercio(comercioId)

  // 🔹 Productos según comercio + categoría + búsqueda
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

  if (!id || Number.isNaN(comercioId)) {
    return <div className="p-4 text-center text-red-500">ID de comercio inválido</div>
  }

  if (loadingCategorias) return <div className="p-4 text-center">Cargando categorías...</div>
  if (errorCategorias)
    return <div className="p-4 text-center text-red-500">Error al cargar categorías</div>

  const comercio = categoriasProductos?.comercio
  const categorias = categoriasProductos?.categorias || []

  // Adaptamos los productos
  const productos: ProductoAdaptado[] = (productosData?.items || []).map((p) => ({
    id: String(p.id),
    nombre: p.nombre,
    descripcion: p.descripcion,
    precio: p.precio,
    imagen:
   
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqIvY_EddgWVLKNZD3S-xTjijRkfogKFxFkA&s",
  }))

  // handler para agregar al carrito
  const handleAddToCart = (productId: string) => {
    const product = productos.find((p) => p.id === productId)
    if (!product) return

    addItem(comercioId, {
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      imagen: product.imagen,
    })

    // opcional: abrir el sidebar al agregar
    // openCart()
  }

  return (
    <div className="mb-32">
      {/* HEADER */}
      <div className="px-4 py-8 md:py-10 relative min-h-[180px] md:min-h-[220px] flex justify-center items-center flex-col bg-[#f4e3e3]">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-[#E76B51] font-bold text-center break-words">
          {comercio?.nombre_comercial || "Comercio"}
        </h1>

        <p className="text-[#E76B51] mb-4 mt-3 text-center max-w-2xl text-sm md:text-base">
          {comercio?.descripcion || "Descripción del comercio"}
        </p>

        <div className="mt-2 md:mt-0 md:absolute md:right-[8%] md:-bottom-16">
          <div className="avatar flex justify-center">
            <div className="w-28 sm:w-36 md:w-44 lg:w-60 rounded-full border-4  border-white shadow-lg">
              <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
            </div>
          </div>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="container mx-auto px-4 py-6">
        {/* SWITCH PRODUCTOS / GALERÍA */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-full bg-white/80 shadow-md border border-gray-200 p-1">
            <button
              type="button"
              onClick={() => setViewMode("productos")}
              className={`px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base rounded-full transition-all ${viewMode === "productos"
                  ? "bg-[#E76B51] text-white shadow"
                  : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              Productos
            </button>

            <button
              type="button"
              onClick={() => setViewMode("galeria")}
              className={`px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base rounded-full transition-all ${viewMode === "galeria"
                  ? "bg-[#E76B51] text-white shadow"
                  : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              Galería
            </button>
          </div>
        </div>

        {/* Vista PRODUCTOS */}
        {viewMode === "productos" && (
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
                  onAdd={handleAddToCart}  // 👈 AQUÍ
                />
              </div>
            )}
          </>
        )}

        {/* Vista GALERÍA */}
        {viewMode === "galeria" && <GaleriaImagenes productos={productosImg} />}

      <button
          type="button"
          onClick={toggleCart}
          className="fixed bottom-20 right-6 z-30 bg-[#E76B51] text-white rounded-full shadow-lg px-4 py-3 flex items-center gap-2 "
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Ver carrito</span>

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
