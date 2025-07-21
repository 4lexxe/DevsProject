import React from 'react';
import type { UseFormRegister } from 'react-hook-form';

interface Option {
  value: string;
  label: string;
}

interface SelectInputProps {
  name: string;
  labelText: string;
  register: UseFormRegister<any>;
  error?: string;
  options: Option[];
  placeholder?: string;
}

export default function SelectInput({
  name,
  labelText,
  register,
  error,
  options,
  placeholder
}: SelectInputProps) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700"
      >
        {labelText}
      </label>
      <select
        id={name}
        {...register(name)}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300'
        }`}

        defaultValue=""
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option: Option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}