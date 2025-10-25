// src/features/servicios/TablaServices.tsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import DataTable, { type TableColumn } from 'react-data-table-component';
import Swal from 'sweetalert2';

import { useGlobalModal } from '../../store/modal.store';
import FormServices from './FormServices';
import type { Servicio } from '../../shared/types/servicesTypes';
import { useServicios } from '../../services/useServices';

const TablaServices: React.FC = () => {
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');

  // === Filtro con debounce ===
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [search]);

  // === Cargar servicios ===
  const { data, isLoading, isError, error } = useServicios();
  const items = useMemo<Servicio[]>(() => data ?? [], [data]);

  // === Filtrado local ===
  const filtered = useMemo(() => {
    if (!debounced) return items;
    return items.filter((s) => (s.nombre ?? '').toLowerCase().includes(debounced));
  }, [items, debounced]);

  const { open, close } = useGlobalModal();

  // === Modal editar ===
  const handleEditar = useCallback(
    (row: Servicio) => {
      open({
        title: `Editar servicio #${row.id}`,
        content: (
          <FormServices
            mode="edit"
            initial={row}
            onSuccess={() => {
              close();
              Swal.fire({
                icon: 'success',
                title: 'Actualizado',
                text: `El servicio #${row.id} fue actualizado correctamente.`,
              });
            }}
            onCancel={() => close()}
          />
        ),
        size: 'xl',
      });
    },
    [open, close]
  );

  // === Columnas ===
  const columns: TableColumn<Servicio>[] = useMemo(
    () => [
      {
        id: 'id',
        name: 'ID',
        selector: (r) => r.id,
        sortable: true,
        width: '80px',
      },
      {
        id: 'nombre',
        name: 'Nombre',
        selector: (r) => r.nombre ?? '',
        sortable: true,
        grow: 2,
      },
      {
        id: 'estado',
        name: 'Estado',
        selector: (r) => r.estado ?? '—',
        sortable: true,
        width: '130px',
        cell: (row) => (
          <span
            className={`badge ${
              row.estado === 'activo' ? 'badge-success' : 'badge-ghost'
            } capitalize`}
          >
            {row.estado}
          </span>
        ),
      },
      {
        id: 'orden',
        name: 'Orden',
        selector: (r) => r.orden ?? 0,
        sortable: true,
        width: '110px',
      },
      {
        id: 'foto',
        name: 'Foto',
        selector: (r) => r.foto ?? '',
        cell: (row) =>
          row.foto ? (
            <img
              src={row.foto}
              alt={row.nombre ?? 'foto'}
              className="h-10 w-10 object-cover rounded-md shadow-sm"
            />
          ) : (
            <span className="opacity-50">—</span>
          ),
        width: '90px',
      },
      {
        id: 'created_at',
        name: 'Creado',
        selector: (r) => (r.created_at ? new Date(r.created_at).getTime() : 0),
        sortable: true,
        format: (r) =>
          r.created_at ? new Date(r.created_at).toLocaleDateString() : '—',
        width: '160px',
      },
      {
        id: 'updated_at',
        name: 'Actualizado',
        selector: (r) => (r.updated_at ? new Date(r.updated_at).getTime() : 0),
        sortable: true,
        format: (r) =>
          r.updated_at ? new Date(r.updated_at).toLocaleDateString() : '—',
        width: '160px',
      },
      {
        id: 'acciones',
        name: 'Acciones',
        cell: (row) => (
          <div className="flex gap-2">
            <button
              className="btn btn-sm btn-warning"
              onClick={() => handleEditar(row)}
            >
              Editar
            </button>
          </div>
        ),
        width: '140px',
      },
    ],
    [handleEditar]
  );

  // === Render principal ===
  return (
    <div className="card bg-white shadow-md">
      <div className="card-body">
        {/* === Buscador === */}
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <input
            className="input input-bordered w-full md:w-1/3"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="text-sm opacity-70">
            Mostrando {filtered.length} servicio{filtered.length !== 1 && 's'}
          </span>
        </div>

        {/* === Tabla === */}
        <DataTable
          columns={columns}
          data={filtered}
          progressPending={isLoading}
          pagination
          highlightOnHover
          striped
          pointerOnHover
          noDataComponent="No hay servicios disponibles"
        />

        {/* === Error === */}
        {isError && (
          <div className="alert alert-error mt-3">
            <span>
              {(error as Error | undefined)?.message ??
                'Error al cargar los servicios'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TablaServices;
