import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { MapPin, Phone, ArrowRight } from "lucide-react";

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
    const formData = {
      direccionRecoger: data.direccionRecogida.trim(),
      telefonoRecoger: onlyDigits(data.telefonoRecogida),
      direccionEntrega: data.direccionEntrega.trim(),
      telefonoEntrega: data.telefonoEntrega
        ? onlyDigits(data.telefonoEntrega)
        : "N/A",
    };

    const mensaje =
      `*PEDIDO* desde la pagina\n\n` +
      `🛵 ¡Hola! Quiero coordinar una recogida y entrega:\n\n` +
      `📍 Dirección de Recogida: ${formData.direccionRecoger}\n` +
      `📞 Teléfono de Recogida: ${formData.telefonoRecoger}\n\n` +
      `📍 Dirección de Entrega: ${formData.direccionEntrega}\n` +
      `📞 Teléfono de Entrega: ${formData.telefonoEntrega}`;

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
            Servicio de recogida y entrega
          </span>

          <h2 className="mt-2 text-xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Solicita tu recogida y entrega
          </h2>

          <p className="mt-1 text-sm sm:text-[15px] text-slate-500">
            Dinos desde dónde recogemos y a dónde llevamos tu paquete 📦✨
          </p>
        </div>

        {/* Card principal */}
        <div className="rounded-3xl bg-white shadow-xl border border-slate-100 backdrop-blur-sm">
          <div className="p-3 sm:p-5 space-y-6">
            {/* Indicadores superiores */}
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-full bg-orange-500 text-white text-[11px] font-semibold">
                  1
                </span>
                <span>Datos de recogida</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-full bg-slate-300 text-slate-700 text-[11px] font-semibold">
                  2
                </span>
                <span>Datos de entrega</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Layout: columna en móvil, dos columnas en desktop */}
              <div className="flex flex-col lg:flex-row lg:gap-5">
                {/* BLOQUE RECOGIDA */}
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3 sm:p-4 space-y-4 lg:w-1/2">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">
                        Punto de recogida
                      </h3>
                      <p className="text-xs text-slate-500">
                        Desde dónde recogemos tu pedido.
                      </p>
                    </div>
                  </div>

                  {/* Dirección de recogida */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">
                      Dirección de recogida
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
                        minLength: { value: 5, message: "Demasiado corta" },
                      })}
                    />
                    {errors.direccionRecogida && (
                      <p className="text-[11px] text-red-500 mt-0.5">
                        {errors.direccionRecogida.message}
                      </p>
                    )}
                  </div>

                  {/* Teléfono de recogida */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">
                      Teléfono de recogida
                    </label>
                    <div className="flex gap-2">
                      <div className="inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-2 py-2 text-xs text-slate-600">
                        <Phone size={14} />
                        <span>+57</span>
                      </div>
                      <input
                        type="tel"
                        inputMode="tel"
                        placeholder="300 123 4567"
                        className={`w-full rounded-xl border px-3 py-2.5 text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                          errors.telefonoRecogida
                            ? "border-red-300"
                            : "border-slate-300"
                        }`}
                        {...register("telefonoRecogida", {
                          required: "El teléfono de recogida es obligatorio",
                          validate: validatePhone7or10,
                        })}
                      />
                    </div>
                    {errors.telefonoRecogida && (
                      <p className="text-[11px] text-red-500 mt-0.5">
                        {errors.telefonoRecogida.message}
                      </p>
                    )}
                    <span className="text-[11px] text-slate-500">
                      Debe tener 7 o 10 dígitos.
                    </span>
                  </div>
                </div>

                {/* BLOQUE ENTREGA */}
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3 sm:p-4 space-y-4 lg:w-1/2">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                      <ArrowRight size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">
                        Punto de entrega
                      </h3>
                      <p className="text-xs text-slate-500">
                        A dónde debemos llevar el pedido.
                      </p>
                    </div>
                  </div>

                  {/* Dirección de entrega */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">
                      Dirección de entrega
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Carrera 45 #12-34, Conjunto X"
                      className={`w-full rounded-xl border px-3 py-2.5 text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                        errors.direccionEntrega
                          ? "border-red-300"
                          : "border-slate-300"
                      }`}
                      {...register("direccionEntrega", {
                        required: "La dirección de entrega es obligatoria",
                        minLength: { value: 5, message: "Demasiado corta" },
                      })}
                    />
                    {errors.direccionEntrega && (
                      <p className="text-[11px] text-red-500 mt-0.5">
                        {errors.direccionEntrega.message}
                      </p>
                    )}
                  </div>

                  {/* Teléfono de entrega (opcional) */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">
                      Teléfono de entrega (opcional)
                    </label>
                    <div className="flex gap-2">
                      <div className="inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-2 py-2 text-xs text-slate-600">
                        <Phone size={14} />
                        <span>+57</span>
                      </div>
                      <input
                        type="tel"
                        inputMode="tel"
                        placeholder="300 987 6543"
                        className={`w-full rounded-xl border px-3 py-2.5 text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                          errors.telefonoEntrega
                            ? "border-red-300"
                            : "border-slate-300"
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
                    </div>
                    {errors.telefonoEntrega && (
                      <p className="text-[11px] text-red-500 mt-0.5">
                        {errors.telefonoEntrega.message}
                      </p>
                    )}
                    <span className="text-[11px] text-slate-500">
                      Solo si se requiere contacto en el destino (7 o 10 dígitos).
                    </span>
                  </div>
                </div>
              </div>

              {/* Botón */}
              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 text-sm shadow-lg shadow-orange-500/30 hover:from-orange-600 hover:to-orange-700 transition active:scale-[0.97]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando pedido..." : "Confirmar recogida por WhatsApp"}
              </button>

              <p className="text-[11px] text-center text-slate-500">
                Abriremos WhatsApp con el resumen del pedido listo para enviar ✅
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FormRecogida;
