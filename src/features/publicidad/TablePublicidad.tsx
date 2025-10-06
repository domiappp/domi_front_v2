import React, { useMemo } from 'react'
import DataTable, { type TableColumn } from 'react-data-table-component'
import { usePublicidad, useDeletePublicidad } from '../../services/usePublicidad'
import type { Publicidad } from '../../shared/types/publicidadTypes'
import { useGlobalModal } from '../../store/modal.store'
import FormPublicidad from './FormPublicidad'
import { BASE } from '../../utils/baseUrl'

const TablePublicidad: React.FC = () => {
  // Si tu backend tiene paginación, adapta a usePublicidad({ page, limit })
  const { data, isLoading, isError, error } = usePublicidad()
  const items = data ?? []

  const eliminar = useDeletePublicidad()
  const { open, close } = useGlobalModal()

  const columns: TableColumn<Publicidad>[] = useMemo(() => [
    { name: 'ID', selector: (r) => r.id as any, sortable: true, width: '90px' },
    {
      name: 'Imagen',
      width: '120px',
      cell: (row) => {
        const src = row.imagen
          ? (/^(https?:)?\/\//i.test(String(row.imagen))
              ? String(row.imagen)
              : `${BASE.replace(/\/$/, '')}${String(row.imagen).startsWith('/') ? '' : '/'}${String(row.imagen)}`)
          : ''
        return src ? (
          <img src={src} alt="img" className="h-12 w-20 object-cover rounded-md" />
        ) : <span className="opacity-50 text-xs">Sin imagen</span>
      }
    },
    { name: 'Ruta', selector: (r) => r.ruta ?? '', grow: 2 },
    { name: 'Orden', selector: (r) => String((r as any).orden ?? ''), width: '90px', sortable: true },
    {
      name: 'Estado',
      selector: (r) => String((r as any).estado == 1 ? 'Activo' : 'Inactivo'),
      width: '120px'
    },
    {
      name: 'Inicio',
      selector: (r) => (r as any).fecha_inicio ? new Date((r as any).fecha_inicio).toLocaleString() : '',
      width: '200px'
    },
    {
      name: 'Fin',
      selector: (r) => (r as any).fecha_fin ? new Date((r as any).fecha_fin).toLocaleString() : '',
      width: '200px'
    },
    {
      name: 'Acciones',
      width: '210px',
      cell: (row) => (
        <div className="flex gap-2">
          <button
            className="btn btn-sm btn-warning"
            onClick={() => {
              open({
                title: `Editar publicidad #${row.id}`,
                content: (
                  <FormPublicidad
                    mode="edit"
                    initial={row}
                    onSuccess={() => close()}
                  />
                ),
                size: 'xl',
              })
            }}
          >
            Editar
          </button>
          <button
            className="btn btn-sm btn-error"
            onClick={() => {
              open({
                title: 'Eliminar publicidad',
                content: (
                  <div className="space-y-4">
                    <p>¿Seguro que deseas eliminar la publicidad <b>#{row.id}</b>?</p>
                    <div className="flex justify-end gap-2">
                      <button className="btn" onClick={() => close()}>Cancelar</button>
                      <button
                        className="btn btn-error"
                        onClick={() => {
                          eliminar.mutate(row.id as any, {
                            onSuccess: () => close(),
                          })
                        }}
                      >
                        Confirmar
                      </button>
                    </div>
                  </div>
                ),
                size: 'sm',
              })
            }}
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ], [open, close, eliminar])

  return (
    <div className="card bg-white">
      <div className="card-body">
        <DataTable
          columns={columns}
          data={items}
          progressPending={isLoading}
          pagination
          highlightOnHover={false}
          striped={false}
          pointerOnHover={false}
        />
        {isError && (
          <div className="alert alert-error mt-3">
            <span>{(error as any)?.message ?? 'Error al cargar'}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default TablePublicidad
