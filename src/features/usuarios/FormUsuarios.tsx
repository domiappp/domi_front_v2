import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../../shared/components/Input';
import { Select } from '../../shared/components/Select';
import type { UserList } from '../../shared/types/users-type';
import { useCreateUsuario, useUpdateUsuario } from '../../services/useUsers';

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
  rol: any; // Cambia a tu tipo Rol si lo tienes importado
  estado: 'activo' | 'inactivo';
  direccion?: string;
  telefono?: string;
  password?: string;         // <- nuevo
  confirmPassword?: string;  // <- nuevo (solo front)
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
      password: '',         // vacío por seguridad
      confirmPassword: '',  // vacío por seguridad
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
  };
}

const FormUsuarios: React.FC<Props> = ({ mode, initial, onSuccess, onCancel }) => {
  const isEdit = mode === 'edit';
  const defaults = useMemo(() => makeDefaults(isEdit, initial ?? null), [isEdit, initial]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
    watch,
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

  const onSubmit = handleSubmit(async (values) => {
    // No enviamos confirmPassword al backend
    const { confirmPassword, ...rest } = values;

    if (isEdit) {
      if (!initial?.id) return;

      // Construye payload parcial: solo password si viene y cumple
      const payload: any = {
        name: rest.name,
        email: rest.email,
        rol: rest.rol,
        estado: rest.estado,
        direccion: rest.direccion || undefined,
        telefono: rest.telefono || undefined,
      };

      if (rest.password && rest.password.length >= 6) {
        payload.password = rest.password;
      }

      actualizar.mutate(
        { id: initial.id, payload },
        { onSuccess: (u) => onSuccess?.(u as unknown as UserList) }
      );
    } else {
      // Crear: password es obligatorio (validado abajo), no enviar confirmPassword
      crear.mutate(rest as any, {
        onSuccess: (u) => {
          reset(makeDefaults(false, null));
          onSuccess?.(u as unknown as UserList);
        },
      });
    }
  });

  const loading = isSubmitting || crear.isPending || actualizar.isPending;
  const apiError = (crear.error as any)?.message || (actualizar.error as any)?.message;

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

{
    isEdit && (

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

    )
}
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

        {/* ------ Password & Confirm Password ------ */}
        <div>
          <Input
            label="Contraseña"
            type="password"
            placeholder={isEdit ? 'Deja en blanco para no cambiar' : 'Mínimo 6 caracteres'}
            {...register('password', {
              // En crear es obligatorio; en editar es opcional
              required: !isEdit ? 'Obligatorio' : false,
              validate: (v) => {
                if (isEdit && (!v || v.length === 0)) return true; // opcional en edit
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
                // Si no se está cambiando password en edit, permitir vacío
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
