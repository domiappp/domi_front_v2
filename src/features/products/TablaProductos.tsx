import React, { useEffect, useMemo, useState, useCallback } from 'react';
import DataTable, { type TableColumn, type SortOrder } from 'react-data-table-component';
import Swal from 'sweetalert2';
import { useProducts, useDeleteProduct } from '../../services/useProducts';
import type { Product } from '../../shared/types/products-type';
import { useGlobalModal } from '../../store/modal.store';
import FormProductos from './FormProductos';

const TablaProductos: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState<'id' | 'nombre' | 'precio' | 'created_at'>('created_at');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading, isError, error } = useProducts({
    page,
    limit,
    search: debouncedSearch || undefined,
    sortBy,
    sortOrder,
  });

  const items = useMemo(() => data?.items ?? [], [data?.items]);
  const totalRows = data?.meta.total ?? 0;

  const { open, close } = useGlobalModal();
  const remove = useDeleteProduct();

  const handleEdit = useCallback(
    (row: Product) => {
      open({
        title: `Editar producto #${row.id}`,
        content: (
          <FormProductos
            mode="edit"
            initial={row}
            onSuccess={() => {
              close();
              Swal.fire('Actualizado', 'El producto fue actualizado correctamente', 'success');
            }}
            onCancel={() => close()}
          />
        ),
        size: 'xl',
      });
    },
    [open, close],
  );

  const handleDelete = useCallback(
    async (row: Product) => {
      const result = await Swal.fire({
        title: '¿Eliminar producto?',
        text: `El producto "${row.nombre}" será desactivado.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      });
      if (!result.isConfirmed) return;
      try {
        await remove.mutateAsync(row.id);
        Swal.fire('Eliminado', 'Producto desactivado correctamente', 'success');
      } catch (err: any) {
        Swal.fire('Error', err?.message ?? 'No se pudo eliminar', 'error');
      }
    },
    [remove],
  );

  const columns: TableColumn<Product>[] = [
    { id: 'id', name: 'ID', selector: (r) => r.id, sortable: true, width: '80px' },
    { id: 'nombre', name: 'Nombre', selector: (r) => r.nombre, sortable: true, grow: 2 },
    { id: 'precio', name: 'Precio', selector: (r) => r.precio, sortable: true },
    { id: 'estado', name: 'Estado', selector: (r) => r.estado, sortable: true },
    {
      id: 'categoria',
      name: 'Categoría',
      selector: (r) => r.categoria?.nombre ?? '—',
      grow: 1.5,
    },
    {
      id: 'comercio',
      name: 'Comercio',
      selector: (r) => r.comercio?.nombre ?? '—',
      grow: 1.5,
    },
    {
      id: 'created_at',
      name: 'Creado',
      selector: (r) => new Date(r.created_at).getTime(),
      sortable: true,
      format: (r) => new Date(r.created_at).toLocaleDateString(),
    },
    {
      id: 'acciones',
      name: 'Acciones',
      cell: (row) => (
        <div className="flex gap-2">
          <button className="btn btn-sm btn-warning" onClick={() => handleEdit(row)}>
            Editar
          </button>
          <button className="btn btn-sm btn-error" onClick={() => handleDelete(row)}>
            Eliminar
          </button>
        </div>
      ),
      width: '200px',
    },
  ];

  const onSort = (column: any, direction: SortOrder) => {
    setSortBy(column.id);
    setSortOrder(direction.toUpperCase() as 'ASC' | 'DESC');
  };

  return (
    <div className="card bg-white">
      <div className="card-body">
        {/* Filtros */}
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
          onChangeRowsPerPage={setLimit}
          sortServer
          onSort={onSort}
          highlightOnHover
          striped
          noDataComponent="No hay productos disponibles"
        />

        {isError && (
          <div className="alert alert-error mt-3">
            <span>{(error as Error)?.message ?? 'Error al cargar productos'}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TablaProductos;
