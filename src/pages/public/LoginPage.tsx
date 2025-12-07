import React from "react";
import { Bike, Mail, Lock, Eye, EyeOff, ShieldCheck, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import type { SubmitHandler, FieldError } from "react-hook-form";
import { useLogin } from "../../services/useAuth";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import type { LoginSuccess } from "../../shared/types/users-type";
import { useLoader } from "../../store/loader.store";
import { BASE } from "../../utils/baseUrl";

interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  // ✅ Tipar el formulario
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const { mutate: login, isPending } = useLogin();
  const navigate = useNavigate();
  const setFromResponse = useAuthStore((s) => s.setFromResponse);

  // 👇 acciones del loader
  const show = useLoader((s) => s.show);
  const hide = useLoader((s) => s.hide);

  // 👇 mostrar/ocultar overlay según el estado de la mutación (con mínimo 500ms)
  React.useEffect(() => {
    if (isPending) {
      show();
    } else {
      hide();
    }
    return () => hide(); // limpieza en caso de desmontaje
  }, [isPending, show, hide]);

  const onSubmit: SubmitHandler<LoginFormInputs> = (formData) => {
    login(formData, {
      onSuccess: (data: LoginSuccess) => {

        show();

        setTimeout(() => {
          setFromResponse(data);
          reset();
        }, 500);

        hide();

        if (data.rol === 'administrador') {
          navigate("/dashboard");
        } else {
          navigate("/productos");
        }

      },
      onError: (err) => {
        console.log("Login error:", err);
        // opcional: toast
      },
    });
  };

  const [showPassword, setShowPassword] = React.useState(false);



  const handleGoogleLogin = React.useCallback(() => {
    // Redirige al flujo de Google del backend
    // Si quieres pasar "state/next", podrías agregar query params y leerlos luego.
    window.location.assign(`${BASE}/auth/google`);
  }, []);


  return (
    <div className="relative min-h-screen overflow-hidden w-full bg-gradient-to- from-[#FF6600] via-[#FF7A26] to-[#FF9A57] text-white">
      {/* Orbes */}
      <div className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden">
        <div className="absolute -left-24 top-10 h-56 w-56 rounded-full bg-white/10" />
        <div className="absolute right-10 top-28 h-28 w-28 rounded-full bg-white/10" />
        <div className="absolute -bottom-24 right-12 h-56 w-56 rounded-full bg-white/10" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[1200px] flex-col items-center justify-center gap-10 px-4 py-10 md:flex-row lg:gap-16">
        {/* Lado visual */}
        <aside className="hidden md:block md:w-1/2">
          <div className="relative">
            <div className="mb-6 flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 shadow-lg backdrop-blur">
                <Bike className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm/4 tracking-wide text-white/80">Plataforma de Domicilios</p>
                <h2 className="text-2xl font-extrabold">Entrega rápida y segura</h2>
              </div>
            </div>

            <DeliveryIllustration className="w-full max-w-[520px] drop-shadow-2xl" />

            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              {/* <div className="badge badge-lg border-white/30 bg-white/10 text-white">Seguimiento en tiempo real</div> */}
              <div className="badge badge-lg border-white/30 bg-white/10 text-white">Tu mejor opcion</div>
              <div className="badge badge-lg border-white/30 bg-white/10 text-white">Disponibilidad</div>
            </div>
          </div>
        </aside>

        {/* Formulario */}
        <main className="w-full md:w-1/2 max-w-sm sm:max-w-md">
          <div className="card rounded-3xl bg-white/95 shadow-2xl backdrop-blur">
            <div className="card-body p-6 sm:p-8">
              <div className="mb-2">
                <p className="text-sm font-semibold text-[#FF6600]">¡Hola!</p>
                <h1 className="text-2xl font-extrabold tracking-tight text-[#333333]">Inicia sesión</h1>
                <p className="mt-1 text-sm text-[#666666]">Bienvenido de vuelta. ¡Nos alegra verte!</p>
              </div>

              {/* ✅ Conectar los inputs con RHF */}
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* Email */}
                <Input
                  id="email"
                  label="Correo"
                  type="email"
                  placeholder="joydoe@gmail.com"
                  autoComplete="email"
                  leftIcon={<Mail className="h-4 w-4 text-[#666666]" />}
                  {...register("email", {
                    required: "El email es obligatorio",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Formato de email no válido",
                    },
                  })}
                  error={errors.email}
                />

                {/* Password */}
                <label className="form-control w-full">
                  <div className="label flex items-center mt-5 justify-between">
                    <span className="label-text text-[#333333] flex items-center gap-2">
                      <Lock className="h-4 w-4 text-[#666666]" /> Contraseña
                    </span>
                    <button type="button" className="link link-hover text-xs text-[#FF6600]">
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className={`input input-bordered w-full pr-12 focus:outline-none focus:ring-2 focus:ring-[#FF6600]/60 focus:border-[#FF6600] text-black ${errors.password ? "input-error" : ""
                        }`}
                      autoComplete="current-password"
                      {...register("password", {
                        required: "La contraseña es obligatoria",
                        minLength: { value: 6, message: "Debe tener al menos 6 caracteres" },
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      className="btn btn-ghost btn-xs absolute right-1 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#FF6600]"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {/* Mensaje de error password */}
                  {errors.password && (
                    <span className="mt-1 text-xs text-[#FF3333]">{errors.password.message}</span>
                  )}
                </label>

                {/* Extras */}
                <div className="flex items-center justify-between pt-1">
                  <label className="label cursor-pointer gap-3">
                    {/* DaisyUI checkbox respeta accent en la mayoría de casos modernos */}
                    <input type="checkbox" className="checkbox checkbox-sm accent-[#FF6600]" />
                    <span className="label-text text-[#666666]">Recordarme</span>
                  </label>
                  <div className="flex items-center gap-2 text-[#666666]">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="text-xs">Tus datos están cifrados</span>
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block rounded-full bg-[#FF6600] border-none hover:bg-[#FF7A26] text-white transition"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Cargando...
                      </>
                    ) : (
                      "Iniciar sesión"
                    )}
                  </button>
                </div>

                <div className="divider text-[#999999]">o</div>

                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="btn btn-outline gap-2 text-[#333333] border-[#E6E6E6] hover:border-[#FF6600] hover:text-[#FF6600] bg-white"
                    aria-label="Iniciar sesión con Google"
                  >
                    <img
                      src="https://www.svgrepo.com/show/355037/google.svg"
                      alt="Google"
                      className="h-4 w-4"
                    />
                    Continuar con Google
                  </button>

                </div>

                <p className="sr-only" id="a11y-note">
                  Usa Tab para navegar por los campos y Enter para enviar.
                </p>
              </form>
            </div>

            <div className="rounded-b-3xl bg-[#F2F2F2] p-4 text-center text-sm text-[#333333]">
              ¿No tienes cuenta?{" "}
              <a href="#" className="link link-hover text-[#FF6600]">
                Regístrate
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LoginPage;

/* ----------------------------
   ILUSTRACIÓN
----------------------------- */

const DeliveryIllustration: React.FC<{ className?: string }> = ({ className }) => (
  <img
    src="/moto.png"
    alt="Ilustración de un domiciliario en bicicleta"
    className={className}
    loading="lazy"
  />
);

/* ----------------------------
   INPUT con forwardRef + error
----------------------------- */

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "id"> & {
  id: string;
  label: string;
  leftIcon?: React.ReactNode;
  right?: React.ReactNode;
  error?: FieldError;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ id, label, leftIcon, right, error, className, ...rest }, ref) => (
    <label className="form-control w-full">
      <div className="label">
        <span className="label-text text-[#333333] flex items-center gap-2">
          {leftIcon}
          {label}
        </span>
      </div>
      <div className="relative">
        <input
          id={id}
          ref={ref}
          className={`input input-bordered w-full pr-12 text-black focus:outline-none focus:ring-2 focus:ring-[#FF6600]/60 focus:border-[#FF6600] ${error ? "input-error" : ""
            } ${className ?? ""}`}
          {...rest}
        />
        {right && <div className="absolute right-2 top-1/2 -translate-y-1/2">{right}</div>}
      </div>
      {/* Mensaje de error email */}
      {error && <span className="mt-1 text-xs text-[#FF3333]">{error.message}</span>}
    </label>
  )
);
Input.displayName = "Input";
