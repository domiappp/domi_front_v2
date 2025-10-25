import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useCreateHorarioEspecial } from "../../services/useHorarios";

type FormValues = {
  fecha: string;
  turno: number;
  hora_apertura?: string | null;
  hora_cierre?: string | null;
  cerrado?: boolean;
};

export default function HorarioEspecialForm({ comercioId }: { comercioId: number }) {
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const createHorario = useCreateHorarioEspecial(comercioId);

  const onSubmit = async (data: FormValues) => {
    try {
      await createHorario.mutateAsync({
        ...data,
        cerrado: data.cerrado ? 1 : 0,
      });
      Swal.fire("Éxito", "Horario especial creado", "success");
      reset();
    } catch (e: any) {
      Swal.fire("Error", e.message || "No se pudo crear el horario", "error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end mb-6"
    >
      <input
        type="date"
        {...register("fecha")}
        className="input input-bordered w-full"
      />
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
      <label className="flex items-center gap-2">
        <input type="checkbox" {...register("cerrado")} className="checkbox checkbox-primary" />
        <span className="text-sm">Cerrado</span>
      </label>
      <button type="submit" className="btn btn-primary w-full">
        Agregar
      </button>
    </form>
  );
}
