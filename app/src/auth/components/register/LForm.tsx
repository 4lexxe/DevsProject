import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../validations/loginValidator";
import { useAuth } from '../../contexts/AuthContext';

import CustomInput from "../inputs/CustomInput";
import PasswordInput from "../inputs/PasswordInputs";

type Inputs = {
  email: string;
  password: string;
};

export default function LForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    try {
      await login(data.email, data.password);
      navigate('/'); // Redirigir al inicio después del login exitoso
    } catch (err: any) {
      setError('root', {
        type: 'manual',
        message: err.response?.data?.message || 'Error al iniciar sesión'
      });
    }
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