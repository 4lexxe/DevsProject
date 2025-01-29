import React from 'react';
import {UseFormRegister, FieldErrors} from 'react-hook-form';


const changeStyle = (campo: string | undefined): string => {
  return campo
    ? "focus:ring-red-500 focus:border-red-500"
    : "focus:ring-blue-500 focus:border-blue-500";
};

interface TextInputProps {
  name: string; 
  type: string;
  labelText?: string;
  label?: string;
  value?: string;
  placeholder?: string;
  error?: string | undefined;
  register: UseFormRegister<any>;
}

const CustomInput: React.FC<TextInputProps> = ({
  name, 
  type,
  labelText,
  label = name,
  value,
  error,
  placeholder = '',
  register,
}) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {labelText || label}
      </label>
      <input
        id={name}
        type={type} 
        value={value}
        placeholder={placeholder}
        className=
        {`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 ${changeStyle(error)} `}
        {...register(name)}
      />  
    
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default CustomInput;
