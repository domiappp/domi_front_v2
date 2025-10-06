import React, { useMemo, useCallback, useEffect, useState } from 'react';
import DataTable, { type TableColumn, type SortOrder } from 'react-data-table-component';
import Swal from 'sweetalert2';

import { useUsers, useUpdateUsuario, useToggleUsuarioEstado } from '../../services/useUsers';
import type { UserList } from '../../shared/types/users-type';
import { useGlobalModal } from '../../store/modal.store';
import FormUsuarios from './FormUsuarios';

const TablaUsuarios: React.FC = () => {
  // --------- State de control (UI -> server) ----------
  const [page, setPage] = useState(1);           // 1-based (tu API)
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [rol, setRol] = useState<string | undefined>(undefined);
  const [estado, setEstado] = useState<'activo' | 'inactivo' | undefined>(undefined);
  const [sortBy, setSortBy] = useState<'id' | 'name' | 'email' | 'rol' | 'estado' | 'createdAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

  // debounce para no spamear el servidor
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading, isError, error } = useUsers({
    page,
    limit: perPage,
    search: debouncedSearch || undefined,
    rol,
    estado,
    sortBy,
    sortOrder,
  });

  const items = useMemo<UserList[]>(() => data?.items ?? [], [data?.items]);
  const totalRows = data?.meta.total ?? 0;

  const { open, close } = useGlobalModal();
  const updateUsuario = useUpdateUsuario();
  const toggleEstado = useToggleUsuarioEstado();

  const handleEditar = useCallback(
    (row: UserList) => {
      open({
        title: `Editar usuario #${row.id}`,
        content: (
          <FormUsuarios
            mode="edit"
            initial={row}
            onSuccess={() => {
              close();
              Swal.fire({ icon: 'success', title: 'Actualizado', text: `El usuario #${row.id} fue actualizado correctamente.` });
            }}
            onCancel={() => close()}
          />
        ),
        size: 'xl',
      });
    },
    [open, close]
  );

  const handleToggleEstado = useCallback(
    async (row: UserList) => {
      const nextEstado: 'activo' | 'inactivo' = row.estado === 'activo' ? 'inactivo' : 'activo';
      const result = await Swal.fire({
        icon: 'question',
        title: `Cambiar estado`,
        html: `¿Deseas cambiar el estado del usuario <b>#${row.id}</b> a <b>${nextEstado}</b>?`,
        showCancelButton: true,
        confirmButtonText: 'Sí, cambiar',
        cancelButtonText: 'Cancelar',
      });
      if (!result.isConfirmed) return;

      try {
        await toggleEstado.mutateAsync({ id: row.id, estado: nextEstado });
        Swal.fire({ icon: 'success', title: 'Estado actualizado', text: `El usuario #${row.id} ahora está ${nextEstado}.` });
      } catch (e: any) {
        Swal.fire({ icon: 'error', title: 'Error', text: e?.message ?? 'No se pudo cambiar el estado' });
      }
    },
    [toggleEstado]
  );

  const columns: TableColumn<UserList>[] = useMemo(() => [
    {
      id: 'id',
      name: 'ID',
      selector: (row) => row.id,
      sortable: true,
      width: '90px',
      format: (row) => String(row.id),
    },
    { id: 'name', name: 'Nombre', selector: (row) => row.name ?? '', grow: 2, sortable: true },
    { id: 'email', name: 'Correo', selector: (row) => row.email ?? '', grow: 2, sortable: true },
    { id: 'rol', name: 'Rol', selector: (row) => String(row.rol ?? ''), sortable: true },
    { id: 'estado', name: 'Estado', selector: (row) => String(row.estado ?? ''), sortable: true },
    { id: 'telefono', name: 'Teléfono', selector: (row) => row.telefono ?? '—' },
    { id: 'direccion', name: 'Dirección', selector: (row) => row.direccion ?? '—', grow: 2 },
    {
      id: 'created_at',
      name: 'Creado',
      selector: (row) => new Date(row.created_at).getTime(),
      sortable: true,
      format: (row) => new Date(row.created_at).toLocaleString(),
    },
    {
      id: 'updated_at',
      name: 'Actualizado',
      selector: (row) => new Date(row.updated_at).getTime(),
      sortable: true,
      format: (row) => new Date(row.updated_at).toLocaleString(),
    },
    {
      id: 'acciones',
      name: 'Acciones',
      width: '240px',
      cell: (row) => {
        const nextEstado = row.estado === 'activo' ? 'inactivo' : 'activo';
        const isToggling = toggleEstado.isPending;
        const isUpdating = updateUsuario.isPending;

        return (
          <div className="flex gap-2">
            <button
              className="btn btn-sm btn-warning"
              onClick={() => handleEditar(row)}
              disabled={isUpdating || isToggling}
            >
              {isUpdating && <span className="loading loading-spinner loading-xs mr-1" />}
              Editar
            </button>

            <button
              className={`btn btn-sm ${nextEstado === 'inactivo' ? 'btn-error' : 'btn-success'}`}
              onClick={() => handleToggleEstado(row)}
              disabled={isUpdating || isToggling}
              title={`Cambiar a ${nextEstado}`}
            >
              {isToggling && <span className="loading loading-spinner loading-xs mr-1" />}
              {nextEstado === 'inactivo' ? 'Desactivar' : 'Activar'}
            </button>
          </div>
        );
      },
    },
  ], [handleEditar, handleToggleEstado, toggleEstado.isPending, updateUsuario.isPending]);

  // Handlers de DataTable (server-side)
  const onChangePage = (p: number) => setPage(p); // p es 1-based ya
  const onChangeRowsPerPage = (newPerPage: number, newPage: number) => {
    setPerPage(newPerPage);
    setPage(newPage); // rdt te da ya 1-based
  };
  const onSort = (column: any, direction: SortOrder) => {
    // Mapear id de columna a sortBy del backend
    const id = column?.id as string | undefined;
    // columnas permitidas por tu DTO: 'id' | 'name' | 'email' | 'rol' | 'estado' | 'createdAt'
    // nuestra col se llama 'created_at', mapeamos a 'createdAt' para la API:
    const map: Record<string, typeof sortBy> = {
      id: 'id',
      name: 'name',
      email: 'email',
      rol: 'rol',
      estado: 'estado',
      created_at: 'createdAt',
      updated_at: 'createdAt', // si no expones updatedAt en el DTO, puedes dejarlo igual a createdAt o ignorar sort
    };

    const nextSortBy = (id && map[id]) || 'createdAt';
    setSortBy(nextSortBy);
    setSortOrder(direction.toUpperCase() as 'ASC' | 'DESC');
    setPage(1);
  };

  // UI de filtros
  return (
    <div className="card bg-white">
      <div className="card-body">
        {/* Filtros */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            className="input input-bordered w-full"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
          <select
            className="select select-bordered w-full"
            value={rol ?? ''}
            onChange={(e) => { setRol(e.target.value || undefined); setPage(1); }}
          >
            <option value="">Todos los roles</option>
            <option value="administrador">Administrador</option>
            <option value="comercio">Comercio</option>
            {/* agrega más si tienes */}
          </select>
          <select
            className="select select-bordered w-full"
            value={estado ?? ''}
            onChange={(e) => { setEstado((e.target.value as any) || undefined); setPage(1); }}
          >
            <option value="">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
          <select
            className="select select-bordered w-full"
            value={`${sortBy}:${sortOrder}`}
            onChange={(e) => {
              const [sb, so] = e.target.value.split(':') as [typeof sortBy, typeof sortOrder];
              setSortBy(sb); setSortOrder(so); setPage(1);
            }}
          >
            <option value="createdAt:DESC">Más recientes</option>
            <option value="createdAt:ASC">Más antiguos</option>
            <option value="name:ASC">Nombre A-Z</option>
            <option value="name:DESC">Nombre Z-A</option>
            <option value="email:ASC">Email A-Z</option>
            <option value="email:DESC">Email Z-A</option>
          </select>
        </div>

        <DataTable
          columns={columns}
          data={items}
          progressPending={isLoading}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          paginationDefaultPage={page}
          onChangePage={onChangePage}
          onChangeRowsPerPage={onChangeRowsPerPage}
          sortServer
          onSort={onSort}
          highlightOnHover
          striped
          pointerOnHover
          noDataComponent="No hay usuarios disponibles"
        />

        {isError && (
          <div className="alert alert-error mt-3">
            <span>{(error as Error | undefined)?.message ?? 'Error al cargar usuarios'}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TablaUsuarios;
