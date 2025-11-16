import React from 'react';
import { useGlobalModal } from '../../store/modal.store';
import TablaImagenesComercio from './TablaImagenesComercio';
import FormImagenesComercio from './FormImagenesComercio';

interface Props {
  comercioId: number;
}

const LayoutImagenesComercio: React.FC<Props> = ({ comercioId }) => {
  const { open } = useGlobalModal();

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button
          className="btn btn-primary"
          onClick={() =>
            open({
              title: 'Agregar imagen',
              content: <FormImagenesComercio comercioId={comercioId} mode="create" />,
              size: 'xl',
            })
          }
        >
          Nueva imagen
        </button>
      </div>

      <TablaImagenesComercio comercioId={comercioId} />
    </>
  );
};

export default LayoutImagenesComercio;
