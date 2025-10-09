// src/store/services.store.ts
import { create } from 'zustand';

export type FormType = 'pedido' | 'recogida' | 'pago' | 'envio' | null;
export type UIView = 'api' | 'form';

type ServicesUIState = {
  // Selección de servicio (API)
  selectedServiceId: number | null;
  selectedServiceName: string | null;
  setSelectedService: (id: number, name?: string | null) => void;

  // Búsqueda
  search: string;
  setSearch: (q: string) => void;

  // Scroll por servicio
  scrollByService: Record<number, number>;
  saveScrollForService: (serviceId: number, y: number) => void;
  getScrollForService: (serviceId: number) => number;

  // Nuevo: modo de vista y tipo de formulario
  uiView: UIView;        // 'api' | 'form'
  formType: FormType;    // 'pedido' | 'recogida' | 'pago' | 'envio' | null
  showForm: (form: Exclude<FormType, null>) => void;
  showApi: () => void;

  reset: () => void;
};

export const useServicesUI = create<ServicesUIState>((set, get) => ({
  selectedServiceId: null,
  selectedServiceName: null,
  setSelectedService: (id, name = null) =>
    set({ selectedServiceId: id, selectedServiceName: name, uiView: 'api', formType: null }),

  search: '',
  setSearch: (q) => set({ search: q }),

  scrollByService: {},
  saveScrollForService: (serviceId, y) =>
    set((s) => ({ scrollByService: { ...s.scrollByService, [serviceId]: y } })),
  getScrollForService: (serviceId) => get().scrollByService[serviceId] ?? 0,

  // Nuevos
  uiView: 'api',
  formType: null,
  showForm: (form) => set({ uiView: 'form', formType: form }),
  showApi: () => set({ uiView: 'api', formType: null }),

  reset: () =>
    set({
      selectedServiceId: null,
      selectedServiceName: null,
      search: '',
      scrollByService: {},
      uiView: 'api',
      formType: null,
    }),
}));
