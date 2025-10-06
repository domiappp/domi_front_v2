// src/hooks/useLogin.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../config/axios'
import type { LoginPayload, LoginResponse, LoginSuccess } from '../shared/types/users-type'
import { isLoginSuccess } from '../shared/types/guards'



export function useLogin() {
  return useMutation<LoginSuccess, Error, LoginPayload>({
    mutationFn: async (payload) => {
      const body = { ...payload, email: payload.email.trim().toLowerCase() }
      const { data } = await api.post<LoginResponse>('/auth/login', body, { withCredentials: true })

      if (!data.ok) {
        throw new Error((data as any).message ?? 'Credenciales inválidas')
      }
      return data // <- aquí ya es LoginSuccess
    },
  })
}


type UseSessionOpts = {
  enabled?: boolean; // por defecto true
};

export function useSession(opts?: UseSessionOpts) {
  const enabled = opts?.enabled ?? true;

  return useQuery<LoginSuccess, Error>({
    queryKey: ['session'],
    queryFn: async (): Promise<LoginSuccess> => {
      const { data } = await api.get<LoginResponse>('/auth/session', { withCredentials: true })
      if (!isLoginSuccess(data)) {
        throw new Error((data as any)?.message ?? 'No autenticado')
      }
      return data
    },
    retry: false,
    enabled, // ← ahora sí aceptamos el flag
    // (opcional) cachea un rato para no spamear:
    staleTime: 60_000,
  })
}


export function useLogout() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await api.post('/auth/logout', undefined, { withCredentials: true })
    },
    onSuccess: () => {
      qc.removeQueries({ queryKey: ['session'], exact: true })
    },
  })
}
