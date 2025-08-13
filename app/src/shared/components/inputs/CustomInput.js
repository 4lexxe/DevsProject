import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const CustomInput = ({ name, type = "text", labelText = name, error, register, disabled, ...rest }) => {
    return (_jsxs("div", { children: [_jsx("label", { htmlFor: name, className: "block text-sm font-medium text-gray-700 mb-1", children: labelText }), _jsx("input", { id: name, type: type, className: `w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${error
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300'}`, ...register(name, {
                    ...(type === "number" && {
                        setValueAs: (value) => (value === "" ? 0 : Number(value)),
                    }),
                }), ...(type === "number" ? rest : rest), disabled: disabled }), error && _jsx("p", { className: "mt-1 text-xs text-red-500", children: error })] }));
};
export default CustomInput;
