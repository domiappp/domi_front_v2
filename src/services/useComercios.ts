// src/services/useComercios.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Commerce, ListComerciosParams, PagedResponse, SortOrder } from "../shared/types/comercioTypes";
import { api } from "../config/axios";
import { comerciosPorServicioKeys } from './useComerciosPorServicio';

// =========================
// Keys de caché (estables)
// =========================
export const comercioKeys = {
  all: ['comercios'] as const,
  list: (params: Partial<ListComerciosParams> = {}) =>
    [...comercioKeys.all, 'list', normalizeListParams(params)] as const,

  popularList: (params: Partial<ListComerciosParams> = {}) =>
    [...comercioKeys.all, 'popular-list', normalizeListParams(params)] as const,

  detail: (id: number) => [...comercioKeys.all, 'detail', id] as const,

  // 👇 NUEVO: lista simple de comercios activos (id + nombre)
  activos: ['comercios', 'activos'] as const,
}


function normalizeListParams(p: Partial<ListComerciosParams>): Partial<ListComerciosParams> {
  return {
    page: p.page ?? 1,
    limit: p.limit ?? 10,
    search: p.search ?? '',
    servicioId: p.servicioId, // undefined si no viene
    estado: p.estado ?? '',
    sortBy: p.sortBy ?? 'created_at',
    sortOrder: (p.sortOrder ?? 'DESC') as SortOrder,
  }
}

const DEFAULT_STALE_TIME = 60_000 as const

// =========================
// LISTAR
// =========================
export function useComercios(params?: ListComerciosParams, opts?: { enabled?: boolean; staleTime?: number }) {
  const enabled = opts?.enabled ?? true
  const norm = normalizeListParams(params ?? {})

  return useQuery<PagedResponse<Commerce>, Error>({
    queryKey: comercioKeys.list(norm),
    queryFn: async ({ signal }) => {
      const { data } = await api.get<PagedResponse<Commerce>>('/comercio/listar', {
        withCredentials: true,
        params: norm,
        signal,
      })
      return data
    },
    enabled,
    retry: false,
    staleTime: opts?.staleTime ?? DEFAULT_STALE_TIME,
  })
}

// =========================
// DETALLE (opcional pero útil para editar)
// =========================
export function useComercio(id: number | undefined, opts?: { enabled?: boolean; staleTime?: number }) {
  const canRun = (opts?.enabled ?? true) && Number.isFinite(id)
  const queryKey = canRun ? comercioKeys.detail(id as number) : (['comercios', 'detail', '__disabled__'] as const)

  return useQuery<Commerce, Error>({
    queryKey,
    queryFn: async ({ signal }) => {
      const { data } = await api.get<Commerce>(`/comercio/buscar/${id}`, {
        withCredentials: true,
        signal,
      })
      return data
    },
    enabled: canRun,
    retry: false,
    staleTime: opts?.staleTime ?? DEFAULT_STALE_TIME,
  })
}

// =========================
// CREAR (FormData)  <-- LO QUE NECESITAS
// =========================
// Envía los campos de CreateCommerceDto + file en el campo 'logo'
export function useCrearComercio() {
  const qc = useQueryClient()

  return useMutation<Commerce, Error, FormData>({
    mutationKey: ['comercios', 'crear'],
    mutationFn: async (formData) => {
      const { data } = await api.post<Commerce>('/comercio/crear', formData, {
        withCredentials: true,
      })
      return data
    },
    onSuccess: (created) => {
      // cache detalle
      qc.setQueryData<Commerce>(comercioKeys.detail(created.id), created)

      // 🔁 revalidar TODAS las listas de comercios "normales"
      qc.invalidateQueries({ queryKey: comercioKeys.all, exact: false })

      // 🔁 revalidar TODAS las listas de comercios por servicio (infinite)
      qc.invalidateQueries({
        queryKey: comerciosPorServicioKeys.all, // ['comerciosPorServicio']
        exact: false,                           // que afecte a ['comerciosPorServicio','list',...]
      })
    },
  })
}

// =========================
// ACTUALIZAR (FormData)  <-- LO QUE NECESITAS
// =========================
// Firma: { id, data } donde data es FormData (UpdateCommerceDto + 'logo' opcional)
export function useActualizarComercio() {
  const qc = useQueryClient()

  return useMutation<Commerce, Error, { id: number; data: FormData }>({
    mutationKey: ['comercios', 'actualizar'],
    mutationFn: async ({ id, data }) => {
      const res = await api.patch<Commerce>(`/comercio/actualizar/${id}`, data, {
        withCredentials: true,
      })
      return res.data
    },
    onSuccess: (updated) => {
      qc.setQueryData<Commerce>(comercioKeys.detail(updated.id), updated)

      qc.invalidateQueries({ queryKey: comercioKeys.all, exact: false })

      qc.invalidateQueries({
        queryKey: comerciosPorServicioKeys.all,
        exact: false,
      })
    },
  })
}

