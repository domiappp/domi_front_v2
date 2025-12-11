import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { ShoppingCart, MapPin, Phone } from "lucide-react";

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
    const formData = {
      listaCompras: data.listaCompras.trim(),
      direccionEntrega: data.direccionEntrega.trim(),
      telefonoEntrega: onlyDigits(data.telefonoEntrega),
    };

    const mensaje =
      `*PEDIDO* desde la pagina\n\n` +
      `🛒 ¡Hola! Me gustaría realizar una compra:\n\n` +
      `🛍️ Lista de Compras: ${formData.listaCompras}\n` +
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
            Pedido de compras a domicilio
          </span>

          <h2 className="mt-2 text-xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Haz tu lista y nosotros compramos
          </h2>

          <p className="mt-1 text-sm sm:text-[15px] text-slate-500">
            Escribe lo que necesitas y la dirección de entrega 🛒✨
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
                <span>Lista de compras</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-full bg-slate-300 text-slate-700 text-[11px] font-semibold">
                  2
                </span>
                <span>Datos de entrega</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Bloques en columna (móvil) / fila (web) */}
              <div className="flex flex-col lg:flex-row lg:gap-5">
                {/* BLOQUE: Lista de compras */}
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3 sm:p-4 space-y-3 lg:w-1/2">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600">
                      <ShoppingCart size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">
                        Lista de compras
                      </h3>
                      <p className="text-xs text-slate-500">
                        Escribe todo lo que necesitas que compremos.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">
                      Detalle tu lista
                    </label>
                    <textarea
                      {...register("listaCompras", {
                        required: "La lista de compras es obligatoria",
                        minLength: { value: 3, message: "Demasiado corta" },
                      })}
                      className={`w-full rounded-xl border px-3 py-2.5 text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                        errors.listaCompras ? "border-red-300" : "border-slate-300"
                      }`}
                      placeholder="Ej: Pan, leche, huevos, arroz, aceite..."
                      rows={7}
                    />
                    {errors.listaCompras && (
                      <p className="text-[11px] text-red-500 mt-0.5">
                        {errors.listaCompras.message}
                      </p>
                    )}
                    <p className="text-[11px] text-slate-500">
                      Puedes separar por comas o por líneas. Mientras más claro, mejor 😉
                    </p>
                  </div>
                </div>

                {/* BLOQUE: Datos de entrega */}
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3 sm:p-4 space-y-4 lg:w-1/2">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">
                        Datos de entrega
                      </h3>
                      <p className="text-xs text-slate-500">
                        Dónde y a quién llevamos el mercado.
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
                      placeholder="Ej: Calle 123 #45-67, Barrio Centro"
                      className={`w-full rounded-xl border px-3 py-2.5 text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                        errors.direccionEntrega ? "border-red-300" : "border-slate-300"
                      }`}
                      {...register("direccionEntrega", {
                        required: "La dirección es obligatoria",
                        minLength: { value: 5, message: "Demasiado corta" },
                      })}
                    />
                    {errors.direccionEntrega && (
                      <p className="text-[11px] text-red-500 mt-0.5">
                        {errors.direccionEntrega.message}
                      </p>
                    )}
                  </div>

                  {/* Teléfono de entrega */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">
                      Teléfono de contacto
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
                          errors.telefonoEntrega ? "border-red-300" : "border-slate-300"
                        }`}
                        {...register("telefonoEntrega", {
                          required: "El teléfono es obligatorio",
                          validate: validatePhone7or10,
                        })}
                      />
                    </div>
                    {errors.telefonoEntrega && (
                      <p className="text-[11px] text-red-500 mt-0.5">
                        {errors.telefonoEntrega.message}
                      </p>
                    )}
                    <span className="text-[11px] text-slate-500">
                      Debe tener 7 o 10 dígitos (solo números).
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
                {isSubmitting ? "Enviando pedido..." : "Confirmar compra por WhatsApp"}
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

export default FormCompras;
