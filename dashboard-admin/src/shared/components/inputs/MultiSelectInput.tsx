import React, { useEffect, useState } from "react";
import type { Control } from "react-hook-form";
import { useController } from "react-hook-form";
import { Loader2, X } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectInputProps {
  name: string;
  labelText: string;
  control: Control<any>;
  error?: string;
  options: Option[];
  placeholder?: string;
  isLoading?: boolean;
}

export default function MultiSelectInput({
  name,
  labelText,
  control,
  error,
  options,
  placeholder,
  isLoading = false,
}: MultiSelectInputProps) {
  const {
    field: { onChange, value },
  } = useController({
    name,
    control,
  });

  // Convierte el valor recibido (string[]) a la lista de opciones seleccionadas
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);

  useEffect(() => {
    if (Array.isArray(value)) {
      const selected = options.filter((option) => value.includes(option.value));
      setSelectedOptions(selected);
    }
  }, [value, options]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    const selectedOption = options.find((option) => option.value === selectedValue);

    if (selectedOption && !selectedOptions.some((option) => option.value === selectedValue)) {
      const newSelectedOptions = [...selectedOptions, selectedOption];
      setSelectedOptions(newSelectedOptions);
      onChange(newSelectedOptions.map((option) => option.value));
    }
  };

  const removeOption = (optionToRemove: Option) => {
    const newSelectedOptions = selectedOptions.filter((option) => option.value !== optionToRemove.value);
    setSelectedOptions(newSelectedOptions);
    onChange(newSelectedOptions.map((option) => option.value));
  };

  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {labelText}
      </label>
      <div className="relative">
        <select
          id={name}
          onChange={handleSelectChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
            error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300"
          } ${isLoading ? "text-gray-400" : ""}`}
          disabled={isLoading}
          value=""
        >
          <option value="" disabled>
            {placeholder || "Select options"}
          </option>
          {options.map((option: Option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {isLoading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
          </div>
        )}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {selectedOptions.map((option) => (
          <div
            key={option.value}
            className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full flex items-center"
          >
            {option.label}
            <button
              type="button"
              onClick={() => removeOption(option)}
              className="ml-1.5 text-blue-600 hover:text-blue-800 focus:outline-none"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
