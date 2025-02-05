import React from "react";
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../validations/registerValidator";
import { useAuth } from '../../contexts/AuthContext';

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

export default function RegisterForm() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        name: data.name,
        username: data.name.toLowerCase().replace(/\s+/g, '_'), // Crear username a partir del nombre
      });
      navigate('/'); // Redirigir al inicio después del registro exitoso
    } catch (err: any) {
      setError('root', {
        type: 'manual',
        message: err.response?.data?.message || 'Error al registrarse'
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
        error={errors["name"]?.message}
        labelText="Nombre"
      />
      <CustomInput
        name="email"
        type="email"
        register={register}
        error={errors["email"]?.message}
        labelText="Email"
      />
      <TelInput
        name="phone"
        register={register}
        error={errors["phone"]?.message}
      />

      <PasswordInput
        name="password"
        register={register}
        error={errors["password"]?.message}
      />

      <PasswordInput
        name="confirmPassword"
        register={register}
        error={errors["confirmPassword"]?.message}
      />

      <CheckInput
        name="acceptTerms"
        labelText="Acepto los términos y condiciones"
        register={register}
        error={errors["acceptTerms"]?.message}
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Registrarse
      </button>
    </form>
  );
}