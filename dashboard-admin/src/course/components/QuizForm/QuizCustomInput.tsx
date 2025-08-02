import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface CustomInputProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  register: UseFormRegisterReturn;
  error?: string;
  isTextarea?: boolean;
}

const QuizCustomInput: React.FC<CustomInputProps> = ({
  id,
  label,
  type = "text",
  placeholder,
  register,
  error,
  isTextarea = false,
  ...rest
}) => {
  const autoResize = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  const handleTextareaInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    autoResize(e.currentTarget);
    // Llamar al onChange del register si existe
    if (register.onChange) {
      register.onChange(e);
    }
  };
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={id} className="text-sm font-semibold text-gray-700">
        {label}
      </label>
      {isTextarea ? (
        <textarea
          id={id}
          placeholder={placeholder}
          {...register}
          onInput={handleTextareaInput}
          rows={1}
          className={`w-full px-4 py-2.5 border transition-all duration-200 ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
            error
              ? "focus:ring-red-200 focus:border-red-500"
              : "focus:ring-blue-200 focus:border-blue-500"
          } hover:border-gray-400 resize-none overflow-hidden min-h-[42px]`}
        />
      ) : (
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          {...register}
          className={`w-full px-4 py-2.5 border transition-all duration-200 ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
            error
              ? "focus:ring-red-200 focus:border-red-500"
              : "focus:ring-blue-200 focus:border-blue-500"
          } hover:border-gray-400`}
          {...rest}
        />
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default QuizCustomInput;