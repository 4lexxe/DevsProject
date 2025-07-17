import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchemaZod, registerSchemaZod, type FormInputLoginZod, type FormInputRegisterZod } from './type';

// Ejemplo de uso con react-hook-form para Login
export const useLoginForm = () => {
  return useForm<FormInputLoginZod>({
    resolver: zodResolver(loginSchemaZod),
    mode: 'onChange', // Valida mientras el usuario escribe
    defaultValues: {
      email: '',
      password: ''
    }
  });
};

// Ejemplo de uso con react-hook-form para Register
export const useRegisterForm = () => {
  return useForm<FormInputRegisterZod>({
    resolver: zodResolver(registerSchemaZod),
    mode: 'onChange', // Valida mientras el usuario escribe
    defaultValues: {
      username: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      checkbox: false
    }
  });
};

// Función helper para manejar errores de validación asíncrona
export const handleAsyncValidationError = (error: unknown) => {
  if (error && typeof error === 'object' && 'code' in error && error.code === 'custom' && 'message' in error) {
    // Error de validación asíncrona (como email no encontrado)
    return String(error.message);
  }
  return 'Error de validación';
};

// Tipos para los formularios
export type LoginFormData = FormInputLoginZod;
export type RegisterFormData = FormInputRegisterZod;
