// src/hooks/useServicios.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../config/axios'
import type { Servicio, UseServiciosOpts } from '../shared/types/servicesTypes'

// === Keys de cache ===
const keys = {
  list: ['servicios'] as const,
  detail: (id: number | string) => ['servicio', Number(id)] as const,
}

// === LISTAR ===
export const useServicios = (opts?: UseServiciosOpts) => {
  const enabled = opts?.enabled ?? true

  return useQuery<Servicio[], Error>({
    queryKey: keys.list,
    queryFn: async (): Promise<Servicio[]> => {
      const { data } = await api.get<Servicio[]>('/servicios/listar', { withCredentials: true })
      return data
    },
    enabled,
    retry: false,
    staleTime: opts?.staleTime ?? 60_000,
  })
}

// === DETALLE ===
type UseServicioOpts = { enabled?: boolean; staleTime?: number }

export const useServicio = (id: number | undefined, opts?: UseServicioOpts) => {
  const enabled = (opts?.enabled ?? true) && typeof id === 'number'

  return useQuery<Servicio, Error>({
    queryKey: keys.detail(id ?? -1),
    queryFn: async () => {
      const { data } = await api.get<Servicio>(`/servicios/buscar/${id}`, { withCredentials: true })
      return data
    },
    enabled,
    retry: false,
    staleTime: opts?.staleTime ?? 60_000,
  })
}

// === CREAR (FormData) ===
export const useCrearServicio = () => {
  const qc = useQueryClient()

  return useMutation<Servicio, Error, FormData>({
    mutationFn: async (formData) => {
      const { data } = await api.post<Servicio>('/servicios/crear', formData, {
        withCredentials: true,
        // ¡NO pongas Content-Type! Axios lo calcula por ti.
      })
      return data
    },
    onSuccess: (created) => {
      qc.setQueryData<Servicio[]>(keys.list, (prev) => (prev ? [created, ...prev] : [created]))
      qc.setQueryData<Servicio>(keys.detail(created.id), created)
    },
  })
}

// === ACTUALIZAR (FormData) ===
export const useActualizarServicio = () => {
  const qc = useQueryClient()

  return useMutation<
    Servicio,
    Error,
    { id: number; data: FormData }
  >({
    mutationFn: async ({ id, data }) => {
      const res = await api.patch<Servicio>(`/servicios/actualizar/${id}`, data, {
        withCredentials: true,
      })
      return res.data
    },
    onSuccess: (updated) => {
      // refresca cache
      qc.setQueryData<Servicio>(keys.detail(updated.id), updated)
      qc.invalidateQueries({ queryKey: keys.list })
      qc.invalidateQueries({ queryKey: keys.detail(updated.id) })
    },
  })
}
