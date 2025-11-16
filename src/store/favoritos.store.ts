// src/store/favoritos.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type FavoritosState = {
  // servicioId -> [ids de comercios]
  favoritosPorServicio: Record<string, string[]>;

  isFavorito: (serviceId?: number | string, comercioId?: string) => boolean;
  toggleFavorito: (serviceId?: number | string, comercioId?: string) => void;
  clearFavoritos: (serviceId?: number | string) => void;
};

export const useFavoritosStore = create<FavoritosState>()(
  persist(
    (set, get) => ({
      favoritosPorServicio: {},

      isFavorito: (serviceId, comercioId) => {
        if (!serviceId || !comercioId) return false;
        const key = String(serviceId);
        const list = get().favoritosPorServicio[key] ?? [];
        return list.includes(comercioId);
      },

      toggleFavorito: (serviceId, comercioId) => {
        if (!serviceId || !comercioId) return;

        const key = String(serviceId);

        set((state) => {
          const current = state.favoritosPorServicio[key] ?? [];
          const exists = current.includes(comercioId);

          const nextList = exists
            ? current.filter((id) => id !== comercioId) // quitar
            : [...current, comercioId];                // agregar

          return {
            favoritosPorServicio: {
              ...state.favoritosPorServicio,
              [key]: nextList,
            },
          };
        });
      },

      // Si pasas serviceId, limpia solo ese servicio; si no, limpia todo
      clearFavoritos: (serviceId) => {
        if (!serviceId) {
          set({ favoritosPorServicio: {} });
          return;
        }
        const key = String(serviceId);
        set((state) => {
          const copy = { ...state.favoritosPorServicio };
          delete copy[key];
          return { favoritosPorServicio: copy };
        });
      },
    }),
    {
      name: 'favoritos-comercios-por-servicio',
    },
  ),
);
