import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "../../shared/components/Input"; // 🔁 ajusta la ruta según tu proyecto

type FormValues = {
  direccionRecogida: string;
  telefonoRecogida: string;
  direccionEntrega: string;
  telefonoEntrega?: string; // opcional
};

const FormRecogida: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      direccionRecogida: "",
      telefonoRecogida: "",
      direccionEntrega: "",
      telefonoEntrega: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log("Datos de recogida/entrega:", data);
    alert("Datos guardados correctamente ✅");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-base-200 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">
        Formulario de Recogida y Entrega 📦
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Dirección de recogida (requerida) */}
        <Input
          label="Dirección de recogida"
          placeholder="Calle 123, Ciudad"
          errorText={errors.direccionRecogida?.message}
          {...register("direccionRecogida", {
            required: "La dirección de recogida es obligatoria",
            minLength: { value: 5, message: "Demasiado corta" },
          })}
        />

        {/* Teléfono de recogida (requerido) */}
        <Input
          label="Teléfono de recogida"
          type="tel"
          placeholder="+57 300 123 4567"
          helperText="Incluye indicativo si aplica"
          errorText={errors.telefonoRecogida?.message}
          {...register("telefonoRecogida", {
            required: "El teléfono de recogida es obligatorio",
            pattern: {
              value: /^[0-9+\s()-]{7,}$/i,
              message: "Ingrese un número de teléfono válido",
            },
          })}
        />

        {/* Dirección de entrega (requerida) */}
        <Input
          label="Dirección de entrega"
          placeholder="Carrera 45 # 12-34, Ciudad"
          errorText={errors.direccionEntrega?.message}
          {...register("direccionEntrega", {
            required: "La dirección de entrega es obligatoria",
            minLength: { value: 5, message: "Demasiado corta" },
          })}
        />

        {/* Teléfono de entrega (opcional) */}
        <Input
          label="Teléfono de entrega (opcional)"
          type="tel"
          placeholder="+57 300 987 6543"
          helperText="Solo si se requiere contacto en el destino"
          errorText={errors.telefonoEntrega?.message}
          {...register("telefonoEntrega", {
            pattern: {
              value: /^[0-9+\s()-]{7,}$/i,
              message: "Ingrese un número de teléfono válido",
            },
          })}
        />

        <button type="submit" className="btn btn-primary w-full mt-2">
          Guardar
        </button>
      </form>
    </div>
  );
};

export default FormRecogida;
