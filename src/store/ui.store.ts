// src/store/ui.store.ts
import { create } from "zustand";

type UiState = {
  isRestoringScroll: boolean;
  setIsRestoringScroll: (v: boolean) => void;
};

export const useUiStore = create<UiState>((set) => ({
  isRestoringScroll: false,
  setIsRestoringScroll: (v) => set({ isRestoringScroll: v }),
}));
