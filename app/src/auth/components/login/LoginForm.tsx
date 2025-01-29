import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../validations/loginValidator";

import CustomInput from "../inputs/CustomInput";
import PasswordInput from "../inputs/PasswordInputs";

type Inputs = {
  email: string;
  password: string;
};

export default function LForm() {
  const {
    register,
    handleSubmit /* , watch */,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
    console.log(data);
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
    </form>
  );
}
