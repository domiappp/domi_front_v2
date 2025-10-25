import HorariosManager from "../../features/horarios/HorariosManager";


const ComercioHorariosPage = () => {
      const comercioId = 2; // puedes obtenerlo desde router o props

  return (
    <div className="p-6">
      <HorariosManager comercioId={comercioId} />
    </div>
  )
}

export default ComercioHorariosPage