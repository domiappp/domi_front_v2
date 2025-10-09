// utils/http.ts
export type FieldErrors = Record<string, string>;

export function getErrorMessage(err: any): string {
  // Axios-like o fetch con JSON
  const msg =
    err?.response?.data?.message ??
    err?.data?.message ??
    err?.message ??
    "Ocurrió un error inesperado";
  return typeof msg === "string" ? msg : "Ocurrió un error inesperado";
}

export function getFieldErrors(err: any): FieldErrors | null {
  // Para 422 con shape { errors: { field: "mensaje" } } o array
  const errors = err?.response?.data?.errors ?? err?.data?.errors;
  if (!errors) return null;

  if (Array.isArray(errors)) {
    // ej: [{ field: 'email', message: 'ya existe' }]
    return errors.reduce((acc: FieldErrors, e: any) => {
      if (e?.field && e?.message) acc[e.field] = e.message;
      return acc;
    }, {});
  }

  if (typeof errors === "object") {
    // ej: { email: 'ya existe', password: 'muy corta' }
    return errors as FieldErrors;
  }

  return null;
}
