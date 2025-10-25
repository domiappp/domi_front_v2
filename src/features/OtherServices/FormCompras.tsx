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
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      listaCompras: "",
      direccionEntrega: "",
      telefonoEntrega: "",
    },
    mode: "onTouched",
  });

  // Número de WhatsApp destino (sin +57)
  const numeroWhatsApp = "3134089563";

  const onlyDigits = (v: string) => v.replace(/\D/g, "");
  const validatePhone7or10 = (v: string) => {
    const d = onlyDigits(v || "");
    return d.length === 7 || d.length === 10
      ? true
      : "El teléfono debe tener exactamente 7 o 10 dígitos";
  };

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    // Mapeo a los nombres del template “tal cual”
    const formData = {
      listaCompras: data.listaCompras.trim(),
      direccionEntrega: data.direccionEntrega.trim(),
      telefonoEntrega: onlyDigits(data.telefonoEntrega),
    };

    const mensaje =
      `*PEDIDO* desde la pagina\n\n` +   // 👈 activador
      `🛒 ¡Hola! Me gustaría realizar una compra:\n\n` +
      `🛍️ Lista de Compras: ${formData.listaCompras}\n` +
      `📍 Dirección de Entrega: ${formData.direccionEntrega}\n` +
      `📞 Teléfono de Entrega: ${formData.telefonoEntrega}`;

    const url = `https://wa.me/57${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  };

  return (
    <section className="flex justify-center items-center py-2 px-0">
      <div className="w-full max-w-xl">
        <div className="card">
          <div className="card-body">
            <h2 className="text-xl lg:text-3xl text-[#E76B51] font-bold text-center mb-2">
              Formulario de Compras 🛒
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Lista de compras */}
              <div className="form-control">
                <label className="label justify-between">
                  <span className="label-text font-semibold">Lista de compras</span>
                  {errors.listaCompras && (
                    <span className="badge badge-error badge-sm">Requerido</span>
                  )}
                </label>
                <textarea
                  {...register("listaCompras", {
                    required: "La lista de compras es obligatoria",
                    minLength: { value: 3, message: "Demasiado corta" },
                  })}
                  className={`textarea textarea-bordered w-full ${
                    errors.listaCompras ? "input-error" : ""
                  }`}
                  placeholder="Ejemplo: Pan, Leche, Huevos..."
                  rows={4}
                />
                {errors.listaCompras && (
                  <p className="text-error text-sm mt-1">
                    {errors.listaCompras.message}
                  </p>
                )}
              </div>

              {/* Dirección de entrega */}
              <div className="form-control">
                <label className="label justify-between">
                    <span className="label-text">Dirección de entrega</span>
                    {errors.direccionEntrega && (
                      <span className="badge badge-error badge-sm">Requerido</span>
                    )}
                </label>
                <input
                  type="text"
                  placeholder="Calle 123, Ciudad"
                  className={`input input-bordered w-full ${
                    errors.direccionEntrega ? "input-error" : ""
                  }`}
                  {...register("direccionEntrega", {
                    required: "La dirección es obligatoria",
                    minLength: { value: 5, message: "Demasiado corta" },
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
                <label className="label justify-between">
                  <span className="label-text">Teléfono de entrega</span>
                  {errors.telefonoEntrega && (
                    <span className="badge badge-error badge-sm">Revisar</span>
                  )}
                </label>
                <input
                  type="tel"
                  placeholder="+57 300 123 4567"
                  className={`input input-bordered w-full ${
                    errors.telefonoEntrega ? "input-error" : ""
                  }`}
                  {...register("telefonoEntrega", {
                    required: "El teléfono es obligatorio",
                    validate: validatePhone7or10,
                  })}
                />
                {errors.telefonoEntrega && (
                  <p className="text-error text-sm mt-1">
                    {errors.telefonoEntrega.message}
                  </p>
                )}
                <span className="text-xs mt-1 text-base-content/60">
                  Debe tener 7 o 10 dígitos (solo números).
                </span>
              </div>

              <button
                type="submit"
                className="btn bg-[#E76B51] text-white btn-block mt-4"
                disabled={isSubmitting}
              >
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
