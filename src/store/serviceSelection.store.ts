// src/store/serviceSelection.store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type ServiceSelectionState = {
  selectedServiceId: number | null;
  selectedServiceName: string | null;
  setSelection: (id: number | null, name: string | null) => void;
  clearSelection: () => void;
};

export const useServiceSelectionStore = create<ServiceSelectionState>()(
  persist(
    (set) => ({
      selectedServiceId: null,
      selectedServiceName: null,
      setSelection: (id, name) =>
        set({
          selectedServiceId: id,
          selectedServiceName: name,
        }),
      clearSelection: () =>
        set({
          selectedServiceId: null,
          selectedServiceName: null,
        }),
    }),
    {
      name: "service-selection", // 🔑 clave en localStorage
    }
  )
);
