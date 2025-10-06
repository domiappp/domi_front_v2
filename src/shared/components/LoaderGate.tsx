// components/LoaderGate.tsx
import React from 'react';
import Loader from '../../utils/Loader';
import { useLoader } from '../../store/loader.store';

const LoaderGate: React.FC = () => {
  const visible = useLoader((s) => s.visible);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center  bg-[#000]/60 z-50">
      <Loader />
    </div>
  );
};

export default LoaderGate;
