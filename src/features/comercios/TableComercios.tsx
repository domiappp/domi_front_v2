// src/components/comercios/TableComercios.tsx
import React, { useMemo } from 'react'
import DataTable from 'react-data-table-component'
import type { TableColumn } from 'react-data-table-component'
import { useComercios } from '../../services/useComercios' // ajusta la ruta si usas hooks/
import type { Commerce } from '../../shared/types/comercioTypes'
import { useGlobalModal } from '../../store/modal.store'
import FormComercio from './FormComercio'
import { Select } from '../../shared/components/Select'
import { useServicios } from '../../services/useServices'

// Si tu API devuelve la relación eager, suele venir como { servicio_id: { id, nombre, ... } }
function toFormInitial(row: Commerce): Commerce & { servicioId?: number } {
    const servicioId =
        // si ya viene calculado
        (row as any).servicioId ??
        // si viene como campo plano
        (Number.isFinite((row as any).servicio) ? (row as any).servicio : undefined) ??
        // si viene como relación eager { servicio_id: { id: number } }
        ((row as any).servicio_id?.id ?? undefined)

    return { ...row, servicioId } as any
}

const TableComercios: React.FC = () => {
    const { data, isLoading, isError, error } = useComercios({ page: 1, limit: 10 })
    const items = data?.items ?? []
    const totalRows = data?.meta?.total ?? 0

    const { open, close } = useGlobalModal()

    const columns: TableColumn<Commerce>[] = useMemo(() => [
        { name: 'ID', selector: (r) => r.id, sortable: true, width: '90px' },
        { name: 'Nombre comercial', selector: (r) => r.nombre_comercial ?? '', sortable: true },
        { name: 'Responsable', selector: (r) => r.responsable ?? '' },

        { name: 'Email', selector: (r) => r.email_contacto ?? '' },
        { name: 'Teléfono', selector: (r) => r.telefono ?? '' },
        { name: 'Estado', selector: (r) => String((r as any).estado == 1 ? 'Activo' : 'Inactivo'), width: '120px' },
        {
            name: 'Acciones',
            width: '160px',
            cell: (row) => (
                <div className="flex gap-2">
                    <button
                        className="btn btn-sm btn-warning"
                        onClick={() => {
                            const initial = toFormInitial(row)
                            open({
                                title: `Editar: ${row.nombre_comercial ?? row.id}`,
                                content: (
                                    <FormComercio
                                        mode="edit"
                                        initial={initial}
                                        onSuccess={() => {
                                            // El hook useActualizarComercio ya invalida la lista.
                                            // Aquí solo cerramos el modal.
                                            close()
                                        }}
                                    />
                                ),
                                size: 'xl',
                            })
                        }}
                    >
                        Editar
                    </button>
                    {/* Si luego agregas DELETE, pon aquí un botón Eliminar */}
                </div>
            ),
        },
    ], [open, close])



    const estados = [
        { value: 1, label: 'Activo' },
        { value: 0, label: 'Inactivo' },
    ]

    const { data: servicios } = useServicios()
    const servicioOptions = (servicios ?? []).map((s) => ({
        value: String(s.id),
        label: s.nombre ?? `Servicio ${s.id}`,
    }))


    return (
        <div className="card bg-white">

            <div className='flex bg-gray-200 w-full gap-10 p-2'>
                <label className="input">
                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            strokeWidth="2.5"
                            fill="none"
                            stroke="currentColor"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.3-4.3"></path>
                        </g>
                    </svg>
                    <input type="search" required placeholder="Search" />
                </label>


                <Select
                    options={servicioOptions}

                />

                <div>
                    <Select
                        options={estados}

                    />
                </div>

            </div>
            <div className="card-body">
                <DataTable
                    columns={columns}
                    data={items}
                    progressPending={isLoading}
                    pagination
                    paginationServer
                    paginationTotalRows={totalRows}
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

export default TableComercios
