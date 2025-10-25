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
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      direccionRecogida: "",
      telefonoRecogida: "",
      direccionEntrega: "",
      telefonoEntrega: "",
    },
    mode: "onTouched",
  });

  // Cambia este número (sin +57)
  const numeroWhatsApp = "3134089563";

  const onlyDigits = (v: string) => v.replace(/\D/g, "");
  const validatePhone7or10 = (v: string) => {
    const d = onlyDigits(v || "");
    return d.length === 7 || d.length === 10
      ? true
      : "Debe tener exactamente 7 o 10 dígitos";
  };

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    // Mapeo a los nombres usados en el template "tal cual"
    const formData = {
      direccionRecoger: data.direccionRecogida.trim(),
      telefonoRecoger: onlyDigits(data.telefonoRecogida),
      direccionEntrega: data.direccionEntrega.trim(),
      telefonoEntrega: data.telefonoEntrega
        ? onlyDigits(data.telefonoEntrega)
        : "N/A",
    };

    const mensaje =
      `*PEDIDO* desde la pagina\n\n` +   // 👈 activador
      `🛵 ¡Hola! Quiero coordinar una recogida y entrega:\n\n` +
      `📍 Dirección de Recogida: ${formData.direccionRecoger}\n` +
      `📞 Teléfono de Recogida: ${formData.telefonoRecoger}\n\n` +
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
              Formulario de Recogida y Entrega 📦
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Dirección de recogida (requerida) */}
              <div className="form-control">
                <label className="label justify-between">
                  <span className="label-text">Dirección de recogida</span>
                  {errors.direccionRecogida && (
                    <span className="badge badge-error badge-sm">Requerido</span>
                  )}
                </label>
                <input
                  type="text"
                  placeholder="Calle 123, Ciudad"
                  className={`input input-bordered w-full ${
                    errors.direccionRecogida ? "input-error" : ""
                  }`}
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
                <label className="label justify-between">
                  <span className="label-text">Teléfono de recogida</span>
                  {errors.telefonoRecogida && (
                    <span className="badge badge-error badge-sm">Revisar</span>
                  )}
                </label>
                <input
                  type="tel"
                  placeholder="+57 300 123 4567"
                  className={`input input-bordered w-full ${
                    errors.telefonoRecogida ? "input-error" : ""
                  }`}
                  {...register("telefonoRecogida", {
                    required: "El teléfono de recogida es obligatorio",
                    validate: validatePhone7or10,
                  })}
                />
                {errors.telefonoRecogida && (
                  <p className="text-error text-sm mt-1">
                    {errors.telefonoRecogida.message}
                  </p>
                )}
                <span className="text-xs mt-1 text-base-content/60">
                  Debe tener 7 o 10 dígitos.
                </span>
              </div>

              {/* Dirección de entrega (requerida) */}
              <div className="form-control">
                <label className="label justify-between">
                  <span className="label-text">Dirección de entrega</span>
                  {errors.direccionEntrega && (
                    <span className="badge badge-error badge-sm">Requerido</span>
                  )}
                </label>
                <input
                  type="text"
                  placeholder="Carrera 45 # 12-34, Ciudad"
                  className={`input input-bordered w-full ${
                    errors.direccionEntrega ? "input-error" : ""
                  }`}
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

              {/* Teléfono de entrega (opcional, 7 u 10 si lo ingresan) */}
              <div className="form-control">
                <label className="label justify-between">
                  <span className="label-text">Teléfono de entrega (opcional)</span>
                  {errors.telefonoEntrega && (
                    <span className="badge badge-error badge-sm">Revisar</span>
                  )}
                </label>
                <input
                  type="tel"
                  placeholder="+57 300 987 6543"
                  className={`input input-bordered w-full ${
                    errors.telefonoEntrega ? "input-error" : ""
                  }`}
                  {...register("telefonoEntrega", {
                    validate: (v: string | undefined) => {
                      if (!v) return true;
                      const d = onlyDigits(v);
                      if (d.length === 0) return true;
                      return d.length === 7 || d.length === 10
                        ? true
                        : "Si lo ingresas, debe tener 7 o 10 dígitos";
                    },
                  })}
                />
                {errors.telefonoEntrega && (
                  <p className="text-error text-sm mt-1">
                    {errors.telefonoEntrega.message}
                  </p>
                )}
                <span className="text-xs mt-1 text-base-content/60">
                  Solo si se requiere contacto en el destino (7 o 10 dígitos).
                </span>
              </div>

              {/* Botón que envía a WhatsApp al validar */}
              <button
                type="submit"
                className="btn bg-[#E76B51] text-white btn-block mt-4"
                disabled={isSubmitting}
              >
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
