// src/hooks/usePublicidad.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "../config/axios"
import type { AxiosError } from "axios"
import type { Publicidad } from "../shared/types/publicidadTypes"

// ---------- Listar todas ----------
export const usePublicidad = () => {
  return useQuery<Publicidad[]>({
    queryKey: ['publicidad'],
    queryFn: async () => {
      try {
        const { data } = await api.get<Publicidad[]>('/publicidad')
        return data
      } catch (error) {
        const axiosError = error as AxiosError<any>
        throw new Error(axiosError.response?.data?.message || 'Error al cargar publicidades')
      }
    }
  })
}

// ---------- Listar vigentes para slider (opcional) ----------
export const usePublicidadSlider = () => {
  return useQuery<Publicidad[]>({
    queryKey: ['publicidad','slider'],
    queryFn: async () => {
      try {
        const { data } = await api.get<Publicidad[]>('/publicidad/vigentes/slider')
        return data
      } catch (error) {
        const axiosError = error as AxiosError<any>
        throw new Error(axiosError.response?.data?.message || 'Error al cargar slider')
      }
    }
  })
}

// ---------- Crear (recibe FormData ya armado) ----------
export const useCreatePublicidad = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (formData: FormData) => {
      try {
        const { data } = await api.post<Publicidad>('/publicidad', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        return data
      } catch (error) {
        const axiosError = error as AxiosError<any>
        throw new Error(axiosError.response?.data?.message || 'Error al crear publicidad')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicidad'] })
      queryClient.invalidateQueries({ queryKey: ['publicidad','slider'] })
    }
  })
}

// ---------- Actualizar (recibe id y FormData ya armado) ----------
export const useUpdatePublicidad = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: { id: number | string, formData: FormData }) => {
      const { id, formData } = payload
      try {
        const { data } = await api.patch<Publicidad>(`/publicidad/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        return data
      } catch (error) {
        const axiosError = error as AxiosError<any>
        throw new Error(axiosError.response?.data?.message || 'Error al actualizar publicidad')
      }
    },
    onSuccess: (_data, variables) => {
      // refrescar listado y el detalle editado, si lo usas con key por id
      queryClient.invalidateQueries({ queryKey: ['publicidad'] })
      queryClient.invalidateQueries({ queryKey: ['publicidad','slider'] })
      queryClient.invalidateQueries({ queryKey: ['publicidad', Number(variables.id)] })
    }
  })
}

// ---------- Eliminar ----------
export const useDeletePublicidad = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number | string) => {
      try {
        const { data } = await api.delete<{ ok: boolean }>(`/publicidad/${id}`)
        return data
      } catch (error) {
        const axiosError = error as AxiosError<any>
        throw new Error(axiosError.response?.data?.message || 'Error al eliminar publicidad')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicidad'] })
      queryClient.invalidateQueries({ queryKey: ['publicidad','slider'] })
    }
  })
}