// =========================
// Utilidad: construir FormData desde un objeto
// =========================
export function toFormData<T extends Record<string, any>>(obj: T, logo?: File | null) {
  const fd = new FormData()
  Object.entries(obj ?? {}).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return
    if (typeof v === 'object' && !(v instanceof Blob) && !(v instanceof File)) {
      fd.append(k, JSON.stringify(v))
    } else {
      fd.append(k, v as any)
    }
  })
  if (logo) fd.append('logo', logo) // el backend espera el campo 'logo'
  return fd
}



// =========================
// CLICK / VIEW (+1 view)
// =========================

export function useComercioClickView() {
  return useMutation<void, Error, string>({
    mutationKey: ['comercios', 'click-view'],
    mutationFn: async (id: string) => {
      await api.post(
        `/comercio/click/${id}/view`,
        {}, // body vacío válido
        {
          withCredentials: true,
        }
      );
    },
  });
}

// =========================
// LISTAR POPULARES (nuevo, FIX sortBy)
// =========================
export function useComerciosPopulares(
  params?: ListComerciosParams,
  opts?: { enabled?: boolean; staleTime?: number },
) {
  const enabled = opts?.enabled ?? true

  const base = normalizeListParams(params ?? {})
  const norm: Partial<ListComerciosParams> = {
    ...base,
    // 👇 usamos un valor permitido por el DTO
    sortBy: params?.sortBy ?? 'created_at',
    sortOrder: (params?.sortOrder ?? 'DESC') as SortOrder,
  }

  return useQuery<PagedResponse<Commerce>, Error>({
    queryKey: comercioKeys.popularList(norm),
    queryFn: async ({ signal }) => {
      const { data } = await api.get<PagedResponse<Commerce>>(
        '/comercio/listar-populares',
        {
          withCredentials: true,
          params: norm,
          signal,
        }
      )
      return data
    },
    enabled,
    retry: false,
    staleTime: opts?.staleTime ?? DEFAULT_STALE_TIME,
  })

  
}

export type CommerceLite = Pick<Commerce, 'id' | 'nombre_comercial'>


export function useComerciosActivos(
  opts?: { enabled?: boolean; staleTime?: number },
) {
  const enabled = opts?.enabled ?? true

  return useQuery<CommerceLite[], Error>({
    queryKey: comercioKeys.activos,
    queryFn: async ({ signal }) => {
      const { data } = await api.get<CommerceLite[]>('/comercio/activos', {
        withCredentials: true,
        signal,
      })
      return data
    },
    enabled,
    retry: false,
    staleTime: opts?.staleTime ?? DEFAULT_STALE_TIME,
  })
}



// 0=productos, 1=imagenes, 2=ambos
export type EstadoServicio = 0 | 1 | 2

export interface EstadoServicioResponse {
  id: number
  estado_servicio: EstadoServicio
}


// =========================
// GET: estado_servicio por comercio
// =========================
export function useEstadoServicioComercio(
  comercioId: number | undefined,
  opts?: { enabled?: boolean; staleTime?: number },
) {
  const enabled =
    (opts?.enabled ?? true) &&
    typeof comercioId === 'number' &&
    Number.isFinite(comercioId)

  // key similar al resto de hooks
  const queryKey = enabled
    ? ([...comercioKeys.all, 'estado-servicio', comercioId] as const)
    : ([...comercioKeys.all, 'estado-servicio', '__disabled__'] as const)

  return useQuery<EstadoServicioResponse, Error>({
    queryKey,
    queryFn: async ({ signal }) => {
      const { data } = await api.get<EstadoServicioResponse>(
        `/comercio/${comercioId}/estado-servicio`,
        {
          withCredentials: true,
          signal,
        },
      )
      return data
    },
    enabled,
    retry: false,
    staleTime: opts?.staleTime ?? DEFAULT_STALE_TIME,
  })
}

// =========================
// PATCH: actualizar estado_servicio
// =========================
export function useActualizarEstadoServicioComercio() {
  const qc = useQueryClient()

  return useMutation<
    EstadoServicioResponse,
    Error,
    { comercioId: number; estado_servicio: EstadoServicio }
  >({
    mutationKey: [...comercioKeys.all, 'estado-servicio', 'actualizar'],
    mutationFn: async ({ comercioId, estado_servicio }) => {
      const { data } = await api.patch<EstadoServicioResponse>(
        `/comercio/${comercioId}/estado-servicio`,
        { estado_servicio },
        {
          withCredentials: true,
        },
      )
      return data
    },
    onSuccess: (data) => {
      // ✅ actualiza el cache puntual de este estado_servicio
      qc.setQueryData<EstadoServicioResponse>(
        [...comercioKeys.all, 'estado-servicio', data.id],
        data,
      )

      // ✅ refresca el detalle del comercio por si lo usas en otros lados
      qc.invalidateQueries({
        queryKey: comercioKeys.detail(data.id),
        exact: true,
      })

      // Opcional: revalidar listas si te interesa
      qc.invalidateQueries({ queryKey: comercioKeys.all, exact: false })
    },
  })
}