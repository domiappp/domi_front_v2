import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "../config/axios"
import type { AxiosError } from "axios"
import type {
  CategoriasResponse,
  Categoria,
  CreateCategoriaPayload,
  UpdateCategoriaPayload,
  CategoriasParams,
} from "../shared/types/categoriasTypes"


// ✅ Hook: listar categorías
export const useCategorias = (params: CategoriasParams) => {
  return useQuery<CategoriasResponse>({
    queryKey: ['categorias', params],
    queryFn: async () => {
      try {
        const { data } = await api.get<CategoriasResponse>('/categorias/listar', { params })
        return data
      } catch (error) {
        const axiosError = error as AxiosError<any>
        throw new Error(axiosError.response?.data?.message || 'Error al cargar categorías')
      }
    },
  })
}

// ✅ Hook: obtener una categoría por ID
export const useCategoriaById = (id?: number) => {
  return useQuery<Categoria>({
    queryKey: ['categoria', id],
    enabled: !!id,
    queryFn: async () => {
      try {
        const { data } = await api.get<Categoria>(`/categorias/buscar/${id}`)
        return data
      } catch (error) {
        const axiosError = error as AxiosError<any>
        throw new Error(axiosError.response?.data?.message || 'Error al cargar la categoría')
      }
    },
  })
}

// ✅ Hook: crear categoría
export const useCreateCategoria = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (categoria: CreateCategoriaPayload) => {
      try {
        const { data } = await api.post<Categoria>('/categorias/crear', categoria)
        return data
      } catch (error) {
        const axiosError = error as AxiosError<any>
        throw new Error(axiosError.response?.data?.message || 'Error al crear categoría')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
    },
  })
}

// ✅ Hook: actualizar categoría
export const useUpdateCategoria = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateCategoriaPayload }) => {
      try {
        const { data } = await api.patch<Categoria>(`/categorias/actualizar/${id}`, payload)
        return data
      } catch (error) {
        const axiosError = error as AxiosError<any>
        throw new Error(axiosError.response?.data?.message || 'Error al actualizar categoría')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
    },
  })
}

// ✅ Hook: eliminar categoría
export const useDeleteCategoria = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      try {
        const { data } = await api.delete(`/categorias/eliminar/${id}`)
        return data
      } catch (error) {
        const axiosError = error as AxiosError<any>
        throw new Error(axiosError.response?.data?.message || 'Error al eliminar categoría')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
    },
  })
}
