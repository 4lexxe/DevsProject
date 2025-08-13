import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const CheckInput = ({ name, labelText = name, error, register, }) => {
    return (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", id: name, className: "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded", ...register(name) }), _jsx("label", { htmlFor: name, className: "text-sm text-gray-600", children: labelText })] }), error && _jsx("p", { className: "mt-1 text-xs text-red-500", children: error })] }));
};
export default CheckInput;
