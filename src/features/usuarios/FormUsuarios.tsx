// src/components/usuarios/FormUsuarios.tsx
import React, { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import ReactSelect from 'react-select';
import { Input } from '../../shared/components/Input';
import { Select } from '../../shared/components/Select';
import type { UserList } from '../../shared/types/users-type';
import { useCreateUsuario, useUpdateUsuario } from '../../services/useUsers';
import { useModalStore } from '../../store/modal.store';
import { getErrorMessage, getFieldErrors } from '../../utils/http';
import { useComerciosActivos } from '../../services/useComercios';

type Props = {
  mode: 'create' | 'edit';
  initial?: UserList | null;
  onSuccess?: (u: UserList) => void;
  onCancel?: () => void;
};

const estados = [
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
] as const;

const rolesFallback = [
  { value: 'administrador', label: 'Administrador' },
  { value: 'comercio', label: 'Aliado' },
];

type FormVals = {
  name: string;
  email: string;
  rol: any;
  estado: 'activo' | 'inactivo';
  direccion?: string;
  telefono?: string;
  password?: string;
  confirmPassword?: string;
  comercioId?: number; // 👈 NUEVO: el comercio al que pertenece el usuario
};

function makeDefaults(isEdit: boolean, initial?: UserList | null): FormVals {
  if (isEdit && initial) {
    return {
      name: initial.name ?? '',
      email: initial.email ?? '',
      rol: initial.rol,
      estado: initial.estado ?? 'activo',
      direccion: initial.direccion ?? '',
      telefono: initial.telefono ?? '',
      password: '',
      confirmPassword: '',
      // ajusta según cómo te llegue el comercio en UserList (comercio?.id, comercioId, etc.)
      comercioId:
        (initial as any).comercioId ??
        (initial as any).comercio?.id ??
        undefined,
    };
  }
  return {
    name: '',
    email: '',
    rol: rolesFallback[0].value,
    estado: 'activo',
    direccion: '',
    telefono: '',
    password: '',
    confirmPassword: '',
    comercioId: undefined,
  };
}

const FormUsuarios: React.FC<Props> = ({ mode, initial, onSuccess, onCancel }) => {
  const isEdit = mode === 'edit';
  const defaults = useMemo(() => makeDefaults(isEdit, initial ?? null), [isEdit, initial]);

  const queryClient = useQueryClient();
  const closeModal = useModalStore((s) => s.close);

  // 👉 Comercios activos para el select (id + nombre_comercial)
  const {
    data: comerciosActivos,
    isLoading: isLoadingComercios,
    isError: isComerciosError,
  } = useComerciosActivos();

  const comercioOptions =
    comerciosActivos?.map((c) => ({
      value: c.id,
      label: c.nombre_comercial,
    })) ?? [];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
    watch,
    setError,
    control,
    setValue,
  } = useForm<FormVals>({
    defaultValues: defaults,
    mode: 'onBlur',
    shouldUnregister: true,
  });

  const crear = useCreateUsuario();
  const actualizar = useUpdateUsuario();

  useEffect(() => {
    reset(defaults);
  }, [defaults, reset]);

  const password = watch('password');
  const selectedRol = watch('rol');

  // Si cambian el rol a algo distinto de "comercio", limpiamos comercioId
  useEffect(() => {
    if (selectedRol !== 'comercio') {
      setValue('comercioId', undefined, { shouldDirty: true });
    }
  }, [selectedRol, setValue]);

  const onSubmit = handleSubmit(async (values) => {
    const { confirmPassword, ...rest } = values;

    try {
      let u: any;

      if (isEdit) {
        if (!initial?.id) return;

        const payload: any = {
          name: rest.name,
          email: rest.email,
          rol: rest.rol,
          estado: rest.estado,
          direccion: rest.direccion || undefined,
          telefono: rest.telefono || undefined,
        };

        // Solo enviamos comercioId si el rol es comercio (Aliado)
        if (rest.rol === 'comercio') {
          payload.comercioId = rest.comercioId ?? undefined;
        } else {
          payload.comercioId = undefined;
        }

        if (rest.password && rest.password.length >= 6) {
          payload.password = rest.password;
        }

        u = await actualizar.mutateAsync({ id: initial.id, payload });
      } else {
        const payload: any = {
          name: rest.name,
          email: rest.email,
          rol: rest.rol,
          estado: rest.estado,
          direccion: rest.direccion || undefined,
          telefono: rest.telefono || undefined,
          password: rest.password,
        };

        if (rest.rol === 'comercio') {
          payload.comercioId = rest.comercioId ?? undefined;
        }

        u = await crear.mutateAsync(payload as any);
        reset(makeDefaults(false, null));
      }
      closeModal();

      await Swal.fire({
        title: isEdit ? 'Usuario actualizado' : 'Usuario creado',
        text: 'La operación se realizó correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });

      queryClient.invalidateQueries({ queryKey: ['usuarios', 'list'] });

      onSuccess?.(u as UserList);
    } catch (err: any) {
      const fieldErrors = getFieldErrors(err);
      if (fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, message]) => {
          if (field in (defaults as any)) {
            setError(field as keyof FormVals, { type: 'server', message });
          }
        });
      }

      const message = getErrorMessage(err);

      await Swal.fire({
        title: 'Error',
        text: message,
        icon: 'error',
        confirmButtonText: 'Entendido',
      });
    }
  });

  const loading = isSubmitting || crear.isPending || actualizar.isPending;

  const apiError =
    (crear.error as any)?.message || (actualizar.error as any)?.message;

  const rolesOptions = rolesFallback;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Input
            label="Nombre"
            placeholder="Nombre del usuario"
            {...register('name', { required: 'Obligatorio' })}
            errorText={errors.name?.message}
          />
        </div>

        <div>
          <Input
            label="Correo"
            type="email"
            placeholder="usuario@correo.com"
            {...register('email', {
              required: 'Obligatorio',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Correo inválido',
              },
            })}
            errorText={errors.email?.message}
          />
        </div>

        <div>
          <Select
            label="Rol"
            options={rolesOptions}
            {...register('rol', { required: 'Selecciona un rol' })}
            errorText={errors.rol as any}
          />
        </div>

        {/* SOLO CUANDO ES COMERCIO (ALIADO) 👉 Select2-like con react-select */}
        {selectedRol === 'comercio' && (
          <div className="md:col-span-2 lg:col-span-2">
            <Controller
              control={control}
              name="comercioId"
              rules={{
                required: 'Selecciona un comercio aliado',
              }}
              render={({ field }) => {
                const selectedOption =
                  comercioOptions.find((opt) => opt.value === field.value) ?? null;

                return (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Comercio aliado</span>
                    </label>
                    <ReactSelect
                      {...field}
                      options={comercioOptions}
                      isSearchable
                      isClearable
                      classNamePrefix="react-select"
                      value={selectedOption}
                      onChange={(option) =>
                        field.onChange(option ? (option as any).value : undefined)
                      }
                      isDisabled={isLoadingComercios || isComerciosError}
                      placeholder={
                        isLoadingComercios
                          ? 'Cargando comercios...'
                          : 'Buscar y seleccionar comercio'
                      }
                    />
                    {errors.comercioId && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.comercioId.message}
                      </p>
                    )}
                  </div>
                );
              }}
            />
          </div>
        )}

        {isEdit && (
          <div>
            <Select
              label="Estado"
              options={estados as unknown as { value: string | number; label: string }[]}
              {...register('estado', {
                required: 'Selecciona un estado',
                setValueAs: (v: string) => (v === 'inactivo' ? 'inactivo' : 'activo'),
              })}
              errorText={errors.estado?.toString()}
            />
          </div>
        )}

        <div>
          <Input
            label="Teléfono"
            placeholder="(+57) 300 123 4567"
            {...register('telefono')}
            errorText={errors.telefono?.toString()}
          />
        </div>

        <div className="md:col-span-2 lg:col-span-2">
          <Input
            label="Dirección"
            placeholder="Calle 123 # 45-67"
            {...register('direccion')}
            errorText={errors.direccion?.toString()}
          />
        </div>

        {/* Password & Confirm */}
        <div>
          <Input
            label="Contraseña"
            type="password"
            placeholder={isEdit ? 'Deja en blanco para no cambiar' : 'Mínimo 6 caracteres'}
            {...register('password', {
              required: !isEdit ? 'Obligatorio' : false,
              validate: (v) => {
                if (isEdit && (!v || v.length === 0)) return true;
                if (typeof v !== 'string') return 'password must be a string';
                if (v.length < 6) return 'password must be longer than or equal to 6 characters';
                return true;
              },
            })}
            errorText={errors.password?.toString()}
          />
        </div>

        <div>
          <Input
            label="Confirmar contraseña"
            type="password"
            placeholder="Repite la contraseña"
            {...register('confirmPassword', {
              validate: (cv) => {
                const password = watch('password');
                if (isEdit && (!password || password.length === 0)) return true;
                if (typeof cv !== 'string') return 'password must be a string';
                if (password && cv !== password) return 'Las contraseñas no coinciden';
                return true;
              },
            })}
            errorText={errors.confirmPassword?.toString()}
          />
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
          disabled={loading || (isEdit && !isDirty)}
        >
          {loading && <span className="loading loading-spinner loading-sm mr-2" />}
          {isEdit ? 'Actualizar' : 'Crear Usuario'}
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

export default FormUsuarios;
