// src/features/products/FormProductos.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateProduct, useUpdateProduct } from '../../services/useProducts';
import { useCategorias } from '../../services/useCategorias';
import { Input } from '../../shared/components/Input';
import { Select } from '../../shared/components/Select';
import { compressToWebP } from '../../utils/imageHelper';
import { BASE } from '../../utils/baseUrl';
import type { Product } from '../../shared/types/products-type';
import { useAuthStore } from '../../store/auth.store';

export type FormProductoProps = {
  mode: 'create' | 'edit';
  initial?: Product | null;
  onSuccess?: (p: Product) => void;
  onCancel?: () => void;
};

// 👇 comercioId NO se pide en el formulario
type FormVals = {
  nombre: string;
  descripcion?: string;
  precio: number;
  categoriaId: number;
  estado?: 'activo' | 'inactivo';
};

const estados = [
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
];

function makeDefaults(isEdit: boolean, initial?: Product | null): FormVals {
  if (isEdit && initial) {
    return {
      nombre: initial.nombre,
      descripcion: initial.descripcion ?? '',
      precio: initial.precio,
      categoriaId: initial.categoria?.id ?? 0,
      estado: (initial.estado as 'activo' | 'inactivo') ?? 'activo',
    };
  }
  return {
    nombre: '',
    descripcion: '',
    precio: 0,
    categoriaId: 0,
    estado: 'activo',
  };
}

type Option = { value: string | number; label: string };

const FormProductos: React.FC<FormProductoProps> = ({
  mode,
  initial,
  onSuccess,
  onCancel,
}) => {
  const isEdit = mode === 'edit';
  const defaults = useMemo(() => makeDefaults(isEdit, initial), [isEdit, initial]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormVals>({
    defaultValues: defaults,
    mode: 'onBlur',
    shouldUnregister: true,
  });

  const crear = useCreateProduct();
  const actualizar = useUpdateProduct();

  // ✅ comercioId solo desde el usuario autenticado
  const comercioIdFromAuth = useAuthStore((s) => s.user?.comercioId ?? 0);

  // ---------- Imagen y compresión ----------
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [info, setInfo] = useState<string>('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressError, setCompressError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const cleanupPreview = () => {
    setImagenFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setInfo('');
    setCompressError(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  useEffect(() => {
    reset(defaults);
    cleanupPreview();
  }, [defaults, reset]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      cleanupPreview();
      return;
    }

    const tempUrl = URL.createObjectURL(file);
    setPreview(tempUrl);
    setIsCompressing(true);
    setCompressError(null);

    try {
      const { file: webpFile, originalKB, compressedKB } = await compressToWebP(file, {
        targetKB: 120,
        maxWidthOrHeight: 1600,
      });
      const finalUrl = URL.createObjectURL(webpFile);
      setPreview(finalUrl);
      setImagenFile(webpFile);
      setInfo(`Original: ${originalKB} KB | Comprimido: ${compressedKB} KB`);
    } catch (err: any) {
      console.error(err);
      setCompressError('No se pudo comprimir la imagen. Se usará la original.');
      setImagenFile(file);
      setInfo('Archivo original.');
    } finally {
      setIsCompressing(false);
    }
  };

  // ---------- Datos de select dinámico ----------
  const { data: categoriasRes } = useCategorias({
    page: 1,
    limit: 100,
    sortBy: 'nombre',
    sortOrder: 'ASC',
  });

  const categoriaOptions: Option[] =
    categoriasRes?.items?.map((c) => ({
      value: String(c.id),
      label: c.nombre ?? `Categoría ${c.id}`,
    })) ?? [];

  // ---------- Submit ----------
  const onSubmit = handleSubmit(async (vals) => {
    if (!comercioIdFromAuth) {
      alert('No hay comercio asignado para este usuario.');
      return;
    }

    const payload = {
      ...vals,
      comercioId: comercioIdFromAuth, // ✅ siempre el del auth
      imagen: isEdit ? (imagenFile ?? undefined) : (imagenFile ?? null),
    };

    if (isEdit) {
      if (!initial?.id) return;
      actualizar.mutate(
        { id: initial.id, payload },
        { onSuccess: (p) => onSuccess?.(p) }
      );
    } else {
      crear.mutate(payload, {
        onSuccess: (p) => {
          reset(makeDefaults(false, null));
          cleanupPreview();
          onSuccess?.(p);
        },
      });
    }
  });

  const loading = isSubmitting || crear.isPending || actualizar.isPending;
  const apiError = (crear.error as any)?.message || (actualizar.error as any)?.message;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Input
            label="Nombre"
            {...register('nombre', { required: 'Obligatorio' })}
            errorText={errors.nombre?.message}
          />
        </div>

        <div>
          <Input
            label="Precio"
            type="number"
            step="0.01"
            {...register('precio', {
              required: 'Obligatorio',
              valueAsNumber: true,
              min: { value: 0.01, message: 'Debe ser mayor que 0' },
            })}
            errorText={errors.precio?.message}
          />
        </div>

        <div>
          <Select
            label="Categoría"
            options={categoriaOptions}
            {...register('categoriaId', {
              required: 'Selecciona una categoría',
              setValueAs: (v: string) => (v === '' || v == null ? 0 : Number(v)),
            })}
            errorText={errors.categoriaId?.toString()}
          />
        </div>

        {isEdit && (
          <div>
            <Select
              label="Estado"
              options={estados}
              {...register('estado', { required: 'Selecciona un estado' })}
              errorText={errors.estado?.toString()}
            />
          </div>
        )}

        <div className="md:col-span-2 lg:col-span-3">
          <Input
            label="Descripción"
            {...register('descripcion')}
            errorText={errors.descripcion?.message}
          />
        </div>

        {/* Imagen */}
        <div className="md:col-span-2 lg:grid-cols-3 lg:col-span-3">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Imagen</span>
            </label>
            <input
              ref={fileRef}
              id="imagen"
              type="file"
              accept="image/*"
              className="file-input file-input-bordered w-full"
              onChange={handleFileChange}
            />
            {isCompressing && (
              <div className="mt-2 text-sm opacity-80 flex items-center gap-2">
                <span className="loading loading-spinner loading-sm" />
                <span>Procesando imagen...</span>
              </div>
            )}

            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="mt-3 max-h-40 rounded-xl object-contain"
              />
            ) : isEdit && initial?.imagen_url ? (
              <img
                src={
                  /^(https?:)?\/\//i.test(initial.imagen_url)
                    ? initial.imagen_url
                    : `${BASE}/archivos/${initial.imagen_url}`
                }
                alt="actual"
                className="mt-3 max-h-40 rounded-xl object-contain"
              />
            ) : null}

            {info && <p className="text-xs opacity-70 mt-2">{info}</p>}
            {compressError && <p className="text-xs text-red-500 mt-1">{compressError}</p>}
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
          disabled={loading || (isEdit && !isDirty && !imagenFile)}
        >
          {loading && <span className="loading loading-spinner loading-sm mr-2" />}
          {isEdit ? 'Actualizar' : 'Crear Producto'}
        </button>
        {onCancel && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default FormProductos;
