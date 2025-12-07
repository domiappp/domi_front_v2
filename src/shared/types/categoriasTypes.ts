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


// Datos públicos del comercio
export interface CommercePublic {
  id: number;
  nombre_comercial: string;
  descripcion?: string | null;
  logo_url?: string | null;
  direccion: string;
  telefono: string;
  estado_comercio: number; // 1 = abierto, 0 = cerrado (o como lo manejes)
  estado_servicio?: number
}

// Categoría pública
export interface CategoriaPublic {
  id: number;
  nombre: string;
}

// Respuesta del endpoint /comercios/:id/categorias
export interface ComercioCategoriasResponse {
  comercio: CommercePublic;
  categorias: CategoriaPublic[];
}
