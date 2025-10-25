import Swal from "sweetalert2";
import {
  useHorariosComerciales,
  useDeleteHorarioComercial,
  useHorariosEspeciales,
  useDeleteHorarioEspecial,
} from "../../services/useHorarios";

type Props = {
  comercioId: number;
  tipo: "comercial" | "especial";
};

export default function HorariosTable({ comercioId, tipo }: Props) {
  const { data, isLoading } =
    tipo === "comercial"
      ? useHorariosComerciales(comercioId)
      : useHorariosEspeciales(comercioId);

  const deleteCom = useDeleteHorarioComercial(comercioId);
  const deleteEsp = useDeleteHorarioEspecial(comercioId);

  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!confirm.isConfirmed) return;
    try {
      if (tipo === "comercial") await deleteCom.mutateAsync(id);
      else await deleteEsp.mutateAsync(id);
      Swal.fire("Eliminado", "El registro se eliminó correctamente", "success");
    } catch (e: any) {
      Swal.fire("Error", e.message || "No se pudo eliminar", "error");
    }
  };

  if (isLoading)
    return <div className="text-center py-4 text-gray-500">Cargando...</div>;

  const items = data?.items || [];

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full text-sm">
        <thead>
          <tr>
            {tipo === "comercial" ? (
              <>
                <th>Día</th>
                <th>Turno</th>
                <th>Apertura</th>
                <th>Cierre</th>
                <th></th>
              </>
            ) : (
              <>
                <th>Fecha</th>
                <th>Turno</th>
                <th>Apertura</th>
                <th>Cierre</th>
                <th>Cerrado</th>
                <th></th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {items.map((h) => (
            <tr key={h.id}>
              {tipo === "comercial" ? (
                <>
                  <td>{(h as any).dia_semana}</td>
                  <td>{(h as any).turno}</td>
                  <td>{(h as any).hora_apertura}</td>
                  <td>{(h as any).hora_cierre}</td>
                </>
              ) : (
                <>
                  <td>{(h as any).fecha}</td>
                  <td>{(h as any).turno}</td>
                  <td>{(h as any).hora_apertura ?? "-"}</td>
                  <td>{(h as any).hora_cierre ?? "-"}</td>
                  <td>{(h as any).cerrado ? "Sí" : "No"}</td>
                </>
              )}
              <td className="text-right">
                <button
                  onClick={() => handleDelete(h.id)}
                  className="btn btn-error btn-xs text-white"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {!items.length && (
        <div className="p-4 text-center text-gray-500">No hay registros.</div>
      )}
    </div>
  );
}
