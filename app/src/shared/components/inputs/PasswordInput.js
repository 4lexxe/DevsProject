import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { EyeIcon, EyeOffIcon } from "lucide-react";
const PasswordInput = ({ name, labelText = "Contraseña", register, error, placeholder, showPassword = false, onToggle, showButton = true }) => {
    return (_jsxs("div", { children: [_jsx("label", { htmlFor: name, className: "block text-sm font-medium text-gray-700 mb-1", children: labelText }), _jsxs("div", { className: "relative", children: [_jsx("input", { id: name, type: showPassword ? "text" : "password", placeholder: placeholder, className: `w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${error
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300'}`, ...register(name), autoComplete: name === "password" ? "new-password" : "current-password" }), showButton && (_jsx("button", { type: "button", className: "absolute inset-y-0 right-0 pr-3 flex items-center", onClick: onToggle, "aria-label": showPassword ? "Ocultar contraseña" : "Mostrar contraseña", children: showPassword ? (_jsx(EyeOffIcon, { className: "h-5 w-5 text-gray-400" })) : (_jsx(EyeIcon, { className: "h-5 w-5 text-gray-400" })) })), error && _jsx("p", { className: "mt-1 text-xs text-red-500", children: error })] })] }));
};
export default PasswordInput;
