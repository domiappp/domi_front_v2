// === Tipos locales (puedes importarlos de tus DTOs si ya existen) ===
export type Servicio = {
  id: number
  nombre: string
  estado: string        // 'activo' | 'inactivo' si luego lo tipas
  icon?: string | null
  color?: string | null
  orden?: number | null
  foto?: string | null
  created_at: string | Date
  updated_at: string | Date
}

export type CreateServicioDto = {
  nombre: string
  estado?: string
  icon?: string | null
  color?: string | null
  orden?: number | null
  foto?: string | null
}

export type UpdateServicioDto = Partial<CreateServicioDto>

export type UseServiciosOpts = { enabled?: boolean; staleTime?: number }
