import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "../../shared/components/Input"; // 👈 Asegúrate de ajustar la ruta según tu estructura

type FormValues = {
  listaCompras: string;
  direccionEntrega: string;
  telefonoEntrega: string;
};

const FormCompras: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log("Datos del formulario:", data);
    alert("Formulario enviado con éxito 🚀");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-base-200 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">
        Formulario de Compras 🛒
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Lista de compras */}
        <div>
          <label className="label">
            <span className="label-text font-semibold">Lista de compras</span>
          </label>
          <textarea
            {...register("listaCompras", {
              required: "La lista de compras es obligatoria",
            })}
            className="textarea textarea-bordered w-full"
            placeholder="Ejemplo: Pan, Leche, Huevos..."
          ></textarea>
          {errors.listaCompras && (
            <p className="text-error text-sm mt-1">
              {errors.listaCompras.message}
            </p>
          )}
        </div>

        {/* Dirección de entrega */}
        <Input
          label="Dirección de entrega"
          placeholder="Calle 123, Ciudad"
          errorText={errors.direccionEntrega?.message}
          {...register("direccionEntrega", {
            required: "La dirección es obligatoria",
          })}
        />

        {/* Teléfono de entrega */}
        <Input
          label="Teléfono de entrega"
          type="tel"
          placeholder="+34 600 123 456"
          errorText={errors.telefonoEntrega?.message}
          {...register("telefonoEntrega", {
            required: "El teléfono es obligatorio",
            pattern: {
              value: /^[0-9+\s()-]+$/,
              message: "Ingrese un número de teléfono válido",
            },
          })}
        />

        <button type="submit" className="btn btn-primary w-full mt-4">
          Enviar
        </button>
      </form>
    </div>
  );
};

export default FormCompras;
