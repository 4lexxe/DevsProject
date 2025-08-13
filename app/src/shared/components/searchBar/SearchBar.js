import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Search } from "lucide-react";
export default function SearchBar({ searchQuery, setSearchQuery, handleSearch, placeholder }) {
    return (_jsxs("form", { onSubmit: handleSearch, className: "relative", children: [_jsx("input", { type: "text", placeholder: placeholder || "Buscar cursos, recursos...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full px-5 py-2.5 rounded-full border border-blue-200 bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md" }), _jsx("button", { type: "submit", className: "absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-blue-50 rounded-full transition-colors duration-200", children: _jsx(Search, { className: "h-5 w-5 text-blue-500" }) })] }));
}
