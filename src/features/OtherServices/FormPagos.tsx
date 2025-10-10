import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

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
    shouldUnregister: true,
  });

  const esTransferencia = watch("transferencia");

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
    <section className="flex justify-center items-center py-2 px-0">
      <div className="w-full max-w-xl">
        {/* Tarjeta envolvente */}
        <div className="card bg-[#fff]">
          <div className="card-body">
            <h2 className="text-xl lg:text-3xl font-bold text-center mb-2">
              Formulario de Pagos 💳
            </h2>


            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Selección de transferencia */}
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    {...register("transferencia")}
                  />
                  <span className="label-text">
                    Pago por transferencia
                  </span>
                </label>
                <span className="text-xs mt-1 text-base-content/60">
                  {esTransferencia
                    ? "Has seleccionado transferencia. No necesitas dirección, pero el teléfono sigue siendo obligatorio."
                    : "Si no es transferencia, indica dirección de recogida y teléfono de contacto (ambos obligatorios)."}
                </span>
              </div>

              {/* Dirección de recogida – solo visible si NO es transferencia */}
              {!esTransferencia && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">
                      Dirección de recogida del dinero
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Calle 123, Ciudad"
                    className="input input-bordered w-full"
                    {...register("direccionRecogida", {
                      required: "La dirección de recogida es obligatoria",
                    })}
                  />
                  {errors.direccionRecogida && (
                    <p className="text-error text-sm mt-1">
                      {errors.direccionRecogida.message}
                    </p>
                  )}
                </div>
              )}

              {/* Teléfono de contacto – siempre visible */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Teléfono de contacto</span>
                </label>
                <input
                  type="tel"
                  placeholder="+57 300 123 4567"
                  className="input input-bordered w-full"
                  {...register("telefonoContacto", {
                    required: "El teléfono de contacto es obligatorio",
                    pattern: {
                      value: /^[0-9+\s()\-]{7,}$/,
                      message: "Ingrese un número de teléfono válido",
                    },
                  })}
                />
                {errors.telefonoContacto && (
                  <p className="text-error text-sm mt-1">
                    {errors.telefonoContacto.message}
                  </p>
                )}
                {esTransferencia && (
                  <span className="text-xs mt-1 text-base-content/60">
                    Usaremos este número para confirmar la transferencia.
                  </span>
                )}
              </div>



              <button type="submit" className="btn bg-[#E76B51] text-white btn-block mt-4">
                Confirmar Pago
              </button>

            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FormPagos;
