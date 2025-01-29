import React from "react";
import { useState } from "react";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../validations/registerValidator";

/* Importaciones de los inputs */
import CustomInput from "../inputs/CustomInput";
import TelInput from "../inputs/TelInput";
import PasswordInput from "../inputs/PasswordInputs";
import CheckInput from "../inputs/CheckInput";

type Inputs = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
};

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
