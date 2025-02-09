import {Github} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../validations/loginValidator";
import AuthService from "../../services/auth.service";
import CustomInput from "@/shared/components/inputs/CustomInput";
import PasswordInput from "@/shared/components/inputs/PasswordInput";

type Inputs = {
  email: string;
  password: string;
};

export default function LForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    try {
      const response = await AuthService.login(data);
      console.log("Login successful:", response);

      // Guarda el token en el localStorage después de un inicio de sesión exitoso
      if (response.token) {
        AuthService.setToken(response.token); // Guarda el token
        window.location.href = "/"; // Redirige al usuario a la página de inicio
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleOAuthLogin = (url: string) => {
    // Obtener la URL actual (desde donde se solicitó la autenticación)
    const redirectUrl = window.location.href;

    // Agregar la URL de origen como parámetro en la solicitud de autenticación
    const authUrl = `${url}?redirect=${encodeURIComponent(redirectUrl)}`;

    // Redirigir al usuario a la página de autenticación
    window.location.href = authUrl;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <CustomInput
        name="email"
        type="email"
        register={register}
        error={errors["email"]?.message}
        placeholder="tu@ejemplo.com"
        labelText="Email"
      />
      <PasswordInput
        name="password"
        register={register}
        error={errors["password"]?.message}
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Iniciar Sesión
      </button>

      <div className="flex justify-center space-x-4">
        {/* Botón de Discord */}
        <button
          type="button"
          onClick={() => handleOAuthLogin(AuthService.getDiscordAuthUrl())}
          className="flex items-center justify-center w-full bg-[#5865F2] text-white py-2 px-4 rounded-md hover:bg-[#4752C4] focus:outline-none focus:ring-2 focus:ring-[#5865F2] focus:ring-offset-2"
        >
          <FontAwesomeIcon icon={faDiscord} className="w-5 h-5 mr-2" />
          Iniciar con Discord
        </button>

        {/* Botón de GitHub */}
        <button
          type="button"
          onClick={() => handleOAuthLogin(AuthService.getGithubAuthUrl())}
          className="flex items-center justify-center w-full bg-[#171515] text-white py-2 px-4 rounded-md hover:bg-[#0D0C0C] focus:outline-none focus:ring-2 focus:ring-[#171515] focus:ring-offset-2"
        >
          <Github className="w-5 h-5 mr-2" />
          Iniciar con GitHub
        </button>
      </div>
    </form>
  );
}