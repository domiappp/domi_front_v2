// src/shared/components/CategoriesSlider.tsx
import React, { useMemo, useCallback, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { ArrowRight } from "lucide-react";
import { useServicios } from "../../services/useServices";
import { useServicesUI } from "../../store/services.store";
import { usePrefetchComerciosPorServicio } from "../../services/useComerciosPorServicio";
import { useServiceSelectionStore } from "../../store/serviceSelection.store";

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

// color principal de marca
const BRAND_ORANGE = "#FF6B00";

const CategoriesSlider: React.FC = () => {
  const { data: categorias, isError, isLoading } = useServicios();

  const selectedServiceId = useServicesUI((s) => s.selectedServiceId);
  const uiView = useServicesUI((s) => s.uiView);
  const formType = useServicesUI((s) => s.formType);

  const setSelectedService = useServicesUI((s) => s.setSelectedService);
  const showForm = useServicesUI((s) => s.showForm);

  const prefetch = usePrefetchComerciosPorServicio();

  const storedServiceId = useServiceSelectionStore(
    (s) => s.selectedServiceId
  );
  const setStoredSelection = useServiceSelectionStore(
    (s) => s.setSelection
  );

  const staticTop: Categoria[] = [
    {
      id: `${STATIC_PREFIX}recogida`,
      nombre: "Recogidas",
      foto: "/recogidas-pitalito-huila.png",
    },
    {
      id: `${STATIC_PREFIX}pedido`,
      nombre: "Compras",
      foto: "/compras-pitalito-huila.png",
    },
  ];
  const staticBottom: Categoria[] = [
    {
      id: `${STATIC_PREFIX}pago`,
      nombre: "Pagos",
      foto: "/pagos-pitalito-huila.png",
    },
    {
      id: `${STATIC_PREFIX}envio`,
      nombre: "Envíos",
      foto: "/envios-pitalito-huila.png",
    },
  ];

  const apiItems = useMemo<Categoria[]>(() => {
    const arr = Array.isArray(categorias) ? (categorias as ServicioMin[]) : [];
    return arr.map((s) => ({
      id: s.id,
      nombre: s.nombre ?? "",
      foto: s.foto ?? undefined,
    }));
  }, [categorias]);

  useEffect(() => {
    if (!apiItems.length) return;
    if (uiView === "form") return;

    if (storedServiceId != null) {
      const idNum = Number(storedServiceId);
      if (Number.isFinite(idNum)) {
        const match = apiItems.find((c) => Number(c.id) === idNum);
        if (match) {
          setSelectedService(idNum, match.nombre ?? null);
          return;
        }
      }
    }

    const defaultItem = apiItems.find(
      (c) => c.nombre?.trim().toLowerCase() === "restaurantes"
    );
    if (defaultItem && defaultItem.id != null) {
      const idNum = Number(defaultItem.id);
      if (Number.isFinite(idNum)) {
        setSelectedService(idNum, defaultItem.nombre ?? null);
        setStoredSelection(idNum, defaultItem.nombre ?? null);
      }
    }
  }, [apiItems, storedServiceId, uiView, setSelectedService, setStoredSelection]);

  const { firstRow, secondRow } = useMemo(() => {
    const mid = Math.ceil(apiItems.length / 2);
    const r1 = [...staticTop, ...apiItems.slice(0, mid)];
    const r2 = [...staticBottom, ...apiItems.slice(mid)];
    return { firstRow: r1, secondRow: r2 };
  }, [apiItems]);

  const API_URL = import.meta.env.VITE_API_URL;

  const onClickCategory = useCallback(
    (cat: Categoria) => {
      if (typeof cat.id === "string" && cat.id.startsWith(STATIC_PREFIX)) {
        const type = cat.id.split(":")[1] as StaticKey;
        showForm(type);
        return;
      }

      const idNum = Number(cat.id);
      if (!Number.isFinite(idNum)) return;
      const name = cat.nombre ?? null;

      setSelectedService(idNum, name);
      setStoredSelection(idNum, name);
    },
    [setSelectedService, showForm, setStoredSelection]
  );

  const onHoverPrefetch = useCallback(
    (cat: Categoria) => {
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

        const staticType: StaticKey | null = isStatic
          ? ((cat.id as string).split(":")[1] as StaticKey)
          : null;

        const isSelected = isStatic
          ? uiView === "form" && formType === staticType
          : uiView === "api" && Number.isFinite(idNum) && idNum === selectedServiceId;

        return (
          <SwiperSlide
            key={key}
            className="!w-20 flex flex-col items-center justify-center ml-12 py-2 mx-auto"
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
                  "relative w-20 h-24 lg:w-24 lg:h-28 rounded-xl flex flex-col items-center justify-center shadow-2xl transition-all duration-200  p-2 bg-white",
                  isSelected
                    ? "bg-gradient-to-b from-[#FF6B00] to-[#FF8A33] shadow-2xl scale-105"
                    : "ring-transparent shadow-2xl  hover:shadow hover:scale-105",
                ].join(" ")}
                aria-pressed={isSelected}
                aria-label={cat.nombre}
              >
                <img
                  src={isStatic ? cat.foto : `${API_URL}${cat.foto}`}
                  alt={cat.nombre}
                  className="size-10 lg:size-14 object-contain drop-shadow-sm mb-1"
                />

                <p
                  className={[
                    "text-[10px] md:text-xs font-semibold text-center break-all leading-snug line-clamp-2 break-words",
                    isSelected ? "text-white" : "text-[#FF6B00]",
                  ].join(" ")}
                >
                  {cat.nombre}
                </p>
              </div>
            </button>

          </SwiperSlide>
        );
      })}
    </Swiper>
  );

  if (isLoading) {
    return (
      <div className="w-full px-4 pt-3 pb-4">
        <div className="w-full max-w-full mx-auto animate-pulse">
          <div className="flex justify-between mb-4 items-center">
            <div className="h-5 w-40 bg-slate-100 rounded-full" />
            <div className="lg:hidden h-6 w-6 bg-slate-100 rounded-full" />
          </div>
          <div className="grid grid-rows-2 gap-4">
            {[0, 1].map((row) => (
              <div key={row} className="flex gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex flex-col  items-center gap-2">
                    <div className="size-14 rounded-full bg-slate-100" />
                    <div className="h-3 w-14 bg-slate-100 rounded-full" />
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
      <div className="w-full px-4 pt-3 pb-4">
        <div className="w-full max-w-5xl mx-auto rounded-xl border border-rose-100 bg-rose-50/80 px-3 py-2.5 text-sm text-rose-700 shadow-sm">
          Hubo un problema al cargar las categorías.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 pt-3 pb-4 bg-gradient-to-b from-white via-white to-slate-50/80">
      <style>{`
        .categories-swiper {
          padding-top: 0.35rem;
          padding-bottom: 0.75rem;
        }
        .categories-swiper .swiper-pagination {
          position: static;
          margin-top: 0.1rem;
        }
        .categories-swiper .swiper-pagination-bullet {
          width: 16px;
          height: 4px;
          border-radius: 999px;
          background: #E4E4E7;
          opacity: 1;
          transition: all 0.2s ease;
        }
        .categories-swiper .swiper-pagination-bullet-active {
          background: ${BRAND_ORANGE};
          transform: scale(1.1);
        }
      `}</style>

      <div className="w-full max-w-full mx-auto">
        <div className="flex items-center justify-between mb-1">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-base md:text-lg font-semibold xl:font-bold text-slate-900">
              Seleccionar servicio
            </h2>
            <p className="hidden md:block text-xs text-slate-500">
              Elige qué necesitas hoy: compras, envíos, pagos o recogidas.
            </p>
          </div>
          <span className="lg:hidden inline-flex items-center gap-1 text-xs font-medium text-[#FF6B00] rounded-full px-3 py-1 bg-[#FF6B00]/10 border border-[#FF6B00]/30">
            Ver servicios
            <ArrowRight size={16} color={BRAND_ORANGE} />
          </span>
        </div>

        {renderRow(firstRow)}
        {secondRow.length > 0 && (
          <div className="-mt-3.5">
            {renderRow(secondRow)}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesSlider;
