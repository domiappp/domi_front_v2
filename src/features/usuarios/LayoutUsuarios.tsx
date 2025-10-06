import React from 'react';
import { useGlobalModal } from '../../store/modal.store';
import TablaUsuarios from './TablaUsuarios';
import FormUsuarios from './FormUsuarios';

const LayoutUsuarios: React.FC = () => {
  const { open } = useGlobalModal();

  return (
    <>
      <div className="mb-4 flex items-center justify-end">
        <button
          className="btn btn-primary"
          onClick={() =>
            open({
              title: 'Registrar usuario',
              content: <FormUsuarios mode="create" />,
              size: 'xl',
            })
          }
        >
          Nuevo usuario
        </button>
      </div>

      <TablaUsuarios />
    </>
  );
};

export default LayoutUsuarios;
