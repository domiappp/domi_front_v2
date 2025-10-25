// src/shared/types/products-type.ts

export interface Product {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  estado: 'activo' | 'inactivo';
  imagen_url?: string;
  created_at: string;
  updated_at: string;

  // Relaciones
  comercio: {
    id: number;
    nombre: string;
  };
  categoria: {
    id: number;
    nombre: string;
  };
}

export interface ProductsResponse {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  items: Product[];
}

export interface CreateProductPayload {
  nombre: string;
  descripcion?: string;
  precio: number;
  estado?: 'activo' | 'inactivo';
  comercioId: number;
  categoriaId: number;
  imagen?: File | null;
}

export interface UpdateProductPayload {
  nombre?: string;
  descripcion?: string;
  precio?: number;
  estado?: 'activo' | 'inactivo';
  comercioId?: number;
  categoriaId?: number;
  imagen?: File | null;
}

export interface ProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  comercioId?: number;
  categoriaId?: number;
  estado?: 'activo' | 'inactivo';
  priceFrom?: number;
  priceTo?: number;
  createdFrom?: string;
  createdTo?: string;
  sortBy?: 'id' | 'nombre' | 'precio' | 'estado' | 'created_at' | 'updated_at';
  sortOrder?: 'ASC' | 'DESC';
}

export interface ListByComercioCategoriaParams {
  comercioId: number;
  categoriaId?: number;
  page?: number;
  search?: string;
}
