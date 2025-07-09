import React from "react";
import ArgentinaFlag from "@/shared/assets/imgs/ArgentinaFlag.png";
import { UseFormRegister } from "react-hook-form";

const changeStyle = (campo: string | undefined): string => {
  return campo
    ? "focus:ring-red-500 focus:border-red-500"
    : "focus:ring-blue-500 focus:border-blue-500";
};

interface TextInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  error?: string | undefined;
  register: UseFormRegister<any>;
}

const TelInput: React.FC<TextInputProps> = ({
  name,
  label = name,
  error,
  placeholder = "9 1234 5678",
  register,
}) => {
  return (
    <div>
      <label
        htmlFor={label}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Celular
      </label>
      <div className="flex">
        <div className="flex items-center justify-evenly bg-gray-100 border border-r-0 border-gray-300 rounded-l-md px-3">
          <img
            src={ArgentinaFlag}
            alt="ArgentinaFlag"
            className="w-1/3 h-auto"
          />
          <span className="text-gray-500">+54</span>
        </div>
        <input
          id={name}
          type="tel"
          placeholder={placeholder}
          className=
          {`flex-1 px-3 py-2 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-2 ${changeStyle(error)} `}
          {...register(name)}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default TelInput;
