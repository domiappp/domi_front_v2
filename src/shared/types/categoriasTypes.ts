// src/shared/types/categorias-type.ts
export interface Categoria {
  id: number;
  nombre: string;
  created_at: string;
  updated_at: string;
  comercioId: number;
}

export interface CategoriasResponse {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  items: Categoria[];
}

export interface CreateCategoriaPayload {
  nombre: string;
  comercioId: number;
}

export interface UpdateCategoriaPayload {
  nombre?: string;
  comercioId?: number;
}

export interface CategoriasParams {
  page?: number;
  limit?: number;
  search?: string;
  comercioId?: number;
  sortBy?: 'id' | 'nombre';
  sortOrder?: 'ASC' | 'DESC';
}
