import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation } from "react-router-dom";
export default function NavLink({ href, children, icon, className = "" }) {
    const location = useLocation();
    const isActive = location.pathname === href;
    return (_jsxs(Link, { to: href, className: `inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${isActive
            ? 'text-blue-600 bg-blue-50'
            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'} ${className}`, children: [icon && _jsx("span", { className: "mr-2 flex-shrink-0", children: icon }), _jsx("span", { children: children })] }));
}
