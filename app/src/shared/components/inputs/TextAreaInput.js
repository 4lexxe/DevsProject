import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const TextAreaInput = ({ name, labelText, register, error, placeholder, arrayValue = false, rows = 3 }) => {
    return (_jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: name, className: "block text-sm font-medium text-gray-700", children: labelText }), _jsx("textarea", { id: name, ...register(name, {
                    setValueAs: (value) => arrayValue ? (value === "" ? [] : value.split("\n")) : value
                }), rows: rows, placeholder: placeholder, className: `w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${error
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300'}` }), error && (_jsx("p", { className: "text-sm text-red-600", children: error }))] }));
};
export default TextAreaInput;
