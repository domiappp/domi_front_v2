import React from 'react';
import { useGlobalModal } from '../../store/modal.store';
import TablaImagenesComercio from './TablaImagenesComercio';
import FormImagenesComercio from './FormImagenesComercio';

// 👇 importa los hooks
import {
  useEstadoServicioComercio,
  useActualizarEstadoServicioComercio,
  EstadoServicio,
} from '../../services/useComercios';

interface Props {
  comercioId: number;
}

const LayoutImagenesComercio: React.FC<Props> = ({ comercioId }) => {
  const { open } = useGlobalModal();

  // 🔹 leer estado_servicio del comercio
  const {
    data: estadoData,
    isLoading: loadingEstado,
    isError: errorEstado,
  } = useEstadoServicioComercio(comercioId);

  // 🔹 mutación para actualizar
  const {
    mutate: updateEstado,
    isPending: updatingEstado,
  } = useActualizarEstadoServicioComercio();

  const handleChangeEstado = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value) as EstadoServicio;
    if (!Number.isFinite(value)) return;

    updateEstado({
      comercioId,
      estado_servicio: value,
    });
  };

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* IZQUIERDA: selector de estado_servicio */}
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold">
            Estado del servicio del comercio
          </span>

          {loadingEstado && (
            <span className="text-xs text-slate-500">
              Cargando estado...
            </span>
          )}

          {errorEstado && (
            <span className="text-xs text-red-500">
              Error al cargar el estado del servicio.
            </span>
          )}

          {!loadingEstado && !errorEstado && estadoData && (
            <div className="flex items-center gap-2">
              <select
                className="select select-sm select-bordered max-w-xs"
                value={estadoData.estado_servicio}
                onChange={handleChangeEstado}
                disabled={updatingEstado}
              >
                <option value={0}>Solo productos (0)</option>
                <option value={1}>Solo imágenes (1)</option>
                <option value={2}>Productos e imágenes (2)</option>
              </select>

              {updatingEstado && (
                <span className="text-xs text-slate-500">
                  Guardando...
                </span>
              )}
            </div>
          )}

          <span className="text-[11px] text-slate-500">
            Este estado controla si el comercio muestra productos, imágenes o ambos
            en el frontend.
          </span>
        </div>

        {/* DERECHA: botón para nueva imagen */}
        <div className="flex justify-end">
          <button
            className="btn btn-primary"
            onClick={() =>
              open({
                title: 'Agregar imagen',
                content: (
                  <FormImagenesComercio
                    comercioId={comercioId}
                    mode="create"
                  />
                ),
                size: 'xl',
              })
            }
          >
            Nueva imagen
          </button>
        </div>
      </div>

      <TablaImagenesComercio comercioId={comercioId} />
    </>
  );
};

export default LayoutImagenesComercio;
