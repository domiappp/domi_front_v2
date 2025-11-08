// src/shared/components/CategoriaProductos.tsx
import React from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination } from "swiper/modules"
import { CategoriaPublic } from "../types/categoriasTypes"

type Props = {
  categorias?: CategoriaPublic[]
  categoriaActiva: "Todas" | number
  onChange: (categoriaId: "Todas" | number) => void
}

const CategoriaProductos: React.FC<Props> = ({
  categorias = [],
  categoriaActiva,
  onChange,
}) => {
  return (
    <div className="mb-4">
      <style>{`
        .cat-chips .swiper-pagination-bullet { background: #E5E7EB; opacity: 1; }
        .cat-chips .swiper-pagination-bullet-active { background: #F97316; }
      `}</style>

      <Swiper
        className="cat-chips"
        modules={[Pagination]}
        slidesPerView={"auto"}
        spaceBetween={8}
        pagination={{ clickable: true }}
      >
        {/* Chip "Todas" */}
        <SwiperSlide key="todas" className="!w-auto !mr-2">
          <button
            className={`px-4 py-2 rounded-full border text-sm whitespace-nowrap transition ${
              categoriaActiva === "Todas"
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
            }`}
            onClick={() => onChange("Todas")}
          >
            Todas
          </button>
        </SwiperSlide>

        {/* Chips dinámicas */}
        {categorias.map((c) => (
          <SwiperSlide key={c.id} className="!w-auto !mr-2">
            <button
              className={`px-4 py-2 rounded-full border text-sm whitespace-nowrap transition ${
                categoriaActiva === c.id
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
              }`}
              onClick={() => onChange(c.id)}
            >
              {c.nombre}
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default CategoriaProductos
