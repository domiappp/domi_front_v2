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
      <section className="w-full h-auto flex items-center justify-center">
        <div className="mx-auto w-full max-w-6xl  xl:py-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center justify-center">
            <div className="hidden xl:flex justify-center items-center order-1 md:order-1">
              <img
                src="/moto.png"
                alt="Entrega en moto"
                className="w-full max-w-md h-auto object-contain drop-shadow-2xl"
              />
            </div>

            <div className="flex justify-center items-center order-2 md:order-2 bg-white rounded-2xl">
              <div className=" xl:p-6 w-full max-w-md">
                {formType === "pedido" && <FormCompras />}
                {formType === "recogida" && <FormRecogida />}
                {formType === "pago" && <FormPagos />}
                {formType === "envio" && <FormEnvios />}
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
        <p className="text-sm text-gray-600">Selecciona una categoría para ver comercios.</p>
      </div>
    );
  }

  if (query.status === 'pending') {
    return (
      <div className="mx-auto w-full max-w-8xl p-3 sm:p-4">
        <p>Cargando comercios…</p>
      </div>
    );
  }

  if (query.status === 'error') {
    return (
      <div className="mx-auto w-full max-w-8xl p-3 sm:p-4">
        <p className="text-sm text-rose-600">Error: {(query.error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-8xl p-3 sm:p-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 sm:gap-3 lg:gap-4">
        {items.map((c) => (
          <CardComercio
            key={c.id}
            {...c}
          />
        ))}
      </div>

      <div ref={sentinelRef} style={{ height: 1 }} />
      {query.isFetchingNextPage && <p className="text-center py-3">Cargando más…</p>}
      {!query.hasNextPage && items.length > 0 && (
        <p className="text-center py-3 text-gray-500">No hay más resultados.</p>
      )}
      {items.length === 0 && (
        <p className="text-center py-6 text-gray-500">
          No encontramos comercios para esta búsqueda.
        </p>
      )}
    </div>
  );
};

export default ComerciosPorServicioGrid;
