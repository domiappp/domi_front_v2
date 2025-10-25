// src/services/useProducts.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../config/axios";
import type { AxiosError } from "axios";
import type {
  Product,
  ProductsResponse,
  CreateProductPayload,
  UpdateProductPayload,
  ProductsParams,
  ListByComercioCategoriaParams,
} from "../shared/types/products-type";

// ✅ Hook: listar productos (con filtros, paginación y orden)
export const useProducts = (params: ProductsParams) => {
  return useQuery<ProductsResponse>({
    queryKey: ["products", params],
    queryFn: async () => {
      try {
        const { data } = await api.get<ProductsResponse>("/productos/listar", { params });
        return data;
      } catch (error) {
        const axiosError = error as AxiosError<any>;
        throw new Error(axiosError.response?.data?.message || "Error al cargar productos");
      }
    },
  });
};

// ✅ Hook: obtener un producto por ID
export const useProductById = (id?: number) => {
  return useQuery<Product>({
    queryKey: ["product", id],
    enabled: !!id,
    queryFn: async () => {
      try {
        const { data } = await api.get<Product>(`/productos/buscar/${id}`);
        return data;
      } catch (error) {
        const axiosError = error as AxiosError<any>;
        throw new Error(axiosError.response?.data?.message || "Error al cargar el producto");
      }
    },
  });
};

// ✅ Hook: crear producto (soporta imagen)
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateProductPayload) => {
      try {
        const formData = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          if (value !== undefined && value !== null) formData.append(key, value as any);
        });

        const { data } = await api.post<Product>("/productos/crear", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        return data;
      } catch (error) {
        const axiosError = error as AxiosError<any>;
        throw new Error(axiosError.response?.data?.message || "Error al crear producto");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

// ✅ Hook: actualizar producto
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateProductPayload }) => {
      try {
        const formData = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          if (value !== undefined && value !== null) formData.append(key, value as any);
        });

        const { data } = await api.patch<Product>(`/productos/actualizar/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        return data;
      } catch (error) {
        const axiosError = error as AxiosError<any>;
        throw new Error(axiosError.response?.data?.message || "Error al actualizar producto");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

// ✅ Hook: eliminar producto (borrado lógico)
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      try {
        const { data } = await api.delete(`/productos/eliminar/${id}`);
        return data;
      } catch (error) {
        const axiosError = error as AxiosError<any>;
        throw new Error(axiosError.response?.data?.message || "Error al eliminar producto");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

// ✅ Hook: listar productos por comercio/categoría (catálogo público)
export const useProductsByComercioCategoria = (params: ListByComercioCategoriaParams) => {
  return useQuery<ProductsResponse>({
    queryKey: ["products-by-comercio-categoria", params],
    queryFn: async () => {
      try {
        const { data } = await api.get<ProductsResponse>(
          "/productos/listar-por-comercio-categoria",
          { params }
        );
        return data;
      } catch (error) {
        const axiosError = error as AxiosError<any>;
        throw new Error(
          axiosError.response?.data?.message || "Error al listar productos por comercio/categoría"
        );
      }
    },
  });
};
