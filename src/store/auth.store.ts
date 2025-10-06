// src/store/auth.store.ts
import { create } from 'zustand'
import type { LoginSuccess, User } from '../shared/types/users-type'

type Reason = 'expired' | 'logout' | undefined

type AuthState = {
  // 👇 incluye rol en el tipo del user
  user: (User & { modules: string[]; rol: string }) | null
  isLoading: boolean
  error: string | null
  // 👇 motivo para mostrar mensaje en /login (sesión expirada, etc.)
  reason: Reason
}

type AuthActions = {
  /** Setea estado tras login o session (idempotente) */
  setFromResponse: (data: LoginSuccess) => void
  /** Limpia usuario (ej. tras logout o error de sesión) */
  clear: () => void
  /** Helpers de autorización */
  hasRole: (role: string) => boolean
  hasModule: (module: string) => boolean
  /** Setea motivo para UI (toast/banner) */
  setReason: (r: Reason) => void
}

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  reason: undefined,

  setReason: (r) => set({ reason: r }),

  setFromResponse: (data) => {
    const modules = data.modules ?? []
    const nextUser = { ...data.user, rol: data.rol, modules }

    // ✅ idempotente: si es el mismo user/rol/módulos, no cambia el estado
    set((state) => {
      const curr = state.user
      const sameId = curr?.id && nextUser?.id && curr.id === nextUser.id
      const sameRol = curr?.rol === nextUser.rol
      const sameModules =
        Array.isArray(curr?.modules) &&
        curr!.modules.length === nextUser.modules.length &&
        [...curr!.modules].sort().join('|') === [...nextUser.modules].sort().join('|')

      if (sameId && sameRol && sameModules) return state

      return {
        user: nextUser,
        error: null,
        // reason se mantiene tal cual; no lo tocamos aquí
      }
    })
  },

  // Nota: no borramos `reason` aquí para poder mostrar el mensaje en /login.
  // Si quieres limpiarlo, hazlo después de mostrar el toast/banner.
  clear: () => set({ user: null, error: null }),

  hasRole: (role) => get().user?.rol === role,

  hasModule: (module) => !!get().user?.modules?.includes(module),
}))
