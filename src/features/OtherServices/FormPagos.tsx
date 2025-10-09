import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "../../shared/components/Input"; // 🔁 ajusta la ruta según tu proyecto

type FormValues = {
  transferencia: boolean;
  direccionRecogida: string;
  telefonoContacto: string;
};

const FormPagos: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      transferencia: false,
      direccionRecogida: "",
      telefonoContacto: "",
    },
    shouldUnregister: true, // ✅ oculta campos = no se validan ni envían
  });

  const esTransferencia = watch("transferencia");

  // Si es transferencia, limpia solo la dirección (el teléfono permanece)
  useEffect(() => {
    if (esTransferencia) {
      setValue("direccionRecogida", "");
      clearErrors("direccionRecogida");
    }
  }, [esTransferencia, setValue, clearErrors]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log("Datos de pago:", data);
    alert("Pago registrado correctamente ✅");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-base-200 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Formulario de Pagos 💳</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Checkbox: Pago por transferencia */}
        <div className="form-control">
          <label className="label cursor-pointer justify-start gap-3">
            <input
              type="checkbox"
              className="checkbox checkbox-primary"
              {...register("transferencia")}
            />
            <span className="label-text">Pago por transferencia (si aplica)</span>
          </label>
          <span className="label-text-alt opacity-70 mt-1">
            {esTransferencia
              ? "Has seleccionado transferencia. No necesitas dirección, pero el teléfono sigue siendo obligatorio."
              : "Si no es transferencia, indica dirección de recogida y teléfono de contacto (ambos obligatorios)."}
          </span>
        </div>

        {/* Dirección de recogida (solo si NO es transferencia) */}
        {!esTransferencia && (
          <Input
            label="Dirección de recogida del dinero"
            placeholder="Calle 123, Ciudad"
            errorText={errors.direccionRecogida?.message}
            {...register("direccionRecogida", {
              required: "La dirección de recogida es obligatoria",
            })}
          />
        )}

        {/* Teléfono de contacto (SIEMPRE visible y obligatorio) */}
        <Input
          label="Teléfono de contacto"
          type="tel"
          placeholder="+57 300 123 4567"
          helperText={esTransferencia ? "Usaremos este número para confirmar la transferencia." : undefined}
          errorText={errors.telefonoContacto?.message}
          {...register("telefonoContacto", {
            required: "El teléfono de contacto es obligatorio",
            pattern: {
              value: /^[0-9+\s()-]{7,}$/,
              message: "Ingrese un número de teléfono válido",
            },
          })}
        />

        <button type="submit" className="btn btn-primary w-full">
          Guardar pago
        </button>
      </form>
    </div>
  );
};

export default FormPagos;
