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
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      direccionRecogidaEnvio: "",
      direccionEntregaEnvio: "",
    },
    mode: "onTouched",
  });

  // Número de WhatsApp destino (sin +57)
  const numeroWhatsApp = "3134089563";

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const formData = {
      direccionRecogidaEnvio: data.direccionRecogidaEnvio.trim(),
      direccionEntregaEnvio: data.direccionEntregaEnvio.trim(),
    };

    const mensaje =
      `*PEDIDO* desde la pagina\n\n` +   // 👈 activador
      `📦 ¡Hola! Me gustaría coordinar un envío:\n\n` +
      `📍 Dirección de Recogida: ${formData.direccionRecogidaEnvio}\n` +
      `📍 Dirección de Entrega: ${formData.direccionEntregaEnvio}`;

    const url = `https://wa.me/57${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  };

  return (
    <section className="flex justify-center items-center py-2 px-0">
      <div className="w-full max-w-xl">
        <div className="card">
          <div className="card-body">
            <h2 className="text-xl lg:text-3xl text-[#E76B51] font-bold text-center mb-2">
              Formulario de Envío 📦
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Dirección de recogida del envío */}
              <div className="form-control">
                <label className="label justify-between">
                  <span className="label-text">Dirección de recogida del envío</span>
                  {errors.direccionRecogidaEnvio && (
                    <span className="badge badge-error badge-sm">Requerido</span>
                  )}
                </label>
                <input
                  type="text"
                  placeholder="Ej: Calle 123 #45-67, Ciudad"
                  className={`input input-bordered w-full ${
                    errors.direccionRecogidaEnvio ? "input-error" : ""
                  }`}
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
                <label className="label justify-between">
                  <span className="label-text">Dirección de entrega del envío</span>
                  {errors.direccionEntregaEnvio && (
                    <span className="badge badge-error badge-sm">Requerido</span>
                  )}
                </label>
                <input
                  type="text"
                  placeholder="Ej: Carrera 50 #10-20, Ciudad"
                  className={`input input-bordered w-full ${
                    errors.direccionEntregaEnvio ? "input-error" : ""
                  }`}
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

              <button
                type="submit"
                className="btn bg-[#E76B51] text-white btn-block mt-4"
                disabled={isSubmitting}
              >
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
