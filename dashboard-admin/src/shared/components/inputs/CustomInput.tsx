import React from "react";
import type { UseFormRegister } from "react-hook-form";

// Definimos la interfaz base con todas las props estándar del input
interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    name: string;
    labelText?: string;
    error?: string;
    register: UseFormRegister<any>;
    disabled?: boolean;
}

// Versión específica para los inputs de tipo "number"
interface NumberInputProps extends BaseInputProps {
    type: "number";
    min?: number;
    max?: number;
    step?: number;
}

// Versión general para los demás tipos de input
interface DefaultInputProps extends BaseInputProps {
    type?: Exclude<React.HTMLInputTypeAttribute, "number">;
}

// Combinamos ambas interfaces en un tipo flexible
type CustomInputProps = NumberInputProps | DefaultInputProps;

const CustomInput: React.FC<CustomInputProps> = ({
    name,
    type = "text",
    labelText = name,
    error,
    register,
    disabled,
    ...rest
    }: CustomInputProps) => {
    return (
        <div>
            <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-700 mb-1"
            >
                {labelText}
            </label>

            <input
                id={name}
                type={type}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                    error
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300'
                }`}
                // Usamos `setValueAs` dinámicamente si el tipo es "number"
                {...register(name, {
                    ...(type === "number" && {
                        setValueAs: (value): number => (value === "" ? 0 : Number(value)),
                    }),
                })}
                // Pasamos el resto de las props específicas según el tipo
                {...(type === "number" ? (rest as NumberInputProps) : (rest as DefaultInputProps))}

                disabled={disabled}
            />

            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
};

export default CustomInput;