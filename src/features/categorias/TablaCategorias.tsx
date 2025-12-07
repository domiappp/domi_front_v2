// src/pages/categorias/TablaCategorias.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import DataTable, { type TableColumn, type SortOrder } from 'react-data-table-component';
import Swal from 'sweetalert2';

import { useCategorias, useDeleteCategoria } from '../../services/useCategorias';
import type { Categoria } from '../../shared/types/categoriasTypes';
import { useGlobalModal } from '../../store/modal.store';
import FormCategorias from './FormCategorias';
import { useAuthStore } from '../../store/auth.store';

const TablaCategorias: React.FC = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState<'id' | 'nombre'>('id');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');


const comercioId = useAuthStore((s) => s.user?.comercioId)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading, isError, error } = useCategorias({
    page,
    limit: perPage,
    search: debouncedSearch || undefined,
    sortBy,
    sortOrder,
      comercioId: comercioId ?? undefined,   // 👈 aquí lo mandas

  });

  const items = useMemo<Categoria[]>(() => data?.items ?? [], [data?.items]);
  const totalRows = data?.meta.total ?? 0;

  const { open, close } = useGlobalModal();
  const eliminar = useDeleteCategoria();

  const handleEditar = useCallback(
    (row: Categoria) => {
      open({
        title: `Editar categoría #${row.id}`,
        content: (
          <FormCategorias
            mode="edit"
            initial={row}
            onSuccess={() => {
              close();
              Swal.fire({
                icon: 'success',
                title: 'Actualizado',
                text: `La categoría "${row.nombre}" fue actualizada correctamente.`,
              });
            }}
            onCancel={() => close()}
          />
        ),
        size: 'lg',
      });
    },
    [open, close]
  );

  const handleEliminar = useCallback(
    async (row: Categoria) => {
      const result = await Swal.fire({
        icon: 'warning',
        title: 'Eliminar categoría',
        html: `¿Estás seguro de eliminar la categoría <b>${row.nombre}</b>?`,
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      });
      if (!result.isConfirmed) return;

      try {
        await eliminar.mutateAsync(row.id);
        Swal.fire({ icon: 'success', title: 'Eliminada', text: 'Categoría eliminada con éxito.' });
      } catch (e: any) {
        Swal.fire({ icon: 'error', title: 'Error', text: e?.message ?? 'No se pudo eliminar la categoría' });
      }
    },
    [eliminar]
  );

  const columns: TableColumn<Categoria>[] = useMemo(
    () => [
      { id: 'id', name: 'ID', selector: (r) => r.id, sortable: true, width: '90px' },
      { id: 'nombre', name: 'Nombre', selector: (r) => r.nombre, sortable: true, grow: 2 },
      { id: 'created_at', name: 'Creado', selector: (r) => new Date(r.created_at).getTime(), format: (r) => new Date(r.created_at).toLocaleString(), sortable: true },
      { id: 'updated_at', name: 'Actualizado', selector: (r) => new Date(r.updated_at).getTime(), format: (r) => new Date(r.updated_at).toLocaleString(), sortable: true },
      {
        id: 'acciones',
        name: 'Acciones',
        width: '200px',
        cell: (row) => (
          <div className="flex gap-2">
            <button className="btn btn-sm btn-warning" onClick={() => handleEditar(row)}>
              Editar
            </button>
            <button className="btn btn-sm btn-error" onClick={() => handleEliminar(row)}>
              Eliminar
            </button>
          </div>
        ),
      },
    ],
    [handleEditar, handleEliminar]
  );

  const onSort = (column: any, direction: SortOrder) => {
    const id = column?.id as 'id' | 'nombre';
    setSortBy(id);
    setSortOrder(direction.toUpperCase() as 'ASC' | 'DESC');
    setPage(1);
  };

  return (
    <div className="card bg-white">
      <div className="card-body">
        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            className="input input-bordered w-full"
            placeholder="Buscar por nombre..."
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
          noDataComponent="No hay categorías registradas"
        />

        {isError && (
          <div className="alert alert-error mt-3">
            <span>{(error as Error)?.message ?? 'Error al cargar categorías'}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TablaCategorias;
