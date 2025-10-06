// src/components/CategoriaProductos.tsx
import React from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination } from "swiper/modules"


type Props = {
  categorias: string[]
  categoriaActiva: string
  onChange: (c: string) => void
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
        {categorias.map((c) => (
          <SwiperSlide key={c} className="!w-auto !mr-2">
            <button
              className={`px-4 py-2 rounded-full border text-sm whitespace-nowrap transition ${
                categoriaActiva === c
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
              }`}
              onClick={() => onChange(c)}
            >
              {c}
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default CategoriaProductos
