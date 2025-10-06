import React from 'react'
import { useGlobalModal } from '../../store/modal.store'
import TablePublicidad from './TablePublicidad'
import FormPublicidad from './FormPublicidad'

const LayoutPublicidad: React.FC = () => {
  const { open } = useGlobalModal()

  return (
    <>
      <div className="mb-4 flex items-center justify-end">
        <button
          className="btn btn-primary"
          onClick={() =>
            open({
              title: 'Registrar publicidad',
              content: <FormPublicidad mode="create" />,
              size: 'xl',
            })
          }
        >
          Nueva publicidad
        </button>
      </div>

      <TablePublicidad />
    </>
  )
}

export default LayoutPublicidad
