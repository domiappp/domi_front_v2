import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { useQueryClient } from '@tanstack/react-query';
import { Input } from '../../shared/components/Input';
import { useCrearImagenComercio, useActualizarImagenComercio, toImagenFormData } from '../../services/useImagenesComercio';
import type { ImagenComercio } from '../../services/useImagenesComercio';
import { useModalStore } from '../../store/modal.store';

type Props = {
  comercioId: number;
  mode: 'create' | 'edit';
  initial?: ImagenComercio | null;
  onSuccess?: () => void;
  onCancel?: () => void;
};

type FormVals = {
  mensaje?: string;
  orden?: number;
  activo?: number;
  imagen?: FileList;
};

const API_BASE_URL = import.meta.env.VITE_API_URL;

const getImageUrl = (path?: string | null) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}/archivos/${path}`;
};



const FormImagenesComercio: React.FC<Props> = ({
  comercioId,
  mode,
  initial,
  onSuccess,
  onCancel,
}) => {
  const isEdit = mode === 'edit';
  const queryClient = useQueryClient();
  const closeModal = useModalStore((s) => s.close);

  const defaults = useMemo<FormVals>(
    () => ({
      mensaje: initial?.mensaje ?? '',
      orden: initial?.orden ?? 1,
      activo: initial?.activo ?? 1,
    }),
    [initial]
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormVals>({
    defaultValues: defaults,
    mode: 'onBlur',
  });

  const crear = useCrearImagenComercio(comercioId);
  const actualizar = useActualizarImagenComercio(comercioId);

  useEffect(() => reset(defaults), [defaults, reset]);

  const onSubmit = handleSubmit(async (values) => {
    const file = values.imagen?.[0] ?? null;
    const fd = toImagenFormData(
      {
        mensaje: values.mensaje,
        orden: values.orden,
        activo: values.activo,
      },
      file,
    );

    try {
      if (isEdit && initial) {
        await actualizar.mutateAsync({ id: initial.id, data: fd });
      } else {
        await crear.mutateAsync(fd);
        reset(defaults);
      }

      queryClient.invalidateQueries({ queryKey: ['imagenes', 'list', comercioId] });
      closeModal();

      await Swal.fire({
        icon: 'success',
        title: isEdit ? 'Imagen actualizada' : 'Imagen agregada',
        confirmButtonText: 'Aceptar',
      });

      onSuccess?.();
    } catch (err: any) {
      await Swal.fire('Error', err?.message ?? 'No se pudo guardar la imagen', 'error');
    }
  });

  const loading = isSubmitting || crear.isPending || actualizar.isPending;

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Mensaje"
          placeholder="Texto opcional..."
          {...register('mensaje')}
          errorText={errors.mensaje?.message}
        />

        <Input
          label="Orden"
          type="number"
          placeholder="1"
          {...register('orden', { valueAsNumber: true })}
          errorText={errors.orden?.message}
        />

        <div>
          <label className="label">Activo</label>
          <select
            className="select select-bordered w-full"
            {...register('activo', { valueAsNumber: true })}
            defaultValue={defaults.activo}
          >
            <option value={1}>Sí</option>
            <option value={0}>No</option>
          </select>
        </div>

        <div>
          <label className="label">Archivo de imagen</label>
          <input
            type="file"
            accept="image/*"
            className="file-input file-input-bordered w-full"
            {...register('imagen')}
          />
          {isEdit && initial?.url && (
            <img
              src={getImageUrl(initial.url)}
              alt="actual"
              className="mt-2 h-24 w-32 object-cover border rounded-md"
            />
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button type="submit" className="btn btn-warning" disabled={loading}>
          {loading && <span className="loading loading-spinner mr-2" />}
          {isEdit ? 'Actualizar' : 'Guardar'}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={loading}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default FormImagenesComercio;
