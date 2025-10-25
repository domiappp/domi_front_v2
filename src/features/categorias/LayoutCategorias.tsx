// src/pages/categorias/LayoutCategorias.tsx
import React from 'react';
import { useGlobalModal } from '../../store/modal.store';
import TablaCategorias from './TablaCategorias';
import FormCategorias from './FormCategorias';

const LayoutCategorias: React.FC = () => {
  const { open } = useGlobalModal();

  return (
    <>
      <div className="mb-4 flex items-center justify-end">
        <button
          className="btn btn-primary"
          onClick={() =>
            open({
              title: 'Registrar categoría',
              content: <FormCategorias mode="create" />,
              size: 'lg',
            })
          }
        >
          Nueva categoría
        </button>
      </div>

      <TablaCategorias />
    </>
  );
};

export default LayoutCategorias;
