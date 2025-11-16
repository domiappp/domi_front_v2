// src/services/useComerciosPorServicio.ts

import { useInfiniteQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { api } from '../config/axios'
import { useFavoritosStore } from '../store/favoritos.store'

export type Commerce = {
  // En el backend el id es number, mejor reflejarlo igual aquí
  id: number
  // ...otras props que ya tengas definidas
}

export type CursorMeta = {
  // lo que ya tengas definido aquí
  // page?: number
  // total?: number
}

export type CursorResponse<T> = {
  items: T[]
  meta: CursorMeta
  nextCursor: string | null
}

export type ListByServiceParams = {
  serviceId: number
  q?: string
  limit?: number
}

export const comerciosPorServicioKeys = {
  all: ['comerciosPorServicio'] as const,
  list: (p: { serviceId: number; q: string; limit: number }) =>
    [...comerciosPorServicioKeys.all, 'list', p.serviceId, p.q, p.limit] as const,
}

function normalizeParams(p: ListByServiceParams) {
  return {
    serviceId: p.serviceId,
    q: (p.q ?? '').trim(),
    limit: Math.min(p.limit ?? 20, 100),
  }
}

// 🔹 array vacío compartido para evitar crear `[]` en cada render
const EMPTY_FAVORITOS: string[] = []

const DEFAULT_STALE_TIME = 0
const DEFAULT_GC_TIME    = 30 * 60_000  // 30 min

export function useComerciosPorServicioInfinite(
  params: ListByServiceParams,
  opts?: { enabled?: boolean; staleTime?: number; gcTime?: number }
) {
  const norm = normalizeParams(params)
  const enabled = (opts?.enabled ?? true) && Number.isFinite(norm.serviceId)

  const favoritosIds = useFavoritosStore((state) => {
    const key = String(norm.serviceId)
    const list = state.favoritosPorServicio?.[key]
    return list ?? EMPTY_FAVORITOS
  })

  const favoritosCsv = favoritosIds
    .map((id) => Number(id))
    .filter((n) => !Number.isNaN(n))
    .join(',')

  return useInfiniteQuery<CursorResponse<Commerce>, Error>({
    // ❌ antes: [...comerciosPorServicioKeys.list(norm), favoritosCsv],
    // ✅ ahora: solo depende del servicio + búsqueda + limit
    queryKey: comerciosPorServicioKeys.list(norm),

    meta: { persist: true },
    enabled,
    staleTime: opts?.staleTime ?? DEFAULT_STALE_TIME,
    gcTime: opts?.gcTime ?? DEFAULT_GC_TIME,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
    placeholderData: keepPreviousData,

    initialPageParam: null as string | null,

    queryFn: async ({ pageParam, signal }) => {
      const { data } = await api.get<CursorResponse<Commerce>>(
        `/services/${norm.serviceId}/comercios`,
        {
          withCredentials: true,
          params: {
            q: norm.q || undefined,
            limit: norm.limit,
            cursor: pageParam ?? undefined,
            // puedes dejar esto o quitarlo, pero ya NO dispara refetch solo por cambiar favoritos
            favoritos: favoritosCsv || undefined,
          },
          signal,
        },
      )
      return data
    },

    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,

    select: (data) => {
      const flat = data.pages.flatMap((p) => p.items)
      const uniq = Array.from(new Map(flat.map((i: any) => [i.id, i])).values())

      return {
        ...data,
        _allItems: uniq,
        _hasMore: data.pages.at(-1)?.nextCursor != null,
        _allIds: uniq.map((i: any) => i.id) as number[],
      }
    },
  })
}

// 🔁 Prefetch para usar en navegación / hover / etc.
export function usePrefetchComerciosPorServicio() {
  const qc = useQueryClient()
  return async (params: ListByServiceParams) => {
    const norm = normalizeParams(params)
    await qc.prefetchInfiniteQuery<CursorResponse<Commerce>>({
      queryKey: comerciosPorServicioKeys.list(norm),
      meta: { persist: true },
      staleTime: DEFAULT_STALE_TIME,
      gcTime: DEFAULT_GC_TIME,

      initialPageParam: null as string | null,
      queryFn: async ({ pageParam, signal }) => {
        const { data } = await api.get<CursorResponse<Commerce>>(
          `/services/${norm.serviceId}/comercios`,
          {
            withCredentials: true,
            params: {
              q: norm.q || undefined,
              limit: norm.limit,
              cursor: pageParam ?? undefined,
            },
            signal,
          },
        )
        return data
      },
      getNextPageParam: (lastPage: CursorResponse<Commerce>) =>
        lastPage.nextCursor ?? undefined,
    })
  }
}

// 🧰 Helper para aplanar páginas por si lo usas en otros lados
export function flattenPages<T>(data: { pages: CursorResponse<T>[] } | undefined): T[] {
  if (!data) return []
  const merged = data.pages.flatMap((p) => p.items)
  const uniq = new Map(merged.map((i: any) => [i.id, i]))
  return Array.from(uniq.values())
}
