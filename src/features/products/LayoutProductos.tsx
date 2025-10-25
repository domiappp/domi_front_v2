import React from 'react';
import { useGlobalModal } from '../../store/modal.store';
import FormProductos from './FormProductos';
import TablaProductos from './TablaProductos';

const LayoutProductos: React.FC = () => {
  const { open } = useGlobalModal();

  return (
    <>
      <div className="mb-4 flex items-center justify-end">
        <button
          className="btn btn-primary"
          onClick={() =>
            open({
              title: 'Registrar producto',
              content: <FormProductos mode="create" />,
              size: 'xl',
            })
          }
        >
          Nuevo producto
        </button>
      </div>

      <TablaProductos />
    </>
  );
};

export default LayoutProductos;
