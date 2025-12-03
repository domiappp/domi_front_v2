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

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={close} />
      )}

      <aside
        className={`fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-[#E76B51]" />
            <h2 className="font-semibold text-lg">Carrito</h2>
            <span className="text-xs text-gray-500">
              ({totalQuantity} ítems)
            </span>
          </div>

          <button
            type="button"
            onClick={close}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col h-[calc(100%-56px)]">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 && (
              <p className="text-sm text-gray-500 text-center mt-8">
                No tienes productos en este comercio.
              </p>
            )}

            {items.map((item: any) => (
              <div
                key={item.id}
                className="flex gap-3 border rounded-lg p-2 items-center"
              >
                <div className="w-16 h-16 rounded-md bg-gray-100 overflow-hidden">
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-2">
                    {item.nombre}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    ${item.precio.toLocaleString()}
                  </p>
                  <p className="text-xs font-semibold mt-0.5">
                    Subtotal: $
                    {(item.precio * item.quantity).toLocaleString()}
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => decrease(activeComercioId, item.id)}
                      className="p-1 rounded-full border hover:bg-gray-100"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-semibold w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => increase(activeComercioId, item.id)}
                      className="p-1 rounded-full border hover:bg-gray-100"
                    >
                      <Plus className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => removeItem(activeComercioId, item.id)}
                      className="ml-auto p-1 rounded-full hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 👇 Usamos form pero el botón usa handleSubmit manual */}
          <form className="border-t p-4 space-y-4 bg-gray-50/70">
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-[#E76B51]" />
                  Dirección de envío
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: Calle 10 # 4-25, Barrio Centro"
                  className={`w-full rounded-md border px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#E76B51]/70 ${
                    errors.direccion ? "border-red-400" : "border-gray-300"
                  }`}
                  {...register("direccion", {
                    required: true,
                  })}
                />
                {errors.direccion && (
                  <p className="text-[11px] text-red-500 mt-0.5">
                    La dirección es obligatoria.
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                  <Phone className="w-4 h-4 text-[#E76B51]" />
                  Teléfono de contacto
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="Ej: 3101234567"
                  className={`w-full rounded-md border px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#E76B51]/70 ${
                    errors.telefono ? "border-red-400" : "border-gray-300"
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
                  <p className="text-[11px] text-red-500 mt-0.5">
                    {errors.telefono.message || "El teléfono es obligatorio."}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Total:</span>
              <span className="font-semibold text-lg text-[#E76B51]">
                ${totalPrice.toLocaleString()}
              </span>
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
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                Vaciar carrito
              </button>

              {/* 👉 botón explícito, no type="submit" */}
              <button
                type="button"
                disabled={items.length === 0}
                onClick={handleSubmit(onSubmit, onError)}
                className="flex-1 bg-[#E76B51] text-white rounded-md px-3 py-2 text-sm font-semibold hover:bg-[#d85f46] disabled:opacity-50 shadow-md"
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
