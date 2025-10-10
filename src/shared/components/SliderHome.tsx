import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { SwiperOptions } from "swiper/types";
import { usePublicidad } from "../../services/usePublicidad";
import ButtonLink from "./ButtonLink";

interface PublicidadItem {
  id: number;
  imagen: string;
  ruta?: string | null;
  estado: number;
  orden?: number | null;
  fecha_inicio?: string | null;
  fecha_fin?: string | null;
}

const SliderHome: React.FC = () => {
  const { data: publicidad, isLoading, isError } = usePublicidad();

  const API_BASE_URL = import.meta.env.VITE_API_URL ?? "";

  const getImageUrl = (path?: string | null) => {
    if (!path) return "";
    if (/^https?:\/\//i.test(path)) return path;
    return `${API_BASE_URL}${path}`;
  };

  const slides: PublicidadItem[] = useMemo(() => {
    const list = Array.isArray(publicidad) ? (publicidad as PublicidadItem[]) : [];
    return list
      .filter((i) => i.estado === 1)
      .sort((a, b) => (a.orden ?? 9999) - (b.orden ?? 9999));
  }, [publicidad]);

  if (isLoading) {
    return (
      <div className="relative w-full h-[28vh] lg:h-[45vh] rounded-2xl overflow-hidden lg:rounded-none animate-pulse bg-base-200" />
    );
  }

  if (isError) {
    return (
      <div className="relative w-full h-[28vh] lg:h-[45vh] rounded-2xl overflow-hidden lg:rounded-none flex items-center justify-center bg-base-200">
        <p className="text-sm opacity-70">No se pudieron cargar los banners.</p>
      </div>
    );
  }

  if (!slides.length) {
    return (
      <div className="relative w-full h-[28vh] lg:h-[45vh] rounded-2xl overflow-hidden lg:rounded-none flex items-center justify-center bg-base-200">
        <p className="text-sm opacity-70">Sin publicidad disponible.</p>
      </div>
    );
  }

  const navSelectors: SwiperOptions["navigation"] = {
    enabled: true,
    prevEl: ".btn-prev",
    nextEl: ".btn-next",
  };

  return (
    <div className="relative w-full h-[28vh] lg:h-[48vh] scale-95 lg:scale-100 rounded-2xl overflow-hidden lg:rounded-none">
      {/* Badges arriba-derecha */}
      <div className="absolute top-5 right-6 z-10 flex gap-3">
        <div className="badge badge-warning">Pitalito - Huila</div>
      </div>

      {/* Avatares abajo-izquierda */}
      <div className="absolute bottom-5 left-6 z-10 flex gap-3">
        <div className="avatar">
          <div className="ring-primary ring-offset-base-100 size-7 lg:size-10 rounded-full ring-2 ring-offset-2 overflow-hidden flex items-center justify-center">
            <img src="facebook.png" alt="Facebook" className="w-full h-full object-contain" />
          </div>
        </div>
        <div className="avatar">
          <div className="ring-pink-500 ring-offset-base-100 size-7 lg:size-10 rounded-full ring-2 ring-offset-2 overflow-hidden flex items-center justify-center">
            <img src="instagram.png" alt="Instagram" className="w-full h-full object-contain" />
          </div>
        </div>
        <div className="avatar">
          <div className="ring-green-500 ring-offset-base-100 size-7 lg:size-10 rounded-full ring-2 ring-offset-2 overflow-hidden flex items-center justify-center">
            <img src="whatsapp.png" alt="WhatsApp" className="w-full h-full object-contain" />
          </div>
        </div>
      </div>

      {/* Botones personalizados (con selectores CSS) */}
      <button
        aria-label="Anterior"
        className="btn-prev group absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 backdrop-blur p-2
                   hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white/60 transition shadow-md"
      >
        <ChevronLeft className="size-5 text-white group-active:translate-x-[-2px] transition" />
      </button>

      <button
        aria-label="Siguiente"
        className="btn-next group absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 backdrop-blur p-2
                   hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white/60 transition shadow-md"
      >
        <ChevronRight className="size-5 text-white group-active:translate-x-[2px] transition" />
      </button>

      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        loop={slides.length > 1}
        autoplay={slides.length > 1 ? { delay: 7000, disableOnInteraction: false } : false}
        pagination={{ clickable: true }}
        navigation={navSelectors}
        className="w-full h-full"
      >
        {slides.map((item) => {
          const src = getImageUrl(item.imagen);

          return (
            <SwiperSlide key={item.id} className="relative">
              <div className="relative w-full h-full">
                {/* Imagen */}
                <img
                  src={src}
                  alt={`Publicidad ${item.id}`}
                  className="w-full h-full object-cover select-none"
                  draggable={false}
                  loading="eager"
                />

                {/* Overlay oscuro (no bloquea el click del botón) */}
                <div className="pointer-events-none absolute inset-0 bg-black/20 lg:bg-black/10 z-10" />

                {/* Botón absoluto (solo si hay ruta) */}
                {item.ruta ? (
                  <div
                    className="absolute bottom-4 right-4 flex justify-center z-20"
                    // evita que el click en el botón avance el slide accidentalmente
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ButtonLink href={item.ruta} newTab>
                      CLICK AQUÍ
                    </ButtonLink>
                  </div>


                ) : null}
              </div>
            </SwiperSlide>
          );
        })}

      </Swiper>
    </div>
  );
};

export default SliderHome;