import { EyeIcon, EyeOffIcon } from "lucide-react";
import type React from "react";
import type { UseFormRegister } from "react-hook-form";

interface PasswordInputProps {
  name: string;
  labelText?: string;
  placeholder?: string;
  error?: string | undefined;
  register: UseFormRegister<any>;
  showPassword?: boolean;
  onToggle?: () => void;
  showButton?: boolean;
  autoComplete?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  name,
  labelText = "Contraseña",
  register,
  error,
  placeholder,
  showPassword = false,
  onToggle,
  showButton = true
}) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {labelText}
      </label>
      <div className="relative">
        <input
          id={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300'
          }`}
          {...register(name)}
          autoComplete={name === "password" ? "new-password" : "current-password"}
        />
        {showButton && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={onToggle}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? (
              <EyeOffIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        )}

        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default PasswordInput;