import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type FormValues = {
  direccionRecogida: string;
  telefonoRecogida: string;
  direccionEntrega: string;
  telefonoEntrega?: string;
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
    <section className="flex justify-center items-center py-2 px-0">
      <div className="w-full max-w-xl">
        <div className="card bg-[#fff]">
          <div className="card-body">
            <h2 className="text-xl lg:text-3xl font-bold text-center mb-2">
              Formulario de Recogida y Entrega 📦
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Dirección de recogida (requerida) */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Dirección de recogida</span>
                </label>
                <input
                  type="text"
                  placeholder="Calle 123, Ciudad"
                  className="input input-bordered w-full"
                  {...register("direccionRecogida", {
                    required: "La dirección de recogida es obligatoria",
                    minLength: { value: 5, message: "Demasiado corta" },
                  })}
                />
                {errors.direccionRecogida && (
                  <p className="text-error text-sm mt-1">
                    {errors.direccionRecogida.message}
                  </p>
                )}
              </div>

              {/* Teléfono de recogida (requerido) */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Teléfono de recogida</span>
                </label>
                <input
                  type="tel"
                  placeholder="+57 300 123 4567"
                  className="input input-bordered w-full"
                  {...register("telefonoRecogida", {
                    required: "El teléfono de recogida es obligatorio",
                    pattern: {
                      value: /^[0-9+\s()\-]{7,}$/i,
                      message: "Ingrese un número de teléfono válido",
                    },
                  })}
                />
                {errors.telefonoRecogida && (
                  <p className="text-error text-sm mt-1">
                    {errors.telefonoRecogida.message}
                  </p>
                )}
                <span className="text-xs mt-1 text-base-content/60">
                  Incluye indicativo si aplica.
                </span>
              </div>

              {/* Dirección de entrega (requerida) */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Dirección de entrega</span>
                </label>
                <input
                  type="text"
                  placeholder="Carrera 45 # 12-34, Ciudad"
                  className="input input-bordered w-full"
                  {...register("direccionEntrega", {
                    required: "La dirección de entrega es obligatoria",
                    minLength: { value: 5, message: "Demasiado corta" },
                  })}
                />
                {errors.direccionEntrega && (
                  <p className="text-error text-sm mt-1">
                    {errors.direccionEntrega.message}
                  </p>
                )}
              </div>

              {/* Teléfono de entrega (opcional) */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Teléfono de entrega (opcional)</span>
                </label>
                <input
                  type="tel"
                  placeholder="+57 300 987 6543"
                  className="input input-bordered w-full"
                  {...register("telefonoEntrega", {
                    pattern: {
                      value: /^[0-9+\s()\-]{7,}$/i,
                      message: "Ingrese un número de teléfono válido",
                    },
                  })}
                />
                {errors.telefonoEntrega && (
                  <p className="text-error text-sm mt-1">
                    {errors.telefonoEntrega.message}
                  </p>
                )}
                <span className="text-xs mt-1 text-base-content/60">
                  Solo si se requiere contacto en el destino.
                </span>
              </div>

              <button type="submit" className="btn bg-[#E76B51] text-white btn-block mt-4">
                Confirmar Recogida
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FormRecogida;
