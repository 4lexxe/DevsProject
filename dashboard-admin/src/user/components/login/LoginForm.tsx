import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import type { SubmitHandler } from "react-hook-form";
import { motion } from 'framer-motion';
import type { FormInputLoginZod } from '../../lib/type';
import { loginSchemaZod } from '../../lib/type';
import AuthService from '../../services/auth.service';
import axios from 'axios';
import FontelloIcon from '../../../shared/components/icons/FontelloIcon';

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

  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Email Field */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 dark:text-gray-400 mb-2">
          Email
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FontelloIcon
              name="icon-mail"
              className="text-lg text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors"
              fallback={
                <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />
          </div>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="w-full pl-12 pr-4 py-3.5 bg-white/5 dark:bg-gray-700/50 border border-gray-600/50 dark:border-gray-600 rounded-xl text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 backdrop-blur-sm"
            placeholder="tu@email.com"
            required
          />
        </div>
        {errors.email && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-xs mt-1.5 flex items-center gap-1"
          >
            <FontelloIcon
              name="icon-attention"
              className="text-xs"
              fallback={
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            {errors.email.message}
          </motion.p>
        )}
      </motion.div>

      {/* Password Field */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <label htmlFor="password" className="block text-sm font-medium text-gray-300 dark:text-gray-400 mb-2">
          Contraseña
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FontelloIcon
              name="icon-lock"
              className="text-lg text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors"
              fallback={
                <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />
          </div>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            className="w-full pl-12 pr-12 py-3.5 bg-white/5 dark:bg-gray-700/50 border border-gray-600/50 dark:border-gray-600 rounded-xl text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 backdrop-blur-sm"
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-300 dark:hover:text-gray-300 transition-colors"
          >
            <FontelloIcon
              name={showPassword ? 'icon-eye-off' : 'icon-eye'}
              className="text-lg"
              fallback={
                showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0L7.05 7.05m-1.76 1.76L3 3m3.29 3.29l3.29 3.29" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )
              }
            />
          </button>
        </div>
        {errors.password && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-xs mt-1.5 flex items-center gap-1"
          >
            <FontelloIcon
              name="icon-attention"
              className="text-xs"
              fallback={
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            {errors.password.message}
          </motion.p>
        )}
      </motion.div>

      {/* Remember me y Forgot password */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-between text-sm"
      >
        <label className="flex items-center gap-2 text-gray-400 dark:text-gray-500 cursor-pointer group">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-gray-600 bg-white/5 dark:bg-gray-700/50 text-blue-500 focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
          />
          <span className="group-hover:text-gray-300 dark:group-hover:text-gray-400 transition-colors">
            Recordarme
          </span>
        </label>
        <a
          href="#"
          className="text-blue-400 dark:text-blue-400 hover:text-blue-300 dark:hover:text-blue-300 transition-colors"
        >
          ¿Olvidaste tu contraseña?
        </a>
      </motion.div>

      {/* Error general */}
      {errors.root && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2"
        >
          <FontelloIcon
            name="icon-attention"
            className="text-base flex-shrink-0"
            fallback={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <span>{errors.root.message}</span>
        </motion.div>
      )}

      {/* Submit Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            <span>Iniciando sesión...</span>
          </>
        ) : (
          <>
            <span>Iniciar Sesión</span>
            <FontelloIcon
              name="icon-right-open"
              className="text-lg"
              fallback={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              }
            />
          </>
        )}
      </motion.button>
    </form>
  );
}
