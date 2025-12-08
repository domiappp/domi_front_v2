import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../config/axios'

// ==============================
// Tipos
// ==============================
export interface ImagenComercio {
  id: number
  url: string
  mensaje?: string | null
  orden: number
  activo: number
  created_at: string
  updated_at: string
}

export interface PagedResponse<T> {
  meta: { page: number; limit: number; total: number; totalPages: number }
  items: T[]
}

export type SortOrder = 'ASC' | 'DESC'

export interface ListImagenesParams {
  page?: number
  limit?: number
  search?: string
  activo?: boolean
  sortBy?: 'id' | 'orden' | 'creado_en' | 'actualizado_en'
  sortOrder?: SortOrder
}

// ==============================
// Helpers de validación
// ==============================
function ensureValidId(label: string, value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${label} inválido`)
  }
}

// ==============================
// Cache keys
// ==============================
export const imagenKeys = {
  all: ['imagenes'] as const,
  list: (comercioId: number, params: Partial<ListImagenesParams> = {}) =>
    [...imagenKeys.all, 'list', comercioId, normalizeListParams(params)] as const,
  detail: (comercioId: number, id: number) =>
    [...imagenKeys.all, 'detail', comercioId, id] as const,

  // 👉 NUEVO
  allByComercio: (comercioId: number) =>
    [...imagenKeys.all, 'allByComercio', comercioId] as const,
}

function normalizeListParams(p: Partial<ListImagenesParams>) {
  return {
    page: p.page ?? 1,
    limit: p.limit ?? 10,
    search: p.search ?? '',
    activo: p.activo,
    sortBy: p.sortBy ?? 'orden',
    sortOrder: (p.sortOrder ?? 'ASC') as SortOrder,
  }
}

const DEFAULT_STALE_TIME = 60_000 as const

// ==============================
// LISTAR
// ==============================
export function useImagenesComercio(
  comercioId: number | undefined,
  params?: ListImagenesParams,
  opts?: { enabled?: boolean; staleTime?: number },
) {
  const enabled = (opts?.enabled ?? true) && Number.isFinite(comercioId)
  const norm = normalizeListParams(params ?? {})

  return useQuery<PagedResponse<ImagenComercio>, Error>({
    queryKey: enabled ? imagenKeys.list(comercioId!, norm) : ['imagenes', 'disabled'],
    queryFn: async ({ signal }) => {
      // seguridad adicional por si acaso
      ensureValidId('comercioId', comercioId as number)

      const { data } = await api.get<PagedResponse<ImagenComercio>>(
        `/comercios/${comercioId}/imagenes`,
        { params: norm, signal },
      )
      return data
    },
    enabled,
    retry: false,
    staleTime: opts?.staleTime ?? DEFAULT_STALE_TIME,
  })
}

// ==============================
// DETALLE
// ==============================
export function useImagenComercio(
  comercioId: number | undefined,
  imagenId: number | undefined,
  opts?: { enabled?: boolean; staleTime?: number },
) {
  const enabled =
    (opts?.enabled ?? true) && Number.isFinite(comercioId) && Number.isFinite(imagenId)

  const queryKey = enabled
    ? imagenKeys.detail(comercioId!, imagenId!)
    : ['imagenes', 'detail', '__disabled__']

  return useQuery<ImagenComercio, Error>({
    queryKey,
    queryFn: async ({ signal }) => {
      ensureValidId('comercioId', comercioId as number)
      ensureValidId('imagenId', imagenId as number)

      const { data } = await api.get<ImagenComercio>(
        `/comercios/${comercioId}/imagenes/${imagenId}`,
        { signal },
      )
      return data
    },
    enabled,
    retry: false,
    staleTime: opts?.staleTime ?? DEFAULT_STALE_TIME,
  })
}

// ==============================
// CREAR (FormData) 🧩
// ==============================
// Backend espera: campo 'imagen' (archivo) o url + mensaje/orden/activo
export function useCrearImagenComercio(comercioId: number) {
  const qc = useQueryClient()

  return useMutation<ImagenComercio, Error, FormData>({
    mutationKey: ['imagenes', 'crear', comercioId],
    mutationFn: async (formData) => {
      ensureValidId('comercioId', comercioId)

      const { data } = await api.post<ImagenComercio>(
        `/comercios/${comercioId}/imagenes`,
        formData,
        {
          // Axios detecta Content-Type multipart/form-data automáticamente
        },
      )
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: imagenKeys.list(comercioId) })
    },
  })
}

// ==============================
// ACTUALIZAR (FormData) 🧩
// ==============================
export function useActualizarImagenComercio(comercioId: number) {
  const qc = useQueryClient()

  return useMutation<ImagenComercio, Error, { id: number; data: FormData }>({
    mutationKey: ['imagenes', 'actualizar', comercioId],
    mutationFn: async ({ id, data }) => {
      ensureValidId('comercioId', comercioId)
      ensureValidId('imagenId', id)

      const res = await api.patch<ImagenComercio>(
        `/comercios/${comercioId}/imagenes/${id}`,
        data,
      )
      return res.data
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: imagenKeys.list(comercioId) })
      qc.invalidateQueries({ queryKey: imagenKeys.detail(comercioId, id) })
    },
  })
}

// ==============================
// ELIMINAR
// ==============================
export function useEliminarImagenComercio(comercioId: number) {
  const qc = useQueryClient()

  return useMutation<{ ok: true }, Error, number>({
    mutationKey: ['imagenes', 'eliminar', comercioId],
    mutationFn: async (imagenId) => {
      ensureValidId('comercioId', comercioId)
      ensureValidId('imagenId', imagenId)

      const { data } = await api.delete<{ ok: true }>(
        `/comercios/${comercioId}/imagenes/${imagenId}`,
      )
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: imagenKeys.list(comercioId) })
    },
  })
}

// ==============================
// Utilidad: convertir objeto a FormData
// ==============================
export function toImagenFormData<T extends Record<string, any>>(obj: T, file?: File | null) {
  const fd = new FormData()
  Object.entries(obj ?? {}).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return
    fd.append(k, String(v))
  })
  if (file) fd.append('imagen', file) // backend espera el campo 'imagen'
  return fd
}


// ==============================
// LISTAR TODAS LAS IMÁGENES DE UN COMERCIO (sin paginación)
// ==============================
export function useImagenesComercioAll(
  comercioId: number | undefined,
  opts?: { enabled?: boolean; staleTime?: number },
) {
  const enabled = (opts?.enabled ?? true) && Number.isFinite(comercioId)

  const queryKey = enabled
    ? imagenKeys.allByComercio(comercioId!)
    : ['imagenes', 'allByComercio', '__disabled__']

  return useQuery<ImagenComercio[], Error>({
    queryKey,
    queryFn: async ({ signal }) => {
      ensureValidId('comercioId', comercioId as number)

      const { data } = await api.get<ImagenComercio[]>(
        `/comercios/${comercioId}/imagenes/all`,
        { signal },
      )
      return data
    },
    enabled,
    retry: false,
    staleTime: opts?.staleTime ?? DEFAULT_STALE_TIME,
  })
}
