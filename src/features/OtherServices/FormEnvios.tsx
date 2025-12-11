import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { MapPin, ArrowRight } from "lucide-react";

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
      `*PEDIDO* desde la pagina\n\n` +
      `📦 ¡Hola! Me gustaría coordinar un envío:\n\n` +
      `📍 Dirección de Recogida: ${formData.direccionRecogidaEnvio}\n` +
      `📍 Dirección de Entrega: ${formData.direccionEntregaEnvio}`;

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
            Envío de paquete
          </span>

          <h2 className="mt-2 text-xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Coordina tu envío fácil y rápido
          </h2>

          <p className="mt-1 text-sm sm:text-[15px] text-slate-500">
            Solo dinos desde dónde recogemos y a dónde lo llevamos 📦✨
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
                <span>Dirección de recogida</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-full bg-slate-300 text-slate-700 text-[11px] font-semibold">
                  2
                </span>
                <span>Dirección de entrega</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Bloques: columna en móvil, fila en desktop */}
              <div className="flex flex-col lg:flex-row lg:gap-5">
                {/* BLOQUE RECOGIDA */}
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3 sm:p-4 space-y-3 lg:w-1/2">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">
                        Punto de recogida
                      </h3>
                      <p className="text-xs text-slate-500">
                        Desde dónde recogemos el envío.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">
                      Dirección de recogida
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Calle 123 #45-67, Barrio Centro"
                      className={`w-full rounded-xl border px-3 py-2.5 text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                        errors.direccionRecogidaEnvio
                          ? "border-red-300"
                          : "border-slate-300"
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
                      <p className="text-[11px] text-red-500 mt-0.5">
                        {errors.direccionRecogidaEnvio.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* BLOQUE ENTREGA */}
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3 sm:p-4 space-y-3 lg:w-1/2">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                      <ArrowRight size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">
                        Punto de entrega
                      </h3>
                      <p className="text-xs text-slate-500">
                        A dónde debemos llevar el envío.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">
                      Dirección de entrega
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Carrera 50 #10-20, Conjunto X"
                      className={`w-full rounded-xl border px-3 py-2.5 text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                        errors.direccionEntregaEnvio
                          ? "border-red-300"
                          : "border-slate-300"
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
                      <p className="text-[11px] text-red-500 mt-0.5">
                        {errors.direccionEntregaEnvio.message}
                      </p>
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
                {isSubmitting ? "Enviando solicitud..." : "Confirmar envío por WhatsApp"}
              </button>

              <p className="text-[11px] text-center text-slate-500">
                Abriremos WhatsApp con el resumen del envío listo para enviar ✅
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FormEnvios;
