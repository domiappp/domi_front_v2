import { create } from 'zustand'

type SidebarPosition = 'left' | 'right'

type SidebarState = {
  isOpen: boolean
  position: SidebarPosition
  toggle: () => void
  open: () => void
  close: () => void
  setPosition: (pos: SidebarPosition) => void
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: false,
  position: 'left', // cámbialo a 'right' cuando quieras
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  setPosition: (pos) => set({ position: pos }),
}))
