import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface QuizCustomSelectProps {
  id: string;
  label: string;
  options: readonly string[];
  register: UseFormRegisterReturn;
  error?: string;
}

const QuizCustomSelect: React.FC<QuizCustomSelectProps> = ({
  id,
  label,
  options,
  register,
  error,
}) => {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={id}
        {...register}
        className={`w-full px-3 py-2 border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md focus:outline-none focus:ring-2 ${
          error ? "focus:ring-red-500" : "focus:ring-blue-500"
        }`}
      >
        {Array.from(options).map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default QuizCustomSelect;
