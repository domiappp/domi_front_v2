import React, { useMemo, useCallback, useState, useEffect } from 'react';
import DataTable, { type TableColumn, type SortOrder } from 'react-data-table-component';
import Swal from 'sweetalert2';

import {
  useImagenesComercio,
  useEliminarImagenComercio,
} from '../../services/useImagenesComercio';
import type { ImagenComercio } from '../../services/useImagenesComercio';
import { useGlobalModal } from '../../store/modal.store';
import FormImagenesComercio from './FormImagenesComercio';

interface Props {
  comercioId: number;
}

const TablaImagenesComercio: React.FC<Props> = ({ comercioId }) => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState<'id' | 'orden' | 'creado_en' | 'actualizado_en'>('orden');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading, isError, error } = useImagenesComercio(comercioId, {
    page,
    limit: perPage,
    search: debouncedSearch || undefined,
    sortBy,
    sortOrder,
  });

  const { open, close } = useGlobalModal();
  const eliminar = useEliminarImagenComercio(comercioId);

  const items = useMemo(() => data?.items ?? [], [data]);
  const totalRows = data?.meta.total ?? 0;

  const handleEditar = useCallback(
    (row: ImagenComercio) => {
      open({
        title: `Editar imagen #${row.id}`,
        content: (
          <FormImagenesComercio
            comercioId={comercioId}
            mode="edit"
            initial={row}
            onSuccess={() => {
              close();
              Swal.fire('Actualizado', 'La imagen fue actualizada correctamente.', 'success');
            }}
            onCancel={close}
          />
        ),
        size: 'xl',
      });
    },
    [open, close, comercioId]
  );

  const handleEliminar = useCallback(
    async (row: ImagenComercio) => {
      const res = await Swal.fire({
        icon: 'question',
        title: `Eliminar imagen`,
        text: `¿Deseas eliminar la imagen #${row.id}?`,
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      });
      if (!res.isConfirmed) return;

      try {
        await eliminar.mutateAsync(row.id);
        Swal.fire('Eliminada', 'La imagen fue eliminada correctamente.', 'success');
      } catch (err: any) {
        Swal.fire('Error', err?.message ?? 'No se pudo eliminar la imagen', 'error');
      }
    },
    [eliminar]
  );

  const columns: TableColumn<ImagenComercio>[] = useMemo(
    () => [
      { id: 'id', name: 'ID', selector: (r) => r.id, sortable: true, width: '80px' },
      {
        id: 'url',
        name: 'Vista previa',
        cell: (r) => (
          <img
            src={r.url}
            alt="imagen comercio"
            className="h-14 w-20 object-cover rounded-md border"
          />
        ),
        grow: 0,
      },
      { id: 'mensaje', name: 'Mensaje', selector: (r) => r.mensaje ?? '—', sortable: false },
      { id: 'orden', name: 'Orden', selector: (r) => r.orden, sortable: true },
      {
        id: 'activo',
        name: 'Activo',
        selector: (r) => (r.activo === 1 ? 'Sí' : 'No'),
        sortable: true,
        width: '90px',
      },
      {
        id: 'acciones',
        name: 'Acciones',
        width: '220px',
        cell: (row) => (
          <div className="flex gap-2">
            <button
              className="btn btn-sm btn-warning"
              onClick={() => handleEditar(row)}
              disabled={eliminar.isPending}
            >
              Editar
            </button>
            <button
              className="btn btn-sm btn-error"
              onClick={() => handleEliminar(row)}
              disabled={eliminar.isPending}
            >
              {eliminar.isPending ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                'Eliminar'
              )}
            </button>
          </div>
        ),
      },
    ],
    [handleEditar, handleEliminar, eliminar.isPending]
  );

  const onSort = (column: any, direction: SortOrder) => {
    const id = column?.id as string | undefined;
    const map: Record<string, typeof sortBy> = {
      id: 'id',
      orden: 'orden',
      creado_en: 'creado_en',
      actualizado_en: 'actualizado_en',
    };
    setSortBy((id && map[id]) || 'orden');
    setSortOrder(direction.toUpperCase() as 'ASC' | 'DESC');
  };

  return (
    <div className="card bg-white">
      <div className="card-body">
        <div className="mb-3 flex flex-col md:flex-row md:items-center gap-3">
          <input
            className="input input-bordered w-full md:w-1/3"
            placeholder="Buscar por mensaje..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <DataTable
          columns={columns}
          data={items}
          progressPending={isLoading}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          paginationDefaultPage={page}
          onChangePage={setPage}
          onChangeRowsPerPage={(n, p) => {
            setPerPage(n);
            setPage(p);
          }}
          sortServer
          onSort={onSort}
          highlightOnHover
          striped
          noDataComponent="No hay imágenes"
        />

        {isError && (
          <div className="alert alert-error mt-3">
            <span>{(error as Error)?.message ?? 'Error al cargar imágenes'}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TablaImagenesComercio;
