import React from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

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
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={id} className="text-sm font-semibold text-gray-700">
        {label}
      </label>
      <select
        id={id}
        {...register}
        className={`w-full px-4 py-2.5 border transition-all duration-200 ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
          error ? "focus:ring-red-500/20" : "focus:ring-blue-500/20"
        } focus:border-${error ? "red" : "blue"}-500 bg-white`}
      >
        {Array.from(options).map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default QuizCustomSelect;