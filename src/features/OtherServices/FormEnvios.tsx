import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

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
    <section className="flex justify-center items-center py-2 px-0">
      <div className="w-full max-w-xl">
        <div className="card bg-[#fff]">
          <div className="card-body">
            <h2 className="text-xl lg:text-3xl font-bold text-center mb-2">
              Formulario de Envío 📦
            </h2>
        

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Dirección de recogida del envío */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Dirección de recogida del envío</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: Calle 123 #45-67, Ciudad"
                  className="input input-bordered w-full"
                  {...register("direccionRecogidaEnvio", {
                    required: "La dirección de recogida es obligatoria",
                    minLength: {
                      value: 5,
                      message: "La dirección es demasiado corta",
                    },
                  })}
                />
                {errors.direccionRecogidaEnvio && (
                  <p className="text-error text-sm mt-1">
                    {errors.direccionRecogidaEnvio.message}
                  </p>
                )}
              </div>

              {/* Dirección de entrega del envío */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Dirección de entrega del envío</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: Carrera 50 #10-20, Ciudad"
                  className="input input-bordered w-full"
                  {...register("direccionEntregaEnvio", {
                    required: "La dirección de entrega es obligatoria",
                    minLength: {
                      value: 5,
                      message: "La dirección es demasiado corta",
                    },
                  })}
                />
                {errors.direccionEntregaEnvio && (
                  <p className="text-error text-sm mt-1">
                    {errors.direccionEntregaEnvio.message}
                  </p>
                )}
              </div>

            <button type="submit" className="btn bg-[#E76B51] text-white btn-block mt-4">
                Confirmar Envío
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FormEnvios;
