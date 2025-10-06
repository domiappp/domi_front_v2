// src/components/comercios/LayoutComercios.tsx
import React from 'react'
import { useGlobalModal } from '../../store/modal.store'
import TableComercios from './TableComercios'
import FormComercio from './FormComercio'

const LayoutComercios: React.FC = () => {
    const { open } = useGlobalModal()

    return (
        <>
            <div className="mb-4 flex items-center justify-end">
                <button
                    className="btn btn-primary"
                    onClick={() =>
                        open({
                            title: 'Registrar comercio',
                            content: <FormComercio mode="create" />,
                            size: 'xl',
                        })
                    }
                >
                    Nuevo comercio
                </button>
            </div>

            <TableComercios />
        </>
    )
}

export default LayoutComercios
