import React from "react";
import { UseFormRegister } from "react-hook-form";

interface TextInputProps {
  name: string;
  label?: string;
  error?: string | undefined;
  register: UseFormRegister<any>;
}
const CheckInput: React.FC<TextInputProps> = ({
  name,
  label = name,
  error,
  register,
}) => {
  return (
    <div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id={name}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
          {...register("acceptTerms")}
        />
        <label htmlFor={label} className="text-sm text-gray-600">
          Acepto los términos y condiciones
        </label>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default CheckInput;
