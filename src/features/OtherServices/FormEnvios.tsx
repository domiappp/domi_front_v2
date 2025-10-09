import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "../../shared/components/Input"; // 🔁 ajusta la ruta según tu proyecto

type FormValues = {
  direccionRecogidaEnvio: string;
  direccionEntregaEnvio: string;
};

const FormEnvios: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      direccionRecogidaEnvio: "",
      direccionEntregaEnvio: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log("Datos del envío:", data);
    alert("Datos del envío guardados correctamente 🚚");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-base-200 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">
        Formulario de Envío 📦
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Dirección de recogida del envío */}
        <Input
          label="Dirección de recogida del envío"
          placeholder="Ej: Calle 123 #45-67, Ciudad"
          errorText={errors.direccionRecogidaEnvio?.message}
          {...register("direccionRecogidaEnvio", {
            required: "La dirección de recogida es obligatoria",
            minLength: {
              value: 5,
              message: "La dirección es demasiado corta",
            },
          })}
        />

        {/* Dirección de entrega del envío */}
        <Input
          label="Dirección de entrega del envío"
          placeholder="Ej: Carrera 50 #10-20, Ciudad"
          errorText={errors.direccionEntregaEnvio?.message}
          {...register("direccionEntregaEnvio", {
            required: "La dirección de entrega es obligatoria",
            minLength: {
              value: 5,
              message: "La dirección es demasiado corta",
            },
          })}
        />

        <button type="submit" className="btn btn-primary w-full mt-2">
          Guardar envío
        </button>
      </form>
    </div>
  );
};

export default FormEnvios;
