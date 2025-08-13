import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ExternalLink } from 'lucide-react';
const ResourceUrlInput = ({ url, onChange, error }) => {
    return (_jsxs("div", { children: [_jsx("label", { htmlFor: "url", className: "block text-sm font-medium text-gray-700", children: "URL *" }), _jsxs("div", { className: "relative mt-1 rounded-md shadow-sm", children: [_jsx("input", { type: "text", id: "url", name: "url", value: url, onChange: onChange, className: "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" }), url && (_jsx("button", { type: "button", onClick: () => window.open(url, '_blank'), className: "absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600", children: _jsx(ExternalLink, { className: "w-5 h-5" }) }))] }), error && _jsx("p", { className: "text-red-500 text-sm mt-1", children: error })] }));
};
export default ResourceUrlInput;
