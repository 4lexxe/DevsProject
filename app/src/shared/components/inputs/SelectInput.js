import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function SelectInput({ name, labelText, register, error, options, placeholder }) {
    return (_jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: name, className: "block text-sm font-medium text-gray-700", children: labelText }), _jsxs("select", { id: name, ...register(name), className: `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${error
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300'}`, defaultValue: "", children: [placeholder && (_jsx("option", { value: "", disabled: true, children: placeholder })), options.map((option) => (_jsx("option", { value: option.value, children: option.label }, option.value)))] }), error && (_jsx("p", { className: "text-sm text-red-600", children: error }))] }));
}
