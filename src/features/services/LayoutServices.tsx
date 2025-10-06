import React from 'react'
import TableServices from './TableServices'
import FormServices from './FormServices'
import { useGlobalModal } from '../../store/modal.store';

const LayoutServices: React.FC = () => {

  const { open } = useGlobalModal();

  return (
    <>
      <button
        className="btn"
        onClick={() =>
          open({
            title: "Hola!",
            content: (
              <FormServices mode='create' />
            ),
            size: "lg",
          })
        }
      >
        Abrir modal
      </button>
      <TableServices />
    </>
  )
}

export default LayoutServices