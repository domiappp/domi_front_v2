import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
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

  const API_BASE_URL = "https://5kqc6qdp-3000.use2.devtunnels.ms";

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

  // Estados de carga / error / vacío (mismas condiciones, mejor diseño)
  if (isLoading) {
    return (
      <div className="relative w-full h-[26vh] sm:h-[30vh] md:h-[34vh] lg:h-[48vh] rounded-2xl lg:rounded-none overflow-hidden bg-base-200/70 animate-pulse shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-base-300/80 via-base-200/40 to-base-100/60" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="relative w-full h-[26vh] sm:h-[30vh] md:h-[34vh] lg:h-[48vh] rounded-2xl lg:rounded-none overflow-hidden flex items-center justify-center bg-base-200/80 shadow-lg">
        <div className="px-6 py-3 rounded-xl bg-base-100/90 border border-base-300/60 shadow-md backdrop-blur-md">
          <p className="text-sm font-medium opacity-80">
            No se pudieron cargar los banners.
          </p>
        </div>
      </div>
    );
  }

  if (!slides.length) {
    return (
      <div className="relative w-full h-[26vh] sm:h-[30vh] md:h-[34vh] lg:h-[48vh] rounded-2xl lg:rounded-none overflow-hidden flex items-center justify-center bg-base-200/80 shadow-lg">
        <div className="px-6 py-3 rounded-xl bg-base-100/90 border border-base-300/60 shadow-md backdrop-blur-md">
          <p className="text-sm font-medium opacity-80">
            Sin publicidad disponible.
          </p>
        </div>
      </div>
    );
  }

  const navSelectors: SwiperOptions["navigation"] = {
    enabled: true,
    prevEl: ".btn-prev",
    nextEl: ".btn-next",
  };

  return (
    <div className="relative w-full lg:w-[90%] lg:rounded-3xl mx-auto group lg:mt-9  h-[26vh] sm:h-[30vh] md:h-[34vh] lg:h-[48vh] overflow-hidden  bg-black shadow-xl">
      {/* Badge superior derecha (tipo localización / info fija) */}
      {/* <div className="absolute top-4 right-4 lg:top-5 lg:right-6 z-30 flex gap-3">
        <div className="badge badge-warning badge-lg gap-2 bg-warning/90 text-black/90 border border-white/30 shadow-lg backdrop-blur-md">
          <MapPin className="w-3 h-3" />
          <span className="text-xs sm:text-sm font-semibold tracking-wide">
            Pitalito - Huila
          </span>
        </div>
      </div> */}

      {/* Botones personalizados (Swiper navigation) */}
      <button
        aria-label="Anterior"
        className="btn-prev hidden lg:flex btn btn-circle items-center justify-center absolute left-4 top-1/2 z-30 -translate-y-1/2 bg-black/40 border border-white/20 backdrop-blur-md
                   hover:bg-black/70 hover:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/70 transition-all duration-200 shadow-lg opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>

      <button
        aria-label="Siguiente"
        className="btn-next hidden lg:flex btn btn-circle items-center justify-center absolute right-4 top-1/2 z-30 -translate-y-1/2 bg-black/40 border border-white/20 backdrop-blur-md
                   hover:bg-black/70 hover:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/70 transition-all duration-200 shadow-lg opacity-0 group-hover:opacity-100"
      >
        <ChevronRight className="w-5 h-5 text-white" />
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
                {/* Imagen de fondo estilo ESPN (ocupa todo) */}
                <img
                  src={src}
                  alt={`Publicidad ${item.id}`}
                  className="absolute inset-0 w-full h-full object-cover select-none "
                  draggable={false}
                  loading="eager"
                />

                {/* Overlay tipo gradiente de izquierda a derecha */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/55 to-black/5" />

                {/* Contenido principal alineado a la izquierda */}
                <div className="relative z-20 flex h-full items-center w-full px-5 sm:px-7 lg:px-14 min-w-full">
                  <div className="max-w-4xl space-y-3 lg:space-y-5">
                    {/* Badge estilo "EN DIRECTO" */}
                    <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-3.5 py-1.5 text-[11px] sm:text-xs lg:text-sm font-semibold uppercase tracking-[0.15em] shadow-md shadow-black/40">
                      <span className="inline-block h-2 w-2 rounded-full bg-white animate-pulse" />
                      <span className="text-white">Publicidad destacada</span>
                    </div>

                    {/* Título grande (genérico porque no hay título en la data) */}
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight drop-shadow-[0_8px_25px_rgba(0,0,0,0.55)]">
                      Descubre nuestras{" "}
                      <span className="text-orange-400">
                        promociones y anuncios especiales
                      </span>
                    </h2>

                    {/* Descripción corta genérica */}
                    <p className="hidden lg:block text-sm lg:text-base text-white/80 max-w-xl leading-relaxed">
                      Contenido patrocinado con información relevante para la comunidad
                      de Pitalito y alrededores. Haz clic para conocer más detalles.
                    </p>

                    {/* CTA (solo si hay ruta) */}
                    {item.ruta && (
                      <div
                        className="pt-1 lg:pt-2 absolute right-6 lg:right-20 bottom-4 lg:bottom-6"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ButtonLink href={item.ruta} newTab>
                          VER MÁS
                        </ButtonLink>
                      </div>
                    )}
                  </div>
                </div>

                {/* Redes sociales inferiores centradas */}
                {/* <div className="absolute bottom-4 lg:bottom-2.5 left-14 z-30 flex gap-3">
                  <div className="avatar">
                    <div className="ring-primary ring-offset-base-100 size-7 lg:size-10 rounded-full ring-2 ring-offset-2 overflow-hidden flex items-center justify-center bg-black/50 backdrop-blur-md border border-white/20 hover:scale-105 transition-transform">
                      <img
                        src="facebook.png"
                        alt="Facebook"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>

                  <div className="avatar">
                    <div className="ring-pink-500 ring-offset-base-100 size-7 lg:size-10 rounded-full ring-2 ring-offset-2 overflow-hidden flex items-center justify-center bg-black/50 backdrop-blur-md border border-white/20 hover:scale-105 transition-transform">
                      <img
                        src="instagram.png"
                        alt="Instagram"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>

                  <div className="avatar">
                    <div className="ring-green-500 ring-offset-base-100 size-7 lg:size-10 rounded-full ring-2 ring-offset-2 overflow-hidden flex items-center justify-center bg-black/50 backdrop-blur-md border border-white/20 hover:scale-105 transition-transform">
                      <img
                        src="whatsapp.png"
                        alt="WhatsApp"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div> */}

                {/* La imagen sigue viéndose mucho más hacia la derecha gracias al gradiente */}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default SliderHome;
