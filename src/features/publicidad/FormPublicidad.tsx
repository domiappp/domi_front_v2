import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '../../shared/components/Input'
import { Select } from '../../shared/components/Select'
import { useCreatePublicidad, useUpdatePublicidad } from '../../services/usePublicidad'
import type { Publicidad } from '../../shared/types/publicidadTypes'
import { BASE } from '../../utils/baseUrl'
import { useModalStore } from '../../store/modal.store'

type Props = {
  mode: 'create' | 'edit'
  initial?: Publicidad | null
  onSuccess?: (p: Publicidad) => void
  onCancel?: () => void
}

const estados = [
  { value: 1, label: 'Activo' },
  { value: 0, label: 'Inactivo' },
]

type FormVals = {
  ruta: string
  estado: number | string
  orden?: number | string
  fecha_inicio?: string
  fecha_fin?: string
}

function makeDefaults(isEdit: boolean, initial?: any): FormVals {
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
        ruta: initial?.ruta ?? '',
        estado: estadoDefault,
        orden: initial?.orden ?? 1,
        // si tu API regresa ISO, úsalo tal cual; si regresa Date, formatea a input-datetime-local (YYYY-MM-DDTHH:mm)
        fecha_inicio: initial?.fecha_inicio ? new Date(initial.fecha_inicio).toISOString().slice(0,16) : '',
        fecha_fin: initial?.fecha_fin ? new Date(initial.fecha_fin).toISOString().slice(0,16) : '',
      }
    : {
        ruta: '',
        estado: 1,
        orden: 1,
        fecha_inicio: '',
        fecha_fin: '',
      }
}

const FormPublicidad: React.FC<Props> = ({ mode, initial, onSuccess, onCancel }) => {
  const isEdit = mode === 'edit'
  const defaults = useMemo(() => makeDefaults(isEdit, initial), [isEdit, initial])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<FormVals>({
    defaultValues: defaults,
    mode: 'onBlur',
    shouldUnregister: true,
  })

  const [file, setFile] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)

  const crear = useCreatePublicidad()
  const actualizar = useUpdatePublicidad()

  useEffect(() => {
    reset(defaults)
    setFile(null)
    if (fileRef.current) fileRef.current.value = ''
  }, [defaults, reset])

  const buildFD = (vals: FormVals) => {
    const fd = new FormData()
    if (file) fd.append('imagen', file)
    fd.append('ruta', vals.ruta)
    if (vals.estado !== undefined && vals.estado !== null) fd.append('estado', String(vals.estado))
    if (vals.orden !== undefined && vals.orden !== null) fd.append('orden', String(vals.orden))
    if (vals.fecha_inicio) fd.append('fecha_inicio', new Date(vals.fecha_inicio).toISOString())
    if (vals.fecha_fin) fd.append('fecha_fin', new Date(vals.fecha_fin).toISOString())
    return fd
  }

    const closeModal = useModalStore((s) => s.close)


const onSubmit = handleSubmit(async (values) => {
    const fd = buildFD(values)
    if (isEdit) {
      if (!initial?.id) return
      actualizar.mutate(
        { id: initial.id, formData: fd },
        {
          onSuccess: (p) => {
            onSuccess?.(p)
            closeModal()          // 👈 cerrar modal al actualizar
          },
        }
      )
    } else {
      crear.mutate(fd, {
        onSuccess: (p) => {
          const empty = makeDefaults(false, null)
          reset(empty)
          setFile(null)
          if (fileRef.current) fileRef.current.value = ''
          onSuccess?.(p)
          closeModal()            // 👈 cerrar modal al crear
        },
      })
    }
  })

  const loading = isSubmitting || crear.isPending || actualizar.isPending
  const apiError = (crear.error as any)?.message || (actualizar.error as any)?.message

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="md:col-span-2 lg:col-span-3">
          <Input
            label="URL de destino"
            placeholder="https://tu-sitio.com"
            {...register('ruta', { required: 'Obligatorio' })}
            errorText={errors.ruta?.message}
          />
        </div>

        <div>
          <Select
            label="Estado"
            options={estados}
            {...register('estado', {
              required: 'Selecciona un estado',
              setValueAs: (v: string | number) => (typeof v === 'number' ? v : Number(v || 1)),
            })}
            errorText={errors.estado?.toString()}
          />
        </div>

        <div>
          <Input
            label="Orden"
            type="number"
            min={1}
            {...register('orden', {
              setValueAs: (v: any) => (v === '' || v == null ? 1 : Number(v)),
            })}
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Fecha inicio</span>
          </label>
          <input
            type="datetime-local"
            className="input input-bordered w-full"
            {...register('fecha_inicio')}
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Fecha fin</span>
          </label>
          <input
            type="datetime-local"
            className="input input-bordered w-full"
            {...register('fecha_fin')}
          />
        </div>

        <div className="md:col-span-2 lg:col-span-3">
          <div className="form-control">
            <label htmlFor="imagen" className="label">
              <span className="label-text">Imagen (opcional)</span>
            </label>
            <input
              ref={fileRef}
              id="imagen"
              type="file"
              accept="image/*"
              className="file-input file-input-bordered w-full"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            {file ? (
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="mt-3 max-h-40 rounded-xl object-contain"
              />
            ) : isEdit && (initial as any)?.imagen ? (
              <img
                src={
                  /^(https?:)?\/\//i.test(String((initial as any).imagen))
                    ? String((initial as any).imagen)
                    : `${BASE.replace(/\/$/, '')}${String((initial as any).imagen).startsWith('/') ? '' : '/'}${String((initial as any).imagen)}`
                }
                alt="actual"
                className="mt-3 max-h-40 rounded-xl object-contain"
              />
            ) : null}
          </div>
        </div>
      </div>

      {apiError && (
        <div className="alert alert-error">
          <span>{apiError}</span>
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="submit"
          className="btn btn-warning btn-md w-40"
          disabled={loading || (isEdit && !isDirty && !file)}
        >
          {loading && <span className="loading loading-spinner loading-sm mr-2" />}
          {isEdit ? 'Actualizar' : 'Crear Publicidad'}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={loading}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}

export default FormPublicidad
