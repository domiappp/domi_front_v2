// src/components/comercios/FormComercio.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { Commerce } from '../../shared/types/comercioTypes'
import { useCrearComercio, useActualizarComercio, toFormData } from '../../services/useComercios'
import { useServicios } from '../../services/useServices'
import { Input } from '../../shared/components/Input'
import { Select } from '../../shared/components/Select'
import { BASE } from '../../utils/baseUrl'

// 👉 IMPORTA la utilidad de compresión (ajusta la ruta si es necesario)
import { compressToWebP } from '../../utils/imageHelper'
import { useModalStore } from '../../store/modal.store'

export type FormComercioProps = {
  mode: 'create' | 'edit'
  initial?: Commerce | null
  onSuccess?: (c: Commerce) => void
  onCancel?: () => void
}

const estados = [
  { value: 1, label: 'Activo' },
  { value: 0, label: 'Inactivo' },
]

type FormComercioValues = {
  nombre_comercial: string
  razon_social?: string
  nit?: string
  descripcion?: string
  responsable?: string
  email_contacto?: string
  telefono?: string
  telefono_secundario?: string
  direccion?: string
  servicioId?: number
  estado: number | string
}

/** Genera los defaultValues en función de modo e initial */
function makeDefaults(isEdit: boolean, initial?: any): FormComercioValues {
  const estadoDefault =
    isEdit && initial
      ? (typeof initial?.estado === 'number'
        ? initial.estado
        : initial?.estado === 'inactivo'
          ? 0
          : 1)
      : 1

  return isEdit && initial
    ? {
      nombre_comercial: initial?.nombre_comercial ?? '',
      razon_social: initial?.razon_social ?? '',
      nit: initial?.nit ?? '',
      descripcion: initial?.descripcion ?? '',
      responsable: initial?.responsable ?? '',
      email_contacto: initial?.email_contacto ?? '',
      telefono: initial?.telefono ?? '',
      telefono_secundario: initial?.telefono_secundario ?? '',
      direccion: initial?.direccion ?? '',
      servicioId:
        initial?.servicioId ??
        (Number.isFinite(initial?.servicio) ? initial?.servicio : undefined) ??
        initial?.servicio_id?.id ??
        undefined,
      estado: estadoDefault,
    }
    : {
      nombre_comercial: '',
      razon_social: '',
      nit: '',
      descripcion: '',
      responsable: '',
      email_contacto: undefined,
      telefono: '',
      telefono_secundario: '573134089563',
      direccion: '',
      servicioId: undefined,
      estado: 1,
    }
}

const FormComercio: React.FC<FormComercioProps> = ({ mode, initial, onSuccess, onCancel }) => {
  const isEdit = mode === 'edit'

  // Servicios para el select dinámico
  const { data: servicios, isLoading: isLoadingServicios, isError: isServiciosError, error: serviciosError } = useServicios()
  const servicioOptions = (servicios ?? []).map((s) => ({
    value: String(s.id),
    label: s.nombre ?? `Servicio ${s.id}`,
  }))

  // Defaults memorizados para esta combinación de modo/initial
  const defaults = useMemo(() => makeDefaults(isEdit, initial), [isEdit, initial])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<FormComercioValues>({
    defaultValues: defaults,
    mode: 'onBlur',
    shouldUnregister: true,
  })

  // ---------- LOGO y COMPRESIÓN ----------
  const [logoFile, setLogoFile] = useState<File | null>(null)              // File final (comprimido)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)      // URL para <img>
  const [logoInfo, setLogoInfo] = useState<string>('')                     // Texto con tamaños
  const [isCompressing, setIsCompressing] = useState(false)
  const [compressError, setCompressError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)

  // Cuando cambie mode/initial, aplica NUEVOS defaults y limpia file
  useEffect(() => {
    reset(defaults)
    cleanupPreview()
  }, [defaults, reset])

  const cleanupPreview = () => {
    setLogoFile(null)
    if (logoPreview) URL.revokeObjectURL(logoPreview)
    setLogoPreview(null)
    setLogoInfo('')
    setCompressError(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    if (!file) {
      cleanupPreview()
      return
    }

    // Preview rápida del original mientras comprime (opcional)
    const tempUrl = URL.createObjectURL(file)
    setLogoPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return tempUrl
    })
    setCompressError(null)
    setIsCompressing(true)

    try {
      const { file: webpFile, originalKB, compressedKB } = await compressToWebP(file, {
        targetKB: 80,
        maxWidthOrHeight: 1600,
      })
      // Reemplaza preview por la versión comprimida
      const finalUrl = URL.createObjectURL(webpFile)
      setLogoPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev)
        return finalUrl
      })
      setLogoFile(webpFile)
      setLogoInfo(`Original: ${originalKB} KB | Comprimido: ${compressedKB} KB${compressedKB > 80 ? ' (supera 80KB, se priorizó calidad)' : ''}`)
    } catch (err: any) {
      console.error(err)
      setCompressError(err?.message ?? 'No se pudo comprimir el logo')
      // si falla, mantén el original para no bloquear el flujo (opcional)
      setLogoFile(file)
      setLogoInfo('Se usará el archivo original por falla en la compresión.')
    } finally {
      setIsCompressing(false)
    }
  }
  // ---------------------------------------

  const crear = useCrearComercio()
  const actualizar = useActualizarComercio()

  const buildFormData = (vals: FormComercioValues) => toFormData(vals, logoFile)
