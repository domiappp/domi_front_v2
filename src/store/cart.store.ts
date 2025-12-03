import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartProduct = {
  id: string;
  nombre: string;
  precio: number;
  imagen: string;
};

export type CartItem = CartProduct & {
  quantity: number;
};

type CartState = {
  // comercio actual (para saber qué carrito mostrar en el sidebar)
  activeComercioId: number | null;

  // carritos: comercioId -> productId -> CartItem
  carts: Record<number, Record<string, CartItem>>;

  // sidebar abierto / cerrado
  isOpen: boolean;

  // acciones
  setActiveComercio: (comercioId: number) => void;

  open: () => void;
  close: () => void;
  toggle: () => void;

  addItem: (comercioId: number, product: CartProduct, quantity?: number) => void;
  removeItem: (comercioId: number, productId: string) => void;
  increase: (comercioId: number, productId: string) => void;
  decrease: (comercioId: number, productId: string) => void;
  clearComercio: (comercioId: number) => void;

  // helpers para contadores
  getUniqueCount: (comercioId: number | null) => number;    // productos distintos
  getTotalQuantity: (comercioId: number | null) => number;  // suma de quantity
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      activeComercioId: null,
      carts: {},
      isOpen: false,

      setActiveComercio: (comercioId) =>
        set({ activeComercioId: comercioId }),

      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),

      addItem: (comercioId, product, quantity = 1) => {
        set((state) => {
          const prevCart = state.carts[comercioId] ?? {};
          const prevItem = prevCart[product.id];

          const newQuantity = (prevItem?.quantity ?? 0) + quantity;

          return {
            carts: {
              ...state.carts,
              [comercioId]: {
                ...prevCart,
                [product.id]: {
                  ...product,
                  quantity: newQuantity,
                },
              },
            },
          };
        });
      },

      removeItem: (comercioId, productId) => {
        set((state) => {
          const prevCart = state.carts[comercioId];
          if (!prevCart) return state;

          const { [productId]: _removed, ...rest } = prevCart;

          return {
            carts: {
              ...state.carts,
              [comercioId]: rest,
            },
          };
        });
      },

      increase: (comercioId, productId) => {
        set((state) => {
          const prevCart = state.carts[comercioId];
          if (!prevCart || !prevCart[productId]) return state;

          const item = prevCart[productId];

          return {
            carts: {
              ...state.carts,
              [comercioId]: {
                ...prevCart,
                [productId]: {
                  ...item,
                  quantity: item.quantity + 1,
                },
              },
            },
          };
        });
      },

      decrease: (comercioId, productId) => {
        set((state) => {
          const prevCart = state.carts[comercioId];
          if (!prevCart || !prevCart[productId]) return state;

          const item = prevCart[productId];
          const newQty = item.quantity - 1;

          if (newQty <= 0) {
            const { [productId]: _removed, ...rest } = prevCart;
            return {
              carts: {
                ...state.carts,
                [comercioId]: rest,
              },
            };
          }

          return {
            carts: {
              ...state.carts,
              [comercioId]: {
                ...prevCart,
                [productId]: {
                  ...item,
                  quantity: newQty,
                },
              },
            },
          };
        });
      },

      clearComercio: (comercioId) => {
        set((state) => {
          const { [comercioId]: _removed, ...rest } = state.carts;
          return { carts: rest };
        });
      },

      // 🔢 productos distintos por comercio
      getUniqueCount: (comercioId) => {
        if (!comercioId) return 0;
        const carts = get().carts;
        const cart = carts[comercioId] ?? {};
        return Object.keys(cart).length;
      },

      // 🔢 suma de quantity por comercio (por si la quieres usar)
      getTotalQuantity: (comercioId) => {
        if (!comercioId) return 0;
        const carts = get().carts;
        const cart = carts[comercioId] ?? {};
        return Object.values(cart).reduce(
          (acc, item) => acc + item.quantity,
          0
        );
      },
    }),
    {
      name: "cart-store", // localStorage key
    }
  )
);
