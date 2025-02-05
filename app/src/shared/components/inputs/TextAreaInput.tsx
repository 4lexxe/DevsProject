import React from 'react';
import { UseFormRegister } from 'react-hook-form';

interface TextAreaInputProps {
  name: string;
  labelText: string;
  error?: string;
  placeholder?: string;
  rows?: number;
  arrayValue?: boolean;
  register: UseFormRegister<any>;
}

const TextAreaInput: React.FC<TextAreaInputProps> = ({
  name,
  labelText,
  register,
  error, 
  placeholder,
  arrayValue = false,
  rows = 3
}: TextAreaInputProps) => {

    return (
    <div className="space-y-1">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700"
      >
        {labelText}
      </label>
      <textarea
        id={name}

        {...register(name, {
            ...(arrayValue === true && {
                setValueAs: (value:string): string[] => (value === "" ? [] : value.split("\n")),
            })

        })}
        rows={rows}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-300'
        }`}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

export default TextAreaInput;