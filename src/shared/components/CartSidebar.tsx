import React from "react";
import {
  X,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  MapPin,
  Phone,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useCartStore } from "../../store/cart.store";

interface Comercio {
  id: string;
  nombre_comercial?: string;
  direccion?: string;
  telefono_secundario?: string;
}

interface CartSidebarProps {
  comercio?: Comercio;
  registrarDomi?: { mutate: (payload: any) => void }; // opcional
}

const ESTADO_PROCESO = 3;

const formatNumber = (value: number) =>
  new Intl.NumberFormat("es-CO").format(value);

const limpiarTextoWhatsApp = (t: string) => t.trim();

const negritaSegura = (t?: string | null) =>
  t ? `*${t.replace(/\*/g, "")}*` : "";

type FormValues = {
  direccion: string;
  telefono: string;
};

// 👇 helper para abrir WhatsApp de forma segura
const openWhatsAppWindow = (url: string) => {
  if (typeof window === "undefined") return;

  // intento 1: nueva pestaña/ventana
  const win = window.open(url, "_blank", "noopener,noreferrer");

  // si el navegador bloquea el popup, hacemos fallback a la misma pestaña
  if (!win) {
    window.location.href = url;
  }
};

const CartSidebar: React.FC<CartSidebarProps> = ({ comercio, registrarDomi }) => {
  const {
    activeComercioId,
    carts,
    isOpen,
    close,
    increase,
    decrease,
    removeItem,
    clearComercio,
  } = useCartStore((s) => s);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      direccion: "",
      telefono: "",
    },
  });

  if (!activeComercioId) return null;

  const cart = carts[activeComercioId] ?? {};
  const items = Object.values(cart);
  const totalQuantity = items.reduce((acc, item: any) => acc + item.quantity, 0);
  const totalPrice = items.reduce(
    (acc: number, item: any) => acc + item.quantity * item.precio,
    0
  );

  const onSubmit = (data: FormValues) => {
    if (items.length === 0) {
      toast.error("Tu carrito está vacío.");
      return;
    }

    const direccion = data.direccion.trim();
    const telefonoLimpio = data.telefono.replace(/\D/g, "");

    if (!direccion || !telefonoLimpio) {
      toast.error("La dirección y el teléfono son obligatorios para continuar.");
      return;
    }

    const productos = items
      .map((item: any) =>
        `• ${item.nombre} x${item.quantity} - $${formatNumber(
          item.precio * item.quantity
        )}`
      )
      .join("\n");

    const total = totalPrice;

    const numeroWhatsApp =
      comercio?.telefono_secundario?.replace(/\D/g, "") || "";

    if (!numeroWhatsApp) {
      toast.error(
        "Este comercio no tiene un número de WhatsApp configurado. 🙈"
      );
      return;
    }

    const payload = {
      estado: ESTADO_PROCESO,
      fecha: new Date().toISOString(),
      numero_cliente: telefonoLimpio,
      tipo_servicio: 3,
      origen_direccion:
        comercio?.direccion ||
        comercio?.nombre_comercial ||
        "Origen no especificado",
      destino_direccion: direccion,
      detalles_pedido:
        `Comercio: ${comercio?.nombre_comercial ?? "N/D"}\n` +
        `${productos}\n\n` +
        `Total: $${formatNumber(total)} + domicilio`,
    };

    registrarDomi?.mutate?.(payload);

    const mensaje =
      `*PEDIDO* desde Domiciliosw.com\n` +
      `${numeroWhatsApp} a ${negritaSegura(
        comercio?.nombre_comercial
      )} con los siguientes productos:\n\n` +
      `${productos}\n\n` +
      `🔸 Total: $${formatNumber(total)} + *Domicilio*\n` +
      `📍 Dirección de envío: ${limpiarTextoWhatsApp(direccion)}\n` +
      `📞 Teléfono: ${telefonoLimpio}\n\n` +
      `¿Me puedes *CONFIRMAR*?`;

    const url = `https://wa.me/57${numeroWhatsApp}?text=${encodeURIComponent(
      mensaje
    )}`;

    // 👉 primero intentamos abrir WhatsApp
    openWhatsAppWindow(url);

    // luego limpiamos y cerramos
    if (activeComercioId) {
      localStorage.removeItem(`cart_${activeComercioId}`);
    }
    close();
  };

  const onError = () => {
    if (errors.direccion && errors.telefono) {
      toast.error("La dirección y el teléfono son obligatorios.");
    } else if (errors.direccion) {
      toast.error("La dirección de envío es obligatoria.");
    } else if (errors.telefono) {
      toast.error(
        errors.telefono.type === "pattern"
          ? "El teléfono solo debe contener números."
          : "El teléfono es obligatorio."
      );
    }
  };

  const comercioName = comercio?.nombre_comercial ?? "Tu pedido";
  const comercioAddress = comercio?.direccion;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-sm transform rounded-l-2xl bg-white shadow-2xl ring-1 ring-black/5 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Carrito de compras"
      >
        {/* HEADER */}
        <div className="border-b border-slate-100 px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E76B51]/10 text-[#E76B51]">
                <ShoppingCart className="h-4 w-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <h2 className="text-sm font-semibold text-slate-900 truncate">
                  Carrito · {comercioName}
                </h2>
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <span>{totalQuantity} ítem{totalQuantity !== 1 && "s"}</span>
                  {comercioAddress && (
                    <>
                      <span className="text-slate-300">·</span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-[#E76B51]" />
                        <span className="truncate max-w-[140px]">
                          {comercioAddress}
                        </span>
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={close}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 transition"
              aria-label="Cerrar carrito"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="flex h-[calc(100%-56px)] flex-col">
          {/* Lista de productos */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {items.length === 0 && (
              <div className="mt-10 flex flex-col items-center text-center text-slate-500">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-3">
                  <ShoppingCart className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm font-medium">
                  Tu carrito está vacío
                </p>
                <p className="mt-1 text-xs max-w-[220px]">
                  Agrega productos desde el comercio para verlos aquí.
                </p>
              </div>
            )}

            {items.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-2.5 shadow-sm"
              >
                <div className="h-16 w-16 overflow-hidden rounded-lg bg-slate-100 flex-shrink-0">
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 line-clamp-2">
                    {item.nombre}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    ${item.precio.toLocaleString()}
                  </p>
                  <p className="mt-0.5 text-xs font-semibold text-slate-700">
                    Subtotal: $
                    {(item.precio * item.quantity).toLocaleString()}
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-1">
                      <button
                        type="button"
                        onClick={() => decrease(activeComercioId, item.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-slate-100 transition"
                        aria-label="Disminuir cantidad"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-semibold text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => increase(activeComercioId, item.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-slate-100 transition"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(activeComercioId, item.id)}
                      className="ml-auto inline-flex h-7 w-7 items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition"
                      aria-label="Eliminar producto"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* FORM + RESUMEN (FOOTER) */}
          {/* 👇 Usamos form pero el botón usa handleSubmit manual */}
          <form className="border-t border-slate-100 bg-slate-50/80 px-4 py-4 space-y-4">
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="flex items-center gap-1 text-xs font-semibold text-slate-800">
                  <MapPin className="w-4 h-4 text-[#E76B51]" />
                  Dirección de envío
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: Calle 10 # 4-25, Barrio Centro"
                  className={`w-full rounded-md border px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#E76B51]/70 ${
                    errors.direccion ? "border-red-400" : "border-slate-300"
                  }`}
                  {...register("direccion", {
                    required: true,
                  })}
                />
                {errors.direccion && (
                  <p className="mt-0.5 text-[11px] text-red-500">
                    La dirección es obligatoria.
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="flex items-center gap-1 text-xs font-semibold text-slate-800">
                  <Phone className="w-4 h-4 text-[#E76B51]" />
                  Teléfono de contacto
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="Ej: 3101234567"
                  className={`w-full rounded-md border px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#E76B51]/70 ${
                    errors.telefono ? "border-red-400" : "border-slate-300"
                  }`}
                  {...register("telefono", {
                    required: true,
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Solo se permiten números.",
                    },
                  })}
                />
                {errors.telefono && (
                  <p className="mt-0.5 text-[11px] text-red-500">
                    {errors.telefono.message || "El teléfono es obligatorio."}
                  </p>
                )}
              </div>

              <p className="pt-1 text-[11px] text-slate-500">
                Usaremos estos datos solo para coordinar la entrega de tu pedido.
              </p>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2 shadow-sm border border-slate-200 text-sm">
              <span className="font-medium text-slate-700">Total estimado</span>
              <div className="flex flex-col items-end">
                <span className="text-lg font-semibold text-[#E76B51]">
                  ${totalPrice.toLocaleString()}
                </span>
                <span className="text-[11px] text-slate-500">
                  + costo de domicilio
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={items.length === 0}
                onClick={() => {
                  if (items.length === 0) return;
                  clearComercio(activeComercioId);
                  toast.success("Carrito vaciado.");
                }}
                className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Vaciar carrito
              </button>

              {/* 👉 botón explícito, no type="submit" */}
              <button
                type="button"
                disabled={items.length === 0}
                onClick={handleSubmit(onSubmit, onError)}
                className="flex-1 inline-flex items-center justify-center rounded-md bg-[#E76B51] px-3 py-2 text-xs sm:text-sm font-semibold text-white shadow-md hover:bg-[#d85f46] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Finalizar por WhatsApp
              </button>
            </div>
          </form>
        </div>
      </aside>
    </>
  );
};

export default CartSidebar;
