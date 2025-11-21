// src/shared/components/CategoriesSlider.tsx
import React, { useMemo, useCallback, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { ArrowRight } from "lucide-react";
import { useServicios } from "../../services/useServices";
import { useServicesUI } from "../../store/services.store";
import { usePrefetchComerciosPorServicio } from "../../services/useComerciosPorServicio";
import { useServiceSelectionStore } from "../../store/serviceSelection.store";

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

  // ✅ STORE PERSISTIDO EN LOCALSTORAGE
  const storedServiceId = useServiceSelectionStore(
    (s) => s.selectedServiceId
  );
  const setStoredSelection = useServiceSelectionStore(
    (s) => s.setSelection
  );

  // Estáticos (2 arriba, 2 abajo)
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
      nombre: s.nombre ?? "", // evita undefined
      foto: s.foto ?? undefined, // convierte null -> undefined
    }));
  }, [categorias]);

  // 🧠 EFECTO: al cargar categorías, aplica selección guardada o “Restaurantes”
  useEffect(() => {
    if (!apiItems.length) return;
    // Si el usuario está en vista de formulario, no forzamos nada
    if (uiView === "form") return;

    // 1) Intentar con lo guardado en localStorage
    if (storedServiceId != null) {
      const idNum = Number(storedServiceId);
      if (Number.isFinite(idNum)) {
        const match = apiItems.find((c) => Number(c.id) === idNum);
        if (match) {
          setSelectedService(idNum, match.nombre ?? null);
          return; // ✅ ya aplicamos selección almacenada
        }
      }
    }

    // 2) Si no hay nada válido guardado → buscar “Restaurantes”
    const defaultItem = apiItems.find(
      (c) => c.nombre?.trim().toLowerCase() === "restaurantes"
    );
    if (defaultItem && defaultItem.id != null) {
      const idNum = Number(defaultItem.id);
      if (Number.isFinite(idNum)) {
        setSelectedService(idNum, defaultItem.nombre ?? null);
        setStoredSelection(idNum, defaultItem.nombre ?? null); // guardamos default
      }
    }
  }, [apiItems, storedServiceId, uiView, setSelectedService, setStoredSelection]);

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
      const name = cat.nombre ?? null;

      setSelectedService(idNum, name);
      // ✅ guardar en estado global + localStorage
      setStoredSelection(idNum, name);
    },
    [setSelectedService, showForm, setStoredSelection]
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
          ? ((cat.id as string).split(":")[1] as StaticKey)
          : null;

        const isSelected = isStatic
          ? uiView === "form" && formType === staticType
          : uiView === "api" && Number.isFinite(idNum) && idNum === selectedServiceId;

        return (
          <SwiperSlide
            key={key}
            className="!w-20 flex flex-col items-center justify-center gap-1.5 py-2 mx-auto"
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
                  "relative size-14 lg:size-20 rounded-full flex items-center justify-center shadow-sm transition-all duration-200 ring-2",
                  "bg-gradient-to-br",
                  isSelected
                    ? "from-[#FFE1CC] via-[#FFE1CC] to-[#FFD2B3] ring-[#FF6600] shadow-md scale-105"
                    : "from-[#FFE1CC] via-[#FFE1CC] to-[#FFD2B3] ring-transparent hover:ring-[#FF6600]/80 hover:shadow-md hover:scale-105",
                ].join(" ")}
                aria-pressed={isSelected}
                aria-label={cat.nombre}
              >
                <img
                  src={isStatic ? cat.foto : `${API_URL}${cat.foto}`}
                  alt={cat.nombre}
                  className="size-10 lg:size-14 object-contain drop-shadow-sm"
                />
              </div>
              <p
                className={[
                  "text-[11px] md:text-xs font-semibold mt-1 text-center leading-snug line-clamp-2 break-words max-w-[4.5rem]",
                  isSelected ? "text-[#FF6600]" : "text-slate-700",
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
      <div className="w-full px-4 pt-3 pb-4">
        <div className="w-full max-w-5xl mx-auto animate-pulse">
          <div className="flex justify-between mb-4 items-center">
            <div className="h-5 w-40 bg-slate-100 rounded-full" />
            <div className="lg:hidden h-6 w-6 bg-slate-100 rounded-full" />
          </div>
          <div className="grid grid-rows-2 gap-4">
            {[0, 1].map((row) => (
              <div key={row} className="flex gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
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
          background: #FF6600;
          transform: scale(1.1);
        }
      `}</style>

      <div className="w-full max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-1">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-base md:text-lg font-semibold xl:font-bold text-slate-900">
              Seleccionar servicio
            </h2>
            <p className="hidden md:block text-xs text-slate-500">
              Elige qué necesitas hoy: compras, envíos, pagos o recogidas.
            </p>
          </div>
          <span className="lg:hidden inline-flex items-center gap-1 text-xs font-medium text-[#FF6600]">
            Ver servicios
            <ArrowRight size={16} color="#FF6600" />
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
