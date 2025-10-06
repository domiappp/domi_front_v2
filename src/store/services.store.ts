// src/store/services.store.ts
import { create } from 'zustand';

type ServicesUIState = {
  selectedServiceId: number | null;
  selectedServiceName: string | null;
  setSelectedService: (id: number, name?: string | null) => void;

  search: string;
  setSearch: (q: string) => void;

  // Opcional: guardar/restaurar scroll por servicio
  scrollByService: Record<number, number>;
  saveScrollForService: (serviceId: number, y: number) => void;
  getScrollForService: (serviceId: number) => number;

  reset: () => void;
};

export const useServicesUI = create<ServicesUIState>((set, get) => ({
  selectedServiceId: null,
  selectedServiceName: null,
  setSelectedService: (id, name = null) =>
    set({ selectedServiceId: id, selectedServiceName: name }),

  search: '',
  setSearch: (q) => set({ search: q }),

  scrollByService: {},
  saveScrollForService: (serviceId, y) =>
    set((s) => ({ scrollByService: { ...s.scrollByService, [serviceId]: y } })),
  getScrollForService: (serviceId) => get().scrollByService[serviceId] ?? 0,

  reset: () => set({
    selectedServiceId: null,
    selectedServiceName: null,
    search: '',
    scrollByService: {},
  }),
}));
