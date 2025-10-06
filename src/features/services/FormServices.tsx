// src/components/FormServices.tsx (reemplazado para usar tus componentes Input y Select)
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { Servicio } from '../../shared/types/servicesTypes'
import { useCrearServicio, useActualizarServicio } from '../../services/useServices'
// ⬇️ Ajusta estas rutas según dónde colocaste tus componentes
import { Input } from '../../shared/components/Input'
import { Select } from '../../shared/components/Select'

// Si todavía usas FloatingField para layout, ya no es necesario aquí, 
// porque Input/Select ya renderizan label + helper + error.

type FormServicesProps = {
  mode: 'create' | 'edit'
  initial?: Servicio | null
  onSuccess?: (servicio: Servicio) => void
  onCancel?: () => void
}

const estados = [
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
]

type FormValues = {
  nombre: string
  estado: string
  orden?: number | undefined
  // ⚠️ foto se maneja aparte con <input type="file">
}

const FormServices: React.FC<FormServicesProps> = ({ mode, initial, onSuccess, onCancel }) => {
  const isEdit = mode === 'edit'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
    watch,
  } = useForm<FormValues>({
    defaultValues: isEdit && initial
      ? {
          nombre: initial.nombre,
          estado: initial.estado ?? 'activo',
          orden: initial.orden ?? undefined,
        }
      : {
          nombre: '',
          estado: 'activo',
          orden: undefined,
        },
    mode: 'onBlur',
  })

  // estado local para el file
  const [fotoFile, setFotoFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const crear = useCrearServicio()
  const actualizar = useActualizarServicio()

  useEffect(() => {
    if (isEdit && initial) {
      reset({
        nombre: initial.nombre,
        estado: initial.estado ?? 'activo',
        orden: initial.orden ?? undefined,
      })
      setFotoFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }, [isEdit, initial, reset])

  const buildFormData = (vals: FormValues) => {
    const fd = new FormData()
    fd.append('nombre', vals.nombre.trim())
    fd.append('estado', (vals.estado ?? 'activo').trim())
    if (typeof vals.orden === 'number') fd.append('orden', String(vals.orden))
    if (fotoFile) fd.append('foto', fotoFile)
    return fd
  }

  const onSubmit = handleSubmit(async (values) => {
    const formData = buildFormData(values)

    if (isEdit) {
      if (!initial?.id) return
      actualizar.mutate(
        { id: initial.id, data: formData },
        { onSuccess: (s) => onSuccess?.(s) }
      )
    } else {
      crear.mutate(formData, {
        onSuccess: (s) => {
          reset()
          setFotoFile(null)
          if (fileInputRef.current) fileInputRef.current.value = ''
          onSuccess?.(s)
        },
      })
    }
  })

  const loading = isSubmitting || crear.isPending || actualizar.isPending
  const apiError = crear.error?.message || actualizar.error?.message
  const nombre = watch('nombre')

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {isEdit ? 'Actualizar servicio' : 'Registrar servicio'}
        </h2>
        {nombre ? <div className="badge badge-outline">{nombre}</div> : null}
      </div>

      {/* Nombre */}
      <Input
        label="Nombre"
        placeholder="p. ej., Delivery"
        className="rounded-2xl"
        {...register('nombre', {
          required: 'El nombre es obligatorio',
          minLength: { value: 3, message: 'Mínimo 3 caracteres' },
          setValueAs: (v: string) => (v ?? '').trim(),
        })}
        errorText={errors.nombre?.message}
      />

      {/* Estado */}
      <Select
        label="Estado"
        className="rounded-2xl"
        options={estados}
        {...register('estado', { required: 'Selecciona un estado' })}
        errorText={errors.estado?.message as string | undefined}
      />


      {/* Orden */}
      <Input
        label="Orden"
        type="number"
        placeholder="p. ej., 1"
        className="rounded-2xl"
        {...register('orden', {
          valueAsNumber: true,
          validate: (v) =>
            (v == null || Number.isFinite(v)) && (v == null || v >= 0)
              ? true
              : 'Debe ser un número ≥ 0',
        })}
        errorText={errors.orden?.message as string | undefined}
      />

      {/* Foto (input de archivo NO se reemplaza) */}
      <div className="form-control">
        <label htmlFor="foto" className="label">
          <span className="label-text">Foto</span>
        </label>
        <input
          id="foto"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="file-input file-input-bordered w-full rounded-2xl"
          onChange={(e) => {
            const f = e.target.files?.[0] ?? null
            setFotoFile(f)
          }}
        />
        {fotoFile ? (
          <img
            src={URL.createObjectURL(fotoFile)}
            alt="preview"
            className="mt-3 max-h-40 rounded-xl object-contain"
          />
        ) : isEdit && initial?.foto ? (
          <img
            src={initial.foto}
            alt="actual"
            className="mt-3 max-h-40 rounded-xl object-contain"
          />
        ) : null}
      </div>

      {/* API error */}
      {apiError ? (
        <div className="alert alert-error">
          <span>{apiError}</span>
        </div>
      ) : null}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          className={`btn btn-primary ${loading ? 'btn-disabled' : ''}`}
          disabled={loading || (isEdit && !isDirty && !fotoFile)}
        >
          {loading && <span className="loading loading-spinner loading-sm mr-2" />}
          {isEdit ? 'Actualizar' : 'Crear'}
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

export default FormServices
