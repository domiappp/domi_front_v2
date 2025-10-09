// src/shared/components/CategoriesSlider.tsx
import React, { useMemo, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { ArrowRight } from "lucide-react";
import { useServicios } from "../../services/useServices";
import { useServicesUI } from "../../store/services.store";
import { usePrefetchComerciosPorServicio } from "../../services/useComerciosPorServicio";

// import "swiper/css";
// import "swiper/css/pagination";

type Categoria = {
  id?: number | string;
  nombre?: string;
  foto?: string;
};

type ServicioMin = {
  id?: number | string;
  nombre?: string | null;
  foto?: string | null | undefined;
};

type StaticKey = "pedido" | "recogida" | "pago" | "envio";
const STATIC_PREFIX = "static:" as const;

const CategoriesSlider: React.FC = () => {
  const { data: categorias, isError, isLoading } = useServicios();

  const selectedServiceId = useServicesUI((s) => s.selectedServiceId);
  const uiView = useServicesUI((s) => s.uiView);
  const formType = useServicesUI((s) => s.formType);

  const setSelectedService = useServicesUI((s) => s.setSelectedService);
  const showForm = useServicesUI((s) => s.showForm);

  const prefetch = usePrefetchComerciosPorServicio();

  // Estáticos (2 arriba, 2 abajo)
  const staticTop: Categoria[] = [
        { id: `${STATIC_PREFIX}recogida`, nombre: "Recogidas", foto: "/recogidas-pitalito-huila.png" },

    { id: `${STATIC_PREFIX}pedido`,   nombre: "Compras",   foto: "/compras-pitalito-huila.png" },
  ];
  const staticBottom: Categoria[] = [
    { id: `${STATIC_PREFIX}pago`,  nombre: "Pagos",  foto: "/pagos-pitalito-huila.png" },
    { id: `${STATIC_PREFIX}envio`, nombre: "Envíos", foto: "/envios-pitalito-huila.png" },
  ];

const apiItems = useMemo<Categoria[]>(() => {
  const arr = Array.isArray(categorias) ? (categorias as ServicioMin[]) : [];
  return arr.map((s) => ({
    id: s.id,
    nombre: s.nombre ?? "",           // evita undefined
    foto: s.foto ?? undefined,        // convierte null -> undefined
  }));
}, [categorias]);
  // Partimos API en dos y metemos estáticos al inicio de cada fila
  const { firstRow, secondRow } = useMemo(() => {
    const mid = Math.ceil(apiItems.length / 2);
    const r1 = [...staticTop, ...apiItems.slice(0, mid)];
    const r2 = [...staticBottom, ...apiItems.slice(mid)];
    return { firstRow: r1, secondRow: r2 };
  }, [apiItems]);

  const API_URL = import.meta.env.VITE_API_URL;

  const onClickCategory = useCallback(
    (cat: Categoria) => {
      // Si es estático → abrir formulario y marcar selección de formulario
      if (typeof cat.id === "string" && cat.id.startsWith(STATIC_PREFIX)) {
        const type = cat.id.split(":")[1] as StaticKey;
        showForm(type);
        return;
      }
      // Si es API → seleccionar servicio (esto setea uiView='api' y limpia formType)
      const idNum = Number(cat.id);
      if (!Number.isFinite(idNum)) return;
      setSelectedService(idNum, cat.nombre ?? null);
    },
    [setSelectedService, showForm]
  );

  const onHoverPrefetch = useCallback(
    (cat: Categoria) => {
      // No prefetch para estáticos
      if (typeof cat.id === "string" && cat.id.startsWith(STATIC_PREFIX)) return;
      const idNum = Number(cat.id);
      if (!Number.isFinite(idNum)) return;
      prefetch({ serviceId: idNum, limit: 20 });
    },
    [prefetch]
  );

  const renderRow = (row: Categoria[]) => (
    <Swiper
      modules={[Pagination]}
      spaceBetween={0}
      slidesPerView={"auto"}
      pagination={{ clickable: true }}
      className="w-full categories-swiper"
    >
      {row.map((cat, index) => {
        const key = (cat.id ?? `${cat.nombre}-${index}`).toString();
        const isStatic = typeof cat.id === "string" && cat.id.startsWith(STATIC_PREFIX);
        const idNum = Number(cat.id);

        // 🔸 ¿Está seleccionado?
        const staticType: StaticKey | null = isStatic
          ? (cat.id as string).split(":")[1] as StaticKey
          : null;

        const isSelected = isStatic
          ? uiView === "form" && formType === staticType
          : uiView === "api" && Number.isFinite(idNum) && idNum === selectedServiceId;

        return (
          <SwiperSlide
            key={key}
            className="!w-20 flex flex-col items-center justify-center gap-1 py-2 mx-auto"
          >
            <button
              type="button"
              onClick={() => onClickCategory(cat)}
              onMouseEnter={() => onHoverPrefetch(cat)}
              onFocus={() => onHoverPrefetch(cat)}
              title={cat.nombre}
              className="flex flex-col justify-center items-center outline-none mx-auto"
            >
              <div
                className={[
                  "size-12 lg:size-16 rounded-full flex items-center justify-center shadow transition ring-2",
                  isSelected
                    ? "bg-[#FFF0E6] ring-[#FF6600]" // 🔶 seleccionado (mismo estilo para estático/API)
                    : "bg-[#F3F3F3] ring-transparent hover:ring-[#FF6600]",
                ].join(" ")}
                aria-pressed={isSelected}
                aria-label={cat.nombre}
              >
                <img
                  src={isStatic ? cat.foto : `${API_URL}${cat.foto}`}
                  alt={cat.nombre}
                  className="size-10 lg:size-14 object-contain"
                />
              </div>
              <p
                className={[
                  "text-xs md:text-sm font-medium mt-1 text-center line-clamp-2 break-all",
                  isSelected ? "text-[#FF6600]" : "text-[#333333]",
                ].join(" ")}
              >
                {cat.nombre}
              </p>
            </button>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );

  if (isLoading) {
    return (
      <div className="w-full px-4 pt-2.5 pb-3">
        <div className="w-full max-w-5xl mx-auto animate-pulse">
          <div className="flex justify-between mb-4">
            <div className="h-5 w-40 bg-[#F2F2F2] rounded" />
            <div className="lg:hidden h-5 w-5 bg-[#F2F2F2] rounded-full" />
          </div>
          <div className="grid grid-rows-2 gap-4">
            {[0, 1].map((row) => (
              <div key={row} className="flex gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="size-16 rounded-full bg-[#F2F2F2]" />
                    <div className="h-3 w-16 bg-[#F2F2F2] rounded mt-2" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full px-4 pt-2.5 pb-3">
        <div className="w-full max-w-5xl mx-auto">
          <p className="text-sm text-[#FF3333]">
            Hubo un problema al cargar las categorías.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 pt-2.5 pb-3">
      <style>{`
        .categories-swiper .swiper-pagination-bullet { background: #F2F2F2; opacity: 1; }
        .categories-swiper .swiper-pagination-bullet-active { background: #FF6600; }
      `}</style>

      <div className="w-full max-w-5xl mx-auto">
        <div className="flex justify-between">
          <h2 className="text-lg font-bold mb-4 text-[#333333]">Seleccionar Servicio</h2>
          <span className="lg:hidden text-[#FF6600]">
            <ArrowRight color="#FF6600" />
          </span>
        </div>

        {renderRow(firstRow)}
        {secondRow.length > 0 && <div className="mt-2">{renderRow(secondRow)}</div>}
      </div>
    </div>
  );
};

export default CategoriesSlider;
