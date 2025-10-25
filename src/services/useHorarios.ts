// src/hooks/useHorarios.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../config/axios";
import type { AxiosError } from "axios";

// =====================
// 🔹 Tipos base
// =====================

// ----- Horario Comercial -----
export interface HorarioComercial {
  id: number;
  dia_semana:
    | "lunes"
    | "martes"
    | "miercoles"
    | "jueves"
    | "viernes"
    | "sabado"
    | "domingo";
  turno: number;
  hora_apertura: string;
  hora_cierre: string;
}

export interface HorarioComercialResponse {
  meta: { page: number; limit: number; total: number; totalPages: number };
  items: HorarioComercial[];
}

export interface HorarioComercialParams {
  page?: number;
  limit?: number;
  dia_semana?: string;
  turno?: number;
  sortBy?: "id" | "dia_semana" | "turno" | "hora_apertura" | "hora_cierre";
  sortOrder?: "ASC" | "DESC";
}

export interface CreateHorarioComercialPayload {
  dia_semana: string;
  turno: number;
  hora_apertura: string;
  hora_cierre: string;
}

export interface UpdateHorarioComercialPayload
  extends Partial<CreateHorarioComercialPayload> {}

// ----- Horario Especial -----
export interface HorarioEspecial {
  id: number;
  fecha: string; // formato YYYY-MM-DD
  turno: number;
  hora_apertura: string | null;
  hora_cierre: string | null;
  cerrado: number; // 0 = abierto, 1 = cerrado
}

export interface HorarioEspecialResponse {
  meta: { page: number; limit: number; total: number; totalPages: number };
  items: HorarioEspecial[];
}

export interface HorarioEspecialParams {
  page?: number;
  limit?: number;
  fecha?: string;
  turno?: number;
  sortBy?:
    | "id"
    | "fecha"
    | "turno"
    | "cerrado"
    | "hora_apertura"
    | "hora_cierre";
  sortOrder?: "ASC" | "DESC";
}

export interface CreateHorarioEspecialPayload {
  fecha: string;
  turno: number;
  hora_apertura?: string | null;
  hora_cierre?: string | null;
  cerrado?: number;
}

export interface UpdateHorarioEspecialPayload
  extends Partial<CreateHorarioEspecialPayload> {}

// =====================
// ⚙️ Manejo de errores tip-safe
// =====================
const handleAxiosError = (error: unknown): never => {
  const axiosError = error as AxiosError<any>;
  throw new Error(
    axiosError.response?.data?.message || "Error al procesar la solicitud"
  );
};

// =====================
// 🕒 Horarios Comerciales
// =====================

// ✅ Listar horarios comerciales
export const useHorariosComerciales = (
  comercioId: number,
  params: HorarioComercialParams = {}
) => {
  return useQuery<HorarioComercialResponse>({
    queryKey: ["horariosComerciales", comercioId, params],
    queryFn: async (): Promise<HorarioComercialResponse> => {
      const { data } = await api
        .get<HorarioComercialResponse>(
          `/comercios/${comercioId}/horarios`,
          { params }
        )
        .catch(handleAxiosError);
      return data;
    },
    enabled: !!comercioId,
  });
};

// ✅ Crear horario comercial
export const useCreateHorarioComercial = (comercioId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      payload: CreateHorarioComercialPayload
    ): Promise<HorarioComercial> => {
      const { data } = await api
        .post<HorarioComercial>(
          `/comercios/${comercioId}/horarios`,
          payload
        )
        .catch(handleAxiosError);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["horariosComerciales", comercioId],
      });
    },
  });
};

// ✅ Actualizar horario comercial
export const useUpdateHorarioComercial = (comercioId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateHorarioComercialPayload;
    }): Promise<HorarioComercial> => {
      const { data } = await api
        .patch<HorarioComercial>(
          `/comercios/${comercioId}/horarios/${id}`,
          payload
        )
        .catch(handleAxiosError);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["horariosComerciales", comercioId],
      });
    },
  });
};

// ✅ Eliminar horario comercial
export const useDeleteHorarioComercial = (comercioId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<{ ok: boolean }> => {
      const { data } = await api
        .delete<{ ok: boolean }>(`/comercios/${comercioId}/horarios/${id}`)
        .catch(handleAxiosError);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["horariosComerciales", comercioId],
      });
    },
  });
};

// =====================
// 🌙 Horarios Especiales
// =====================

// ✅ Listar horarios especiales
export const useHorariosEspeciales = (
  comercioId: number,
  params: HorarioEspecialParams = {}
) => {
  return useQuery<HorarioEspecialResponse>({
    queryKey: ["horariosEspeciales", comercioId, params],
    queryFn: async (): Promise<HorarioEspecialResponse> => {
      const { data } = await api
        .get<HorarioEspecialResponse>(
          `/comercios/${comercioId}/horarios-especiales`,
          { params }
        )
        .catch(handleAxiosError);
      return data;
    },
    enabled: !!comercioId,
  });
};

// ✅ Crear horario especial
export const useCreateHorarioEspecial = (comercioId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      payload: CreateHorarioEspecialPayload
    ): Promise<HorarioEspecial> => {
      const { data } = await api
        .post<HorarioEspecial>(
          `/comercios/${comercioId}/horarios-especiales`,
          payload
        )
        .catch(handleAxiosError);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["horariosEspeciales", comercioId],
      });
    },
  });
};

// ✅ Actualizar horario especial
export const useUpdateHorarioEspecial = (comercioId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateHorarioEspecialPayload;
    }): Promise<HorarioEspecial> => {
      const { data } = await api
        .patch<HorarioEspecial>(
          `/comercios/${comercioId}/horarios-especiales/${id}`,
          payload
        )
        .catch(handleAxiosError);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["horariosEspeciales", comercioId],
      });
    },
  });
};

// ✅ Eliminar horario especial
export const useDeleteHorarioEspecial = (comercioId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<{ ok: boolean }> => {
      const { data } = await api
        .delete<{ ok: boolean }>(
          `/comercios/${comercioId}/horarios-especiales/${id}`
        )
        .catch(handleAxiosError);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["horariosEspeciales", comercioId],
      });
    },
  });
};
