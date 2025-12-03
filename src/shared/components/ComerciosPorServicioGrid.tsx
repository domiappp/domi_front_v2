// src/shared/components/ComerciosPorServicioGrid.tsx
import React, { useEffect, useMemo, useRef } from 'react';
import CardComercio from './CardComercio';
import type { CardComercioProps } from './CardComercio';
import { useServicesUI } from '../../store/services.store';
import { flattenPages, useComerciosPorServicioInfinite } from '../../services/useComerciosPorServicio';

import FormCompras from '../../features/OtherServices/FormCompras';
import FormRecogida from '../../features/OtherServices/FormRecogida';
import FormPagos from '../../features/OtherServices/FormPagos';
import FormEnvios from '../../features/OtherServices/FormEnvios';

const BRAND_ORANGE = "#FF6B00";

const mapToCard = (c: any, serviceId?: number | string): CardComercioProps => ({
  id: String(c.id),
  serviceId,                                   // 👈 MUY IMPORTANTE
  nombre: c.nombre_comercial,
  categoria: c?.servicio?.nombre ?? '',
  imagen: c.logo_url || 'https://placehold.co/600x400?text=Comercio',
  rating: c.rating ?? 0,
  reviews: c.reviews ?? undefined,
  abierto: c.estado_comercio === 1,
  ubicacion: c.direccion,
});

const ComerciosPorServicioGrid: React.FC = () => {
  const uiView = useServicesUI((s) => s.uiView);
  const formType = useServicesUI((s) => s.formType);
  const serviceId = useServicesUI((s) => s.selectedServiceId);
  const q = useServicesUI((s) => s.search);
  const saveScroll = useServicesUI((s) => s.saveScrollForService);
  const getScroll = useServicesUI((s) => s.getScrollForService);

  const enabled = Number.isFinite(serviceId as number) && uiView === 'api';

  const query = useComerciosPorServicioInfinite(
    { serviceId: serviceId ?? 0, q, limit: 20 },
    { enabled }
  );

  const items = useMemo(
    () =>
      enabled && query.data
        ? flattenPages(query.data as any).map((c: any) => mapToCard(c, Number(serviceId)))
        : [],
    [enabled, query.data, serviceId],
  );

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled || !serviceId) return;
    const y = getScroll(serviceId);
    if (y > 0) window.scrollTo(0, y);
  }, [enabled, serviceId, getScroll]);

  useEffect(() => {
    if (!enabled || !serviceId) return;
    const onLeave = () => saveScroll(serviceId, window.scrollY);
    window.addEventListener('beforeunload', onLeave);
    return () => {
      onLeave();
      window.removeEventListener('beforeunload', onLeave);
    };
  }, [enabled, serviceId, saveScroll]);

  useEffect(() => {
    if (!enabled) return;
    if (!query.hasNextPage) return;
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !query.isFetchingNextPage) {
        query.fetchNextPage();
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [enabled, query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage]);

  if (uiView === 'form') {
    return (
      <section className="w-full h-auto flex items-center justify-center bg-gradient-to-b from-white via-orange-50/60 to-slate-50/80">
        <div className="mx-auto w-full max-w-6xl px-3 sm:px-4 xl:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center justify-center">
            <div className="hidden xl:flex justify-center items-center order-1 md:order-1">
              <img
                src="/moto.png"
                alt="Entrega en moto"
                className="w-full max-w-md h-auto object-contain drop-shadow-2xl"
              />
            </div>

            <div className="flex justify-center items-center order-2 md:order-2">
              <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-orange-100/80">
                <div className="border-b border-orange-50 px-4 pt-4 pb-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--brand-orange,#FF6B00)]">
                    Servicio personalizado
                  </p>
                  <h2 className="mt-1 text-base font-semibold text-slate-900">
                    Cuéntanos qué necesitas
                  </h2>
                </div>
                <div className="px-4 pb-4 pt-3 xl:p-6">
                  {formType === "pedido" && <FormCompras />}
                  {formType === "recogida" && <FormRecogida />}
                  {formType === "pago" && <FormPagos />}
                  {formType === "envio" && <FormEnvios />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!serviceId) {
    return (
      <div className="mx-auto w-full max-w-8xl p-3 sm:p-4">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-6 text-center">
          <p className="text-sm font-medium text-slate-800">
            Selecciona una categoría para ver comercios.
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Elige primero un tipo de servicio en el carrusel superior.
          </p>
        </div>
      </div>
    );
  }

  if (query.status === 'pending') {
    return (
      <div className="mx-auto w-full max-w-8xl p-3 sm:p-4">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white px-4 py-6 shadow-sm">
          <div className="mb-3 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[color:var(--brand-orange,#FF6B00)]" />
          <p className="text-sm font-medium text-slate-800">
            Cargando comercios…
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Buscando los mejores aliados cerca de ti.
          </p>
        </div>
      </div>
    );
  }

  if (query.status === 'error') {
    return (
      <div className="mx-auto w-full max-w-8xl p-3 sm:p-4">
        <div className="rounded-2xl border border-rose-100 bg-rose-50/80 px-4 py-3 text-sm text-rose-700 shadow-sm">
          <p className="font-semibold">Ups, algo salió mal</p>
          <p className="mt-1 text-xs sm:text-sm">
            Error: {(query.error as Error).message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-8xl p-3 sm:p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <h2 className="text-sm sm:text-base font-semibold text-slate-900">
            Comercios disponibles
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500">
            Explora negocios aliados para tu servicio seleccionado.
          </p>
        </div>
        {items.length > 0 && (
          <span className="hidden sm:inline-flex items-center rounded-full border border-orange-100 bg-orange-50/60 px-3 py-1 text-[11px] font-medium text-[color:var(--brand-orange,#FF6B00)]">
            {items.length} resultados
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 sm:gap-3 lg:gap-4">
        {items.map((c) => (
          <CardComercio
            key={c.id}
            {...c}
          />
        ))}
      </div>

      <div ref={sentinelRef} style={{ height: 1 }} />

      {query.isFetchingNextPage && (
        <p className="text-center py-3 text-xs sm:text-sm text-[color:var(--brand-orange,#FF6B00)]">
          Cargando más comercios…
        </p>
      )}

      {!query.hasNextPage && items.length > 0 && (
        <p className="text-center py-3 text-xs sm:text-sm text-slate-500">
          No hay más resultados.
        </p>
      )}

      {items.length === 0 && query.status === 'success' && (
        <p className="text-center py-6 text-sm text-slate-500">
          No encontramos comercios para esta búsqueda.
        </p>
      )}
    </div>
  );
};

export default ComerciosPorServicioGrid;
