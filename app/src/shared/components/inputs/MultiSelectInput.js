import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useController } from "react-hook-form";
import { Loader2, X } from "lucide-react";
export default function MultiSelectInput({ name, labelText, control, error, options, placeholder, isLoading = false, }) {
    const { field: { onChange, value }, } = useController({
        name,
        control,
    });
    // Convierte el valor recibido (string[]) a la lista de opciones seleccionadas
    const [selectedOptions, setSelectedOptions] = useState([]);
    useEffect(() => {
        if (Array.isArray(value)) {
            const selected = options.filter((option) => value.includes(option.value));
            setSelectedOptions(selected);
        }
    }, [value, options]);
    const handleSelectChange = (e) => {
        const selectedValue = e.target.value;
        const selectedOption = options.find((option) => option.value === selectedValue);
        if (selectedOption && !selectedOptions.some((option) => option.value === selectedValue)) {
            const newSelectedOptions = [...selectedOptions, selectedOption];
            setSelectedOptions(newSelectedOptions);
            onChange(newSelectedOptions.map((option) => option.value));
        }
    };
    const removeOption = (optionToRemove) => {
        const newSelectedOptions = selectedOptions.filter((option) => option.value !== optionToRemove.value);
        setSelectedOptions(newSelectedOptions);
        onChange(newSelectedOptions.map((option) => option.value));
    };
    return (_jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: name, className: "block text-sm font-medium text-gray-700", children: labelText }), _jsxs("div", { className: "relative", children: [_jsxs("select", { id: name, onChange: handleSelectChange, className: `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300"} ${isLoading ? "text-gray-400" : ""}`, disabled: isLoading, value: "", children: [_jsx("option", { value: "", disabled: true, children: placeholder || "Select options" }), options.map((option) => (_jsx("option", { value: option.value, children: option.label }, option.value)))] }), isLoading && (_jsx("div", { className: "absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none", children: _jsx(Loader2, { className: "w-6 h-6 text-gray-400 animate-spin" }) }))] }), _jsx("div", { className: "mt-2 flex flex-wrap gap-2", children: selectedOptions.map((option) => (_jsxs("div", { className: "bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full flex items-center", children: [option.label, _jsx("button", { type: "button", onClick: () => removeOption(option), className: "ml-1.5 text-blue-600 hover:text-blue-800 focus:outline-none", children: _jsx(X, { className: "w-4 h-4" }) })] }, option.value))) }), error && _jsx("p", { className: "text-sm text-red-600", children: error })] }));
}
