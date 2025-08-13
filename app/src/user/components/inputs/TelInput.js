import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import ArgentinaFlag from "@/shared/assets/imgs/ArgentinaFlag.png";
const changeStyle = (campo) => {
    return campo
        ? "focus:ring-red-500 focus:border-red-500"
        : "focus:ring-blue-500 focus:border-blue-500";
};
const TelInput = ({ name, label = name, error, placeholder = "9 1234 5678", register, }) => {
    return (_jsxs("div", { children: [_jsx("label", { htmlFor: label, className: "block text-sm font-medium text-gray-700 mb-1", children: "Celular" }), _jsxs("div", { className: "flex", children: [_jsxs("div", { className: "flex items-center justify-evenly bg-gray-100 border border-r-0 border-gray-300 rounded-l-md px-3", children: [_jsx("img", { src: ArgentinaFlag, alt: "ArgentinaFlag", className: "w-1/3 h-auto" }), _jsx("span", { className: "text-gray-500", children: "+54" })] }), _jsx("input", { id: name, type: "tel", placeholder: placeholder, className: `flex-1 px-3 py-2 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-2 ${changeStyle(error)} `, ...register(name) })] }), error && _jsx("p", { className: "mt-1 text-xs text-red-500", children: error })] }));
};
export default TelInput;
