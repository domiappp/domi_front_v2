import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "../config/axios"
import type { AxiosError } from "axios"
import type { CreateUserPayload, UserList } from "../shared/types/users-type"

export type UsersResponse = {
  meta: { page: number; limit: number; total: number; totalPages: number };
  items: UserList[];
};

export type UsersParams = {
  page?: number;            // 1-based (tu API)
  limit?: number;
  search?: string;
  rol?: string;             // o Role si lo importas
  estado?: 'activo' | 'inactivo';
  sortBy?: 'id' | 'name' | 'email' | 'rol' | 'estado' | 'createdAt';
  sortOrder?: 'ASC' | 'DESC';
};

export const useUsers = (params: UsersParams) => {
  return useQuery<UsersResponse>({
    queryKey: ['users', params],
    queryFn: async () => {
      try {
        const { data } = await api.get<UsersResponse>('/users', { params });
        return data;
      } catch (error) {
        const axiosError = error as AxiosError<any>;
        throw new Error(axiosError.response?.data?.message || 'Error al cargar usuarios');
      }
    },
  });
};

export const useCreateUsuario = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (usuario: CreateUserPayload) => {
      try {
        const { data } = await api.post<UserList>('/users', usuario)
        return data
      } catch (error) {
        const axiosError = error as AxiosError<any>
        throw new Error(
          axiosError.response?.data?.message || 'Error al crear usuario'
        )
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })
}

// ✅ Hook para actualizar usuario
export const useUpdateUsuario = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: Partial<CreateUserPayload> }) => {
      try {
        const { data } = await api.patch<UserList>(`/users/${id}`, payload)
        return data
      } catch (error) {
        const axiosError = error as AxiosError<any>
        throw new Error(
          axiosError.response?.data?.message || 'Error al actualizar usuario'
        )
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })
}

// ✅ Hook para hacer toggle de estado (activo / inactivo)
export const useToggleUsuarioEstado = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, estado }: { id: number; estado: 'activo' | 'inactivo' }) => {
      try {
        const { data } = await api.patch<UserList>(`/users/${id}/estado`, { estado })
        return data
      } catch (error) {
        const axiosError = error as AxiosError<any>
        throw new Error(
          axiosError.response?.data?.message || 'Error al cambiar estado del usuario'
        )
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })
}
