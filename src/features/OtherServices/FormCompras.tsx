import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

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
    <section className="flex justify-center items-center py-2 px-0">
      <div className="w-full max-w-xl">
        <div className="card bg-[#fff]">
          <div className="card-body">
            <h2 className="text-xl lg:text-3x text-[#E76B51] font-bold text-center mb-2">
              Formulario de Compras 🛒
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Lista de compras */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Lista de compras
                  </span>
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
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Dirección de entrega</span>
                </label>
                <input
                  type="text"
                  placeholder="Calle 123, Ciudad"
                  className="input input-bordered w-full"
                  {...register("direccionEntrega", {
                    required: "La dirección es obligatoria",
                  })}
                />
                {errors.direccionEntrega && (
                  <p className="text-error text-sm mt-1">
                    {errors.direccionEntrega.message}
                  </p>
                )}
              </div>

              {/* Teléfono de entrega */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Teléfono de entrega</span>
                </label>
                <input
                  type="tel"
                  placeholder="+34 600 123 456"
                  className="input input-bordered w-full"
                  {...register("telefonoEntrega", {
                    required: "El teléfono es obligatorio",
                    pattern: {
                      value: /^[0-9+\s()\-]+$/,
                      message: "Ingrese un número de teléfono válido",
                    },
                  })}
                />
                {errors.telefonoEntrega && (
                  <p className="text-error text-sm mt-1">
                    {errors.telefonoEntrega.message}
                  </p>
                )}
              </div>

              <button type="submit" className="btn bg-[#E76B51] text-white btn-block mt-4">
                Confirmar Compra
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FormCompras;
