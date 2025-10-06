// =========================
// Tipos (ajústalos a tu modelo real)
// =========================
export interface Commerce {
id: number
nombre_comercial?: string
razon_social?: string
nit?: string
descripcion?: string
responsable?: string
email_contacto?: string
telefono?: string
telefono_secundario?: string
direccion?: string
servicio?: number | string
estado?: string
logo_url?: string | null
created_at?: string
updated_at?: string
// ...cualquier otro campo de tu entidad
}


export type SortOrder = 'ASC' | 'DESC'


export interface ListComerciosParams {
page?: number
limit?: number
search?: string
servicioId?: number
estado?: string
sortBy?: string
sortOrder?: SortOrder
}


export interface PagedResponse<T> {
meta: {
page: number
limit: number
total: number
totalPages: number
}
items: T[]
}