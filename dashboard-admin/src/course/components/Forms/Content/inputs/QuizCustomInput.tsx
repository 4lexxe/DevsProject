import React from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface CustomInputProps {
  id: string;
  label: string;
  type?: string;
  register: UseFormRegisterReturn;
  error?: string;
}

const QuizCustomInput: React.FC<CustomInputProps> = ({
  id,
  label,
  type = "text",
  register,
  error,
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={id} className="text-sm font-semibold text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        {...register}
        className={`w-full px-4 py-2.5 border transition-all duration-200 ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
          error ? "focus:ring-red-500/20" : "focus:ring-blue-500/20"
        } focus:border-${error ? "red" : "blue"}-500`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default QuizCustomInput;