const closeModal = useModalStore((s) => s.close);


  const onSubmit = handleSubmit(async (values) => {
    const formData = buildFormData(values)
    if (isEdit) {
      if (!initial?.id) return
      actualizar.mutate(
        { id: initial.id, data: formData },
        {
          onSuccess: (c) => {
            onSuccess?.(c)
            close()               // 👈 cierro aquí
            closeModal();

          },
        },
      )
    } else {
      crear.mutate(formData, {
        onSuccess: (c) => {
          const emptyDefaults = makeDefaults(false, null)
          reset(emptyDefaults)
          cleanupPreview()
          onSuccess?.(c)
          close()                 // 👈 cierro aquí
          closeModal();

        },
      })
    }
  })

  const loading = isSubmitting || crear.isPending || actualizar.isPending
  const apiError = crear.error?.message || actualizar.error?.message

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* GRID RESPONSIVE: 1 col (mobile), 2 col (md), 3 col (lg) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Input
            label="Nombre comercial"
            {...register('nombre_comercial', { required: 'Obligatorio' })}
            errorText={errors.nombre_comercial?.message}
          />
        </div>


        <Input type='hidden' label="Razón social" {...register('razon_social')} />



        <Input type='hidden' label="Responsable" {...register('responsable')} />



        <Input
          label="Email de contacto"
          type="hidden"
          {...register("email_contacto")}
          errorText={errors.email_contacto?.message}
        />



        <div>
          <Input label="Teléfono" {...register('telefono')} />
        </div>



        {/* Servicio: Select dinámico */}
        <div>
          {isLoadingServicios ? (
            <div className="form-control">
              <label className="label"><span className="label-text">Servicio</span></label>
              <select className="select select-bordered w-full" disabled>
                <option>Cargando servicios...</option>
              </select>
            </div>
          ) : isServiciosError ? (
            <div className="form-control">
              <label className="label"><span className="label-text">Servicio</span></label>
              <select className="select select-bordered w-full" disabled>
                <option>Error al cargar servicios</option>
              </select>
              <p className="text-xs opacity-70 mt-1">{(serviciosError as any)?.message ?? ''}</p>
            </div>
          ) : (
            <Select
              label="Servicio"
              options={servicioOptions}
              {...register('servicioId', {
                setValueAs: (v: string) => (v == null || v === '' ? undefined : Number(v)),
              })}
              errorText={errors.servicioId?.toString()}
            />
          )}
        </div>

        <div className="md:col-span-2 lg:col-span-3">
          <Input label="Descripción" {...register('descripcion')} />
        </div>




        <div className="md:col-span-2 lg:col-span-3">
          <Input label="Dirección" {...register('direccion')} />
        </div>



        {isEdit && (<>
          <div>
            <Select
              label="Estado"
              options={estados}
              {...register('estado', {
                required: 'Selecciona un estado',
                setValueAs: (v: string | number) =>
                  typeof v === 'number' ? v : v === '' ? 1 : Number(v),
              })}
              errorText={errors.estado?.toString()}
            />
          </div>
        </>)}


        {/* Logo */}
        <div className="md:col-span-2 lg:col-span-3">
          <div className="form-control">
            <label htmlFor="logo" className="label"><span className="label-text">Logo</span></label>
            <input
              ref={fileRef}
              id="logo"
              type="file"
              accept="image/*"
              className="file-input file-input-bordered w-full"
              onChange={handleLogoChange} // 👈 aquí aplicamos la compresión
            />

            {/* Estado de compresión */}
            {isCompressing && (
              <div className="mt-2 text-sm opacity-80 flex items-center gap-2">
                <span className="loading loading-spinner loading-sm" />
                <span>Procesando imagen (WebP ≤ 80KB)...</span>
              </div>
            )}

            {/* Preview (nuevo o actual) */}
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="preview"
                className="mt-3 max-h-40 rounded-xl object-contain"
              />
            ) : isEdit && (initial as any)?.logo_url ? (
              <img
                src={
                  /^(https?:)?\/\//i.test(String((initial as any).logo_url))
                    ? String((initial as any).logo_url)
                    : `${BASE.replace(/\/$/, '')}/archivos/${String((initial as any).logo_url).replace(/^\//, '')}`
                }
                alt="actual"
                className="mt-3 max-h-40 rounded-xl object-contain"
              />
            ) : null}

            {/* Info/errores */}
            {logoInfo && <p className="text-xs opacity-70 mt-2">{logoInfo}</p>}
            {compressError && <p className="text-xs text-red-500 mt-1">{compressError}</p>}
          </div>
        </div>
      </div>

      {/* Errores API */}
      {apiError && (
        <div className="alert alert-error">
          <span>{apiError}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="submit"
          className="btn btn-warning btn-md w-40"
          disabled={isCompressing || loading || (isEdit && !isDirty && !logoFile)}
        >
          {(isCompressing || loading) && <span className="loading loading-spinner loading-sm mr-2" />}
          {isEdit ? 'Actualizar' : 'Crear Comercio'}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={isCompressing || loading}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}

export default FormComercio
