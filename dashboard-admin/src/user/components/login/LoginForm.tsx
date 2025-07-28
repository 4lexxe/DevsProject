import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import type { SubmitHandler } from "react-hook-form";
import type { FormInputLoginZod } from '../../lib/type';
import { loginSchemaZod } from '../../lib/type';
import AuthService from '../../services/auth.service';
import axios from 'axios';

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, setError, formState: { errors } } = useForm<FormInputLoginZod>({
    resolver: zodResolver(loginSchemaZod),
    mode: 'onSubmit', // Cambiado de 'onChange' a 'onSubmit'
  });
  // const navigate = useNavigate(); // No se usa actualmente

  // Tipos para errores de validación
  type ValidationError = { path: string[]; message: string };
  type ServerError = { errors?: ValidationError[]; message?: string; error?: string };
  
  const onSubmit: SubmitHandler<FormInputLoginZod> = async (data) => {
    setIsLoading(true);
    try {
      const response = await AuthService.login(data);
      if (response.token) {
        // Si AuthService.setToken no existe, comentar la línea siguiente y dejar nota:
        // AuthService.setToken(response.token);
        window.location.href = "/";
      }
    } catch (error: unknown) {
      let errorMessage = 'Error al iniciar sesión';
      if (axios.isAxiosError(error)) {
        const serverError = error.response?.data as ServerError;
        if (serverError?.errors) {
          serverError.errors.forEach((err) => {
            const fieldName = err.path[0];
            setError(fieldName as keyof FormInputLoginZod, {
              type: 'manual',
              message: err.message
            });
          });
          setIsLoading(false);
          return;
        }
        errorMessage = serverError?.message || 
                      serverError?.error || 
                      errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError('root', {
        type: 'manual',
        message: errorMessage
      });
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
          Super Admin Email
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="root@mysite.com"
          required
        />
        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
          Super Admin Password
        </label>
        <input
          id="password"
          type="password"
          {...register('password')}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="••••••••"
          required
        />
        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
      </div>

      {errors.root && <p className="text-red-400 text-xs mt-1">{errors.root.message}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Signing in as Super Admin...
          </div>
        ) : (
          'Sign in as Super Admin'
        )}
      </button>
    </form>
  );
}
