// src/pages/categorias/FormCategorias.tsx
import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { Input } from '../../shared/components/Input';
import type { Categoria } from '../../shared/types/categoriasTypes';
import { useCreateCategoria, useUpdateCategoria } from '../../services/useCategorias';
import { useModalStore } from '../../store/modal.store';
import { getErrorMessage, getFieldErrors } from '../../utils/http';
import { useAuthStore } from '../../store/auth.store';

type Props = {
  mode: 'create' | 'edit';
  initial?: Categoria | null;
  onSuccess?: (c: Categoria) => void;
  onCancel?: () => void;
};

// 👇 El formulario solo maneja 'nombre'; comercioId va directo en el payload (solo auth)
type FormVals = {
  nombre: string;
};

function makeDefaults(isEdit: boolean, initial?: Categoria | null): FormVals {
  if (isEdit && initial) {
    return {
      nombre: initial.nombre,
    };
  }
  return { nombre: '' };
}

const FormCategorias: React.FC<Props> = ({ mode, initial, onSuccess, onCancel }) => {
  const isEdit = mode === 'edit';
  const defaults = useMemo(() => makeDefaults(isEdit, initial ?? null), [isEdit, initial]);

  
  const queryClient = useQueryClient();
  const closeModal = useModalStore((s) => s.close);
  const crear = useCreateCategoria();
  const actualizar = useUpdateCategoria();

  // ✅ Siempre usar el comercioId del usuario autenticado
  const comercioIdFromAuth = useAuthStore((s) => s.user?.comercioId ?? 0);

  console.log(comercioIdFromAuth)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
    setError,
  } = useForm<FormVals>({
    defaultValues: defaults,
    mode: 'onBlur',
  });

  useEffect(() => {
    reset(defaults);
  }, [defaults, reset]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      if (!comercioIdFromAuth) {
        await Swal.fire({
          title: 'Error',
          text: 'No hay comercio asignado al usuario.',
          icon: 'error',
        });
        return;
      }

      // 👇 comercioId se pasa directo al backend desde el auth (no desde el form ni initial)
      const payload = {
        nombre: values.nombre,
        comercioId: comercioIdFromAuth,
      };

      let c: any;
      if (isEdit) {
        if (!initial?.id) return;
        c = await actualizar.mutateAsync({ id: initial.id, payload });
      } else {
        c = await crear.mutateAsync(payload);
        reset(makeDefaults(false, null));
      }

      closeModal();
      await Swal.fire({
        title: isEdit ? 'Categoría actualizada' : 'Categoría creada',
        text: 'La operación se realizó correctamente.',
        icon: 'success',
      });

      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      onSuccess?.(c as Categoria);
    } catch (err: any) {
      const fieldErrors = getFieldErrors(err);
      if (fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, message]) => {
          // El único campo del form es 'nombre'
          setError('nombre', { type: 'server', message });
        });
      }
      const message = getErrorMessage(err);
      await Swal.fire({ title: 'Error', text: message, icon: 'error' });
    }
  });

  const loading = isSubmitting || crear.isPending || actualizar.isPending;
  const apiError = (crear.error as any)?.message || (actualizar.error as any)?.message;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1  gap-4">
        <Input
          label="Nombre de la categoría"
          placeholder="Ej: Electrónica"
          {...register('nombre', { required: 'Obligatorio' })}
          errorText={errors.nombre?.message}
        />
        {/* 👇 Eliminado: no se muestra ningún input (visible ni hidden) del comercioId */}
      </div>

      {apiError && (
        <div className="alert alert-error">
          <span>{apiError}</span>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="submit"
          className="btn btn-warning w-40"
          disabled={loading || (isEdit && !isDirty) || !comercioIdFromAuth}
        >
          {loading && <span className="loading loading-spinner loading-sm mr-2" />}
          {isEdit ? 'Actualizar' : 'Crear Categoría'}
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

export default FormCategorias;
