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
    hideSpinners?: boolean; // Nueva prop para ocultar las flechitas
}

// Versión general para los demás tipos de input
interface DefaultInputProps extends BaseInputProps {
    type?: Exclude<React.HTMLInputTypeAttribute, "number">;
    hideSpinners?: never; // No aplicable para otros tipos
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
    hideSpinners,
    ...rest
    }: CustomInputProps) => {
    
    // Estilos para ocultar las flechitas de los inputs numéricos
    const spinnerStyles = type === "number" && hideSpinners ? {
        MozAppearance: "textfield" as const,
        // Para navegadores WebKit, necesitamos usar CSS
    } : {};

    // Clase CSS adicional para ocultar spinners en WebKit
    const webkitSpinnerClass = type === "number" && hideSpinners 
        ? "hide-number-spinners" 
        : "";

    return (
        <>
            {/* Agregamos CSS inline solo cuando es necesario */}
            {type === "number" && hideSpinners && (
                <style>{`
                    .hide-number-spinners::-webkit-outer-spin-button,
                    .hide-number-spinners::-webkit-inner-spin-button {
                        -webkit-appearance: none;
                        margin: 0;
                    }
                `}</style>
            )}
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
                style={spinnerStyles}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${webkitSpinnerClass} ${
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
                // Aplicamos todas las props específicas del tipo
                {...rest}
                disabled={disabled}
            />

            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
        </>
    );
};

export default CustomInput;