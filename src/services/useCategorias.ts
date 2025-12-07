import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "../config/axios"
import type { AxiosError } from "axios"
import type {
  CategoriasResponse,
  Categoria,
  CreateCategoriaPayload,
  UpdateCategoriaPayload,
  CategoriasParams,
  ComercioCategoriasResponse,
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

export const useCreateCategoria = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (categoria: CreateCategoriaPayload) => {
      const { data } = await api.post<Categoria>('/categorias/crear', categoria)
      return data
    },
    onSuccess: () => {
      // 🔁 Todas las listas paginadas de categorías
      queryClient.invalidateQueries({ queryKey: ['categorias'], exact: false })

      // 🔁 Todas las listas de categorías por comercio
      queryClient.invalidateQueries({ queryKey: ['categorias-comercio'], exact: false })
    },
  })
}

export const useUpdateCategoria = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateCategoriaPayload }) => {
      const { data } = await api.patch<Categoria>(`/categorias/actualizar/${id}`, payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'], exact: false })
      queryClient.invalidateQueries({ queryKey: ['categorias-comercio'], exact: false })
    },
  })
}

export const useDeleteCategoria = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(`/categorias/eliminar/${id}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'], exact: false })
      queryClient.invalidateQueries({ queryKey: ['categorias-comercio'], exact: false })
    },
  })
}

// ✅ Hook: obtener categorías por ID de comercio (sin paginación)
export const useCategoriaByComercio = (comercioId?: number) => {
  return useQuery<Categoria[]>({
    queryKey: ['categorias-comercio', comercioId],
    enabled: !!comercioId,
    queryFn: async () => {
      try {
        const { data } = await api.get<Categoria[]>(
          `/categorias/comercio/${comercioId}`,
        );
        return data;
      } catch (error) {
        const axiosError = error as AxiosError<any>;
        throw new Error(
          axiosError.response?.data?.message ||
            'Error al cargar las categorías del comercio',
        );
      }
    },
  });
};
