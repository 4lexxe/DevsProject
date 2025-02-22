import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from 'axios';
import { Github } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { registerSchema } from "../../validations/registerValidator";
import { useAuth } from '../../contexts/AuthContext';
import AuthService from "../../services/auth.service";

import CustomInput from "@/shared/components/inputs/CustomInput";
import TelInput from "@/auth/components/inputs/TelInput";
import PasswordInput from "@/shared/components/inputs/PasswordInput";
import CheckInput from "@/shared/components/inputs/CheckInput";

type Inputs = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
};

interface ApiError {
  message?: string;
  error?: string;
  errors?: Array<{
    path: string[];
    message: string;
  }>;
}

export default function RegisterForm() {
  const navigate = useNavigate();
  const { register: registerUser, login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(registerSchema),
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleOAuthLogin = (url: string) => {
    const redirectUrl = window.location.href;
    const authUrl = `${url}?redirect=${encodeURIComponent(redirectUrl)}`;
    window.location.href = authUrl;
  };

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        name: data.name.trim(),
        username: data.name
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '_'),
      });

      await login(data.email, data.password);
      navigate('/');
    } catch (err: unknown) {
      let errorMessage = 'Error al registrarse';
      
      if (axios.isAxiosError(err)) {
        const serverError = err.response?.data as ApiError;
        
        if (serverError?.errors) {
          serverError.errors.forEach((error) => {
            const fieldName = error.path[0];
            setError(fieldName as keyof Inputs, {
              type: 'manual',
              message: error.message
            });
          });
          return;
        }
        
        errorMessage = serverError?.message || 
                      serverError?.error || 
                      err.message || 
                      errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError('root', {
        type: 'manual',
        message: errorMessage
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errors.root && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {errors.root.message}
        </div>
      )}

      <CustomInput
        name="name"
        type="text"
        register={register}
        error={errors.name?.message}
        labelText="Nombre"
        autoComplete="name"
        maxLength={20}
      />

      <CustomInput
        name="email"
        type="email"
        register={register}
        error={errors.email?.message}
        labelText="Email"
        autoComplete="email"
      />

      <TelInput
        name="phone"
        register={register}
        error={errors.phone?.message}
      />

      <PasswordInput
        name="password"
        register={register}
        error={errors.password?.message}
        showPassword={showPassword}
        onToggle={togglePasswordVisibility}
        showButton={true}
        autoComplete="new-password"
      />

      <PasswordInput
        name="confirmPassword"
        register={register}
        error={errors.confirmPassword?.message}
        showPassword={showPassword}
        showButton={false}
        autoComplete="new-password"
      />

      <CheckInput
        name="acceptTerms"
        labelText="Acepto los términos y condiciones"
        register={register}
        error={errors.acceptTerms?.message}
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Registrarse
      </button>

      <div className="flex justify-center space-x-4 mt-6">
        <button
          type="button"
          onClick={() => handleOAuthLogin(AuthService.getDiscordAuthUrl())}
          className="flex items-center justify-center w-full bg-[#5865F2] text-white py-2 px-4 rounded-md hover:bg-[#4752C4] focus:outline-none focus:ring-2 focus:ring-[#5865F2] focus:ring-offset-2"
        >
          <FontAwesomeIcon icon={faDiscord} className="w-5 h-5 mr-2" />
          Registrarse con Discord
        </button>

        <button
          type="button"
          onClick={() => handleOAuthLogin(AuthService.getGithubAuthUrl())}
          className="flex items-center justify-center w-full bg-[#171515] text-white py-2 px-4 rounded-md hover:bg-[#0D0C0C] focus:outline-none focus:ring-2 focus:ring-[#171515] focus:ring-offset-2"
        >
          <Github className="w-5 h-5 mr-2" />
          Registrarse con GitHub
        </button>
      </div>
    </form>
  );
}