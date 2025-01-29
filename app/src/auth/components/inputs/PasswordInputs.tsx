import { EyeIcon, EyeOffIcon } from "lucide-react";
import type React from "react";
import { useState } from "react";
import type { UseFormRegister, FieldError } from "react-hook-form";
import { useEffect } from "react";

interface PasswordInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  error?: string | undefined;
  register: UseFormRegister<any>;
}

const changeStyle = (campo: string | undefined): string => {
  return campo
    ? "focus:ring-red-500 focus:border-red-500"
    : "focus:ring-blue-500 focus:border-blue-500";
};

const PasswordInput: React.FC<PasswordInputProps> = ({
  name,
  label = name,
  register,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div>
      <label
        htmlFor={label}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Contraseña
      </label>
      <div className="relative">
        <input
          id={name}
          type={showPassword ? "text" : "password"}
          className=
          {`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 ${changeStyle(error)}
          `}
          {...register(name)}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOffIcon className="h-5 w-5 text-gray-400" />
          ) : (
            <EyeIcon className="h-5 w-5 text-gray-400" />
          )}
        </button>

        {error && (<p className="mt-1 text-xs text-red-500">{error}</p>)}
      </div>
    </div>
  );
};

export default PasswordInput;
