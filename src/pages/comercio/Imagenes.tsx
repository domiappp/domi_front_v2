import React from 'react'
import LayoutImagenesComercio from '../../features/imagenes/LayoutImagenesComercio'
import { useAuthStore } from '../../store/auth.store';

const Imagenes: React.FC = () => {

    const auth = useAuthStore(); // Reemplaza con el ID real del comercio
console.log("Comercio ID en Imagenes.tsx:", auth.user);
  return (
    <>
    <LayoutImagenesComercio comercioId={Number(2)} />
    </>
  )
}

export default Imagenes

