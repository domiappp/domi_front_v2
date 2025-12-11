import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { CreditCard, MapPin, Phone } from "lucide-react";

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
    const formData = {
      direccionRecogidaPago: data.transferencia
        ? "N/A"
        : data.direccionRecogida.trim(),
      telefonoRecogidaPago: onlyDigits(data.telefonoContacto),
    };

    const mensaje =
      `*PEDIDO* desde la pagina\n\n` +
      `💰 ¡Hola! Me gustaría solicitar el servicio de pagos:\n\n` +
      `🛵📍 Dirección de Recogida: ${formData.direccionRecogidaPago}\n` +
      `📞 Teléfono: ${formData.telefonoRecogidaPago}`;

    const url = `https://wa.me/57${numeroWhatsApp}?text=${encodeURIComponent(
      mensaje
    )}`;
    window.open(url, "_blank");
  };

  return (
    <section className="flex justify-center items-center px-2 py-6 sm:py-8 bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <div className="w-full max-w-4xl">
        {/* Encabezado */}
        <div className="mb-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600 border border-orange-100">
            <span className="size-1.5 rounded-full bg-orange-500" />
            Servicio de pagos
          </span>

          <h2 className="mt-2 text-xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Pide que paguemos por ti
          </h2>

          <p className="mt-1 text-sm sm:text-[15px] text-slate-500">
            Elige si es por transferencia o recogemos el dinero en tu dirección 💳🛵
          </p>
        </div>

        {/* Card principal */}
        <div className="rounded-3xl bg-white shadow-xl border border-slate-100 backdrop-blur-sm">
          <div className="p-3 sm:p-5 space-y-6">
            {/* Indicadores */}
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-full bg-orange-500 text-white text-[11px] font-semibold">
                  1
                </span>
                <span>Método de pago</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-full bg-slate-300 text-slate-700 text-[11px] font-semibold">
                  2
                </span>
                <span>Datos de contacto</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Layout: columna en móvil, dos columnas en desktop */}
              <div className="flex flex-col lg:flex-row lg:gap-5">
                {/* COLUMNA IZQUIERDA: Método de pago */}
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3 sm:p-4 space-y-3 lg:w-1/2">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600">
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">
                        ¿Cómo quieres pagar?
                      </h3>
                      <p className="text-xs text-slate-500">
                        Elige si hacemos una transferencia o recogemos el dinero.
                      </p>
                    </div>
                  </div>

                  {/* Toggle transferencia */}
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-3 text-sm text-slate-700 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-400"
                        {...register("transferencia")}
                      />
                      <span>Pago por transferencia bancaria</span>
                    </label>
                    <p className="text-[11px] text-slate-500">
                      {esTransferencia
                        ? "Has seleccionado transferencia. No necesitas dirección, pero el teléfono sigue siendo obligatorio."
                        : "Si no es transferencia, indica dirección de recogida y teléfono de contacto (ambos obligatorios)."}
                    </p>
                  </div>
                </div>

                {/* COLUMNA DERECHA: Datos de recogida / contacto */}
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3 sm:p-4 space-y-4 lg:w-1/2">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">
                        Datos de recogida y contacto
                      </h3>
                      <p className="text-xs text-slate-500">
                        Necesitamos al menos un teléfono para coordinar.
                      </p>
                    </div>
                  </div>

                  {/* Dirección de recogida – solo si NO es transferencia */}
                  {!esTransferencia && (
                    <div className="space-y-1">
                      <label className="flex items-center justify-between text-xs font-medium text-slate-700">
                        <span>Dirección de recogida del dinero</span>
                        {errors.direccionRecogida && (
                          <span className="text-[10px] font-semibold text-red-500">
                            Requerido
                          </span>
                        )}
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Calle 123 #45-67, Barrio Centro"
                        className={`w-full rounded-xl border px-3 py-2.5 text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                          errors.direccionRecogida
                            ? "border-red-300"
                            : "border-slate-300"
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
                        <p className="text-[11px] text-red-500 mt-0.5">
                          {errors.direccionRecogida.message}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Teléfono de contacto – siempre visible */}
                  <div className="space-y-1">
                    <label className="flex items-center justify-between text-xs font-medium text-slate-700">
                      <span>Teléfono de contacto</span>
                      {errors.telefonoContacto && (
                        <span className="text-[10px] font-semibold text-red-500">
                          Revisar
                        </span>
                      )}
                    </label>

                    <div className="flex gap-2">
                      <div className="inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-2 py-2 text-xs text-slate-600">
                        <Phone size={14} />
                        <span>+57</span>
                      </div>
                      <input
                        type="tel"
                        placeholder="300 123 4567"
                        className={`w-full rounded-xl border px-3 py-2.5 text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                          errors.telefonoContacto
                            ? "border-red-300"
                            : "border-slate-300"
                        }`}
                        {...register("telefonoContacto", {
                          required: "El teléfono de contacto es obligatorio",
                          validate: (value: string) => {
                            const digits = onlyDigits(value);
                            if (digits.length === 7 || digits.length === 10)
                              return true;
                            return "El teléfono debe tener exactamente 7 o 10 dígitos";
                          },
                        })}
                      />
                    </div>

                    {errors.telefonoContacto && (
                      <p className="text-[11px] text-red-500 mt-0.5">
                        {errors.telefonoContacto.message}
                      </p>
                    )}

                    {esTransferencia && (
                      <span className="text-[11px] text-slate-500">
                        Usaremos este número para confirmar la transferencia.
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Botón */}
              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 text-sm shadow-lg shadow-orange-500/30 hover:from-orange-600 hover:to-orange-700 transition active:scale-[0.97]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando solicitud..." : "Confirmar pago por WhatsApp"}
              </button>

              <p className="text-[11px] text-center text-slate-500">
                Abriremos WhatsApp con el resumen del pago listo para enviar ✅
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FormPagos;
