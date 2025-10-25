import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useCreateHorarioComercial } from "../../services/useHorarios";

type FormValues = {
  dia_semana: string;
  turno: number;
  hora_apertura: string;
  hora_cierre: string;
};

export default function HorarioComercialForm({ comercioId }: { comercioId: number }) {
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const createHorario = useCreateHorarioComercial(comercioId);

  const onSubmit = async (data: FormValues) => {
    try {
      await createHorario.mutateAsync(data);
      Swal.fire("Éxito", "Horario comercial agregado correctamente", "success");
      reset();
    } catch (e: any) {
      Swal.fire("Error", e.message || "No se pudo crear el horario", "error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end mb-6"
    >
      <select {...register("dia_semana")} className="select select-bordered w-full">
        <option value="">Día</option>
        <option value="lunes">Lunes</option>
        <option value="martes">Martes</option>
        <option value="miercoles">Miércoles</option>
        <option value="jueves">Jueves</option>
        <option value="viernes">Viernes</option>
        <option value="sabado">Sábado</option>
        <option value="domingo">Domingo</option>
      </select>

      <input
        type="number"
        {...register("turno", { valueAsNumber: true })}
        placeholder="Turno"
        className="input input-bordered w-full"
      />
      <input
        type="time"
        {...register("hora_apertura")}
        className="input input-bordered w-full"
      />
      <input
        type="time"
        {...register("hora_cierre")}
        className="input input-bordered w-full"
      />
      <button type="submit" className="btn btn-primary w-full">
        Agregar
      </button>
    </form>
  );
}
