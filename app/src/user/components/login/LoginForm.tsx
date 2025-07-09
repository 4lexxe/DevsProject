import { Github } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from 'axios';
import { useState } from 'react';
import { loginSchema } from "../../validations/loginValidator";
import AuthService from "../../services/auth.service";
import CustomInput from "@/shared/components/inputs/CustomInput";
import PasswordInput from "@/shared/components/inputs/PasswordInput";

type Inputs = {
  email: string;
  password: string;
};

interface ApiError {
  message?: string;
  error?: string;
  errors?: Array<{
    path: string[];
    message: string;
  }>;
}

export default function LForm() {
  const [showPassword, setShowPassword] = useState(false); // Añadir estado

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(loginSchema),
  });

  // Función para alternar visibilidad
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    try {
      const response = await AuthService.login(data);
      
      if (response.token) {
        AuthService.setToken(response.token);
        window.location.href = "/";
      }
    } catch (error: unknown) {
      let errorMessage = 'Error al iniciar sesión';
      
      if (axios.isAxiosError(error)) {
        const serverError = error.response?.data as ApiError;
        
        if (serverError?.errors) {
          serverError.errors.forEach((err) => {
            const fieldName = err.path[0];
            setError(fieldName as keyof Inputs, {
              type: 'manual',
              message: err.message
            });
          });
          return;
        }
        
        errorMessage = serverError?.message || 
                      serverError?.error || 
                      error.message || 
                      errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setError('root', {
        type: 'manual',
        message: errorMessage
      });
    }
  };

  const handleOAuthLogin = (url: string) => {
    const redirectUrl = window.location.href;
    const authUrl = `${url}?redirect=${encodeURIComponent(redirectUrl)}`;
    window.location.href = authUrl;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {errors.root && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {errors.root.message}
        </div>
      )}

      <CustomInput
        name="email"
        type="email"
        register={register}
        error={errors["email"]?.message}
        placeholder="tu@ejemplo.com"
        labelText="Email"
        autoComplete="email"
      />
      
      <PasswordInput
        name="password"
        register={register}
        error={errors["password"]?.message}
        autoComplete="current-password"
        showPassword={showPassword} // Pasar prop
        onToggle={togglePasswordVisibility} // Pasar prop
        showButton={true} // Pasar prop
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Iniciar Sesión
      </button>

      <div className="flex justify-center space-x-4">
        <button
          type="button"
          onClick={() => handleOAuthLogin(AuthService.getDiscordAuthUrl())}
          className="flex items-center justify-center w-full bg-[#5865F2] text-white py-2 px-4 rounded-md hover:bg-[#4752C4] focus:outline-none focus:ring-2 focus:ring-[#5865F2] focus:ring-offset-2"
        >
          <FontAwesomeIcon icon={faDiscord} className="w-5 h-5 mr-2" />
          Iniciar con Discord
        </button>

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