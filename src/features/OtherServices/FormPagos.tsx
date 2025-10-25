import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type FormValues = {
  transferencia: boolean;
  direccionRecogida: string;
  telefonoContacto: string;
};

const FormPagos: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      transferencia: false,
      direccionRecogida: "",
      telefonoContacto: "",
    },
    shouldUnregister: true,
    mode: "onTouched",
  });

  const esTransferencia = watch("transferencia");

  useEffect(() => {
    if (esTransferencia) {
      setValue("direccionRecogida", "");
      clearErrors("direccionRecogida");
    }
  }, [esTransferencia, setValue, clearErrors]);

  // Cambia este número si es necesario (sin +57)
  const numeroWhatsApp = "3134089563";

  // Normaliza a dígitos
  const onlyDigits = (v: string) => v.replace(/\D/g, "");

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    // Mapear a los nombres que pide el mensaje "tal cual"
    const formData = {
      direccionRecogidaPago: data.transferencia
        ? "N/A"
        : data.direccionRecogida.trim(),
      telefonoRecogidaPago: onlyDigits(data.telefonoContacto), // solo dígitos en el mensaje
    };

    const mensaje =
      `*PEDIDO* desde la pagina\n\n` + // activador
      `💰¡Hola! Me gustaría solicitar el servicio de pagos:\n\n` +
      `🛵📍Dirección de Recogida: ${formData.direccionRecogidaPago}\n` +
      `📞 Teléfono: ${formData.telefonoRecogidaPago}`;

    const url = `https://wa.me/57${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  };

  return (
    <section className="flex justify-center items-center py-2 px-0">
      <div className="w-full max-w-xl">
        {/* Tarjeta envolvente */}
        <div className="card">
          <div className="card-body">
            <h2 className="text-xl lg:text-3xl text-[#E76B51] font-bold text-center mb-2">
              Formulario de Pagos 💳
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Selección de transferencia */}
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    {...register("transferencia")}
                  />
                  <span className="label-text">Pago por transferencia</span>
                </label>
                <span className="text-xs mt-1 text-base-content/60">
                  {esTransferencia
                    ? "Has seleccionado transferencia. No necesitas dirección, pero el teléfono sigue siendo obligatorio."
                    : "Si no es transferencia, indica dirección de recogida y teléfono de contacto (ambos obligatorios)."}
                </span>
              </div>

              {/* Dirección de recogida – solo visible si NO es transferencia */}
              {!esTransferencia && (
                <div className="form-control">
                  <label className="label justify-between">
                    <span className="label-text">
                      Dirección de recogida del dinero
                    </span>
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
                      minLength: {
                        value: 5,
                        message: "Demasiado corta",
                      },
                    })}
                  />
                  {errors.direccionRecogida && (
                    <p className="text-error text-sm mt-1">
                      {errors.direccionRecogida.message}
                    </p>
                  )}
                </div>
              )}

              {/* Teléfono de contacto – siempre visible */}
              <div className="form-control">
                <label className="label justify-between">
                  <span className="label-text">Teléfono de contacto</span>
                  {errors.telefonoContacto && (
                    <span className="badge badge-error badge-sm">Revisar</span>
                  )}
                </label>
                <input
                  type="tel"
                  placeholder="+57 300 123 4567"
                  className={`input input-bordered w-full ${
                    errors.telefonoContacto ? "input-error" : ""
                  }`}
                  {...register("telefonoContacto", {
                    required: "El teléfono de contacto es obligatorio",
                    validate: (value: string) => {
                      const digits = onlyDigits(value);
                      if (digits.length === 7 || digits.length === 10) return true;
                      return "El teléfono debe tener exactamente 7 o 10 dígitos";
                    },
                  })}
                />
                {errors.telefonoContacto && (
                  <p className="text-error text-sm mt-1">
                    {errors.telefonoContacto.message}
                  </p>
                )}
                {esTransferencia && (
                  <span className="text-xs mt-1 text-base-content/60">
                    Usaremos este número para confirmar la transferencia.
                  </span>
                )}
              </div>

              {/* Botón único que envía a WhatsApp si el formulario es válido */}
              <button
                type="submit"
                className="btn bg-[#E76B51] text-white btn-block mt-4"
                disabled={isSubmitting}
              >
                Confirmar Pago
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FormPagos;
