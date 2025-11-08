// src/pages/comercio/ComercioPage.tsx
import React, { useState } from "react"
import { useParams } from "react-router-dom"
import CategoriaProductos from "../../shared/components/CategoriaProductos"
import ProductosGrid from "../../shared/components/ProductosGrid"
import { useCategoriaByComercio } from "../../services/useCategorias"
import { useProductsByComercioCategoria } from "../../services/useProducts"

const ComercioPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const comercioId = Number(id)

  const [categoriaActiva, setCategoriaActiva] = useState<"Todas" | number>("Todas")
  const [query, setQuery] = useState("")

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
    page: 1, // si luego quieres paginación, lo manejas con estado
  })

  if (!id || Number.isNaN(comercioId)) {
    return <div>ID de comercio inválido</div>
  }

  if (loadingCategorias) return <div>Cargando categorías...</div>
  if (errorCategorias) return <div>Error al cargar categorías</div>

  const comercio = categoriasProductos?.comercio
  const categorias = categoriasProductos?.categorias || []

  // Adaptamos los productos del backend al formato que espera ProductosGrid
  const productos = (productosData?.items || []).map((p) => ({
    id: String(p.id),
    nombre: p.nombre,
    descripcion: p.descripcion,
    precio: p.precio,
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqIvY_EddgWVLKNZD3S-xTjijRkfogKFxFkA&s",
  }))

  return (
    <div className="mb-32">

    <div className="px-4 py-6 h-52 flex justify-center items-center flex-col bg-[#f4e3e3]">
        <h1 className="text-7xl text-[#E76B51] font-bold">
          {comercio?.nombre_comercial || "Comercio"}
        </h1>
        <p className="text-[#E76B51] mb-6 mt-3">
          {comercio?.descripcion || "Descripción del comercio"}
        </p>
    </div>

      <div className="max-w-full mx-auto px-4 py-6">
      

        {/* Chips de categorías (incluye "Todas" por defecto) */}
        <CategoriaProductos
          categorias={categorias}
          categoriaActiva={categoriaActiva}
          onChange={(catId) => {
            setCategoriaActiva(catId)
            // opcional: resetear búsqueda al cambiar categoría
            // setQuery("")
          }}
        />

        {/* Grid de productos con buscador */}
        {loadingProductos && <div>Cargando productos...</div>}
        {errorProductos && <div>Error al cargar productos</div>}

        {!loadingProductos && !errorProductos && (
          <ProductosGrid
            productos={productos}
            query={query}
            onSearch={setQuery}
            onAdd={(productId) =>
              console.log("Agregar producto al carrito:", productId)
            }
          />
        )}
      </div>
    </div>
  )
}

export default ComercioPage
