// src/lib/axios.ts
import axios from 'axios'
// 👇 importa tu store de Zustand (ajusta la ruta si difiere)
import { useAuthStore } from '../store/auth.store'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ej: "http://localhost:3000"
  withCredentials: true,                 // necesario para cookies HttpOnly
  headers: { 'Content-Type': 'application/json' },
})

// --- Interceptor global de request ---
// Si el body es FormData, quitamos Content-Type para que axios lo calcule
api.interceptors.request.use((config) => {
  const isFormData =
    typeof FormData !== 'undefined' && config.data instanceof FormData

  if (isFormData) {
    if (config.headers) {
      delete (config.headers as any)['Content-Type']
      delete (config.headers as any)['content-type']
    }
    // evita que axios transforme el FormData
    config.transformRequest = [(data) => data]
  }

  return config
})

// --- Interceptor global de respuestas ---
let handledAuthError = false
const AUTH_ENDPOINT_REGEX = /\/auth\/(session|login|logout|refresh)/i

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status
    const url: string = error?.config?.url ?? ''

    const isAuthEndpoint = AUTH_ENDPOINT_REGEX.test(url)

    if ((status === 401 || status === 419 || status === 440) && !isAuthEndpoint) {
      if (!handledAuthError) {
        handledAuthError = true

        const { clear, setReason } = useAuthStore.getState()
        clear()
        setReason('expired')

        try {
          const current =
            window.location.pathname +
            window.location.search +
            window.location.hash
          sessionStorage.setItem('postLoginRedirect', current)
        } catch {}

        // Redirige a /login si quieres (comentado por ahora)
        // if (window.location.pathname !== '/login') {
        //   window.location.replace('/login')
        // }
        // setTimeout(() => { handledAuthError = false }, 1500)
      }
    }

    return Promise.reject(error)
  }
)
