import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LogIn, UserPlus } from 'lucide-react';
import AuthButton from '../../buttons/AuthButton';
export const AuthSection = ({ onNavigate, isMobile = false }) => {
    const containerClasses = isMobile
        ? "flex flex-col space-y-3 px-4"
        : "flex items-center space-x-4";
    return (_jsxs("div", { className: containerClasses, children: [_jsxs(AuthButton, { variant: "secondary", fullWidth: isMobile, href: "/login", className: `flex items-center ${isMobile ? 'justify-center' : ''} space-x-2 px-6 py-${isMobile ? '3' : '2.5'} rounded-lg hover:bg-blue-100 transition-all duration-200`, onClick: onNavigate, children: [_jsx(LogIn, { className: "h-5 w-5" }), _jsx("span", { children: "Iniciar Sesi\u00F3n" })] }), _jsxs(AuthButton, { variant: "primary", fullWidth: isMobile, href: "/register", className: `flex items-center ${isMobile ? 'justify-center' : ''} space-x-2 px-6 py-${isMobile ? '3' : '2.5'} rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 shadow-md hover:shadow-lg`, onClick: onNavigate, children: [_jsx(UserPlus, { className: "h-5 w-5" }), _jsx("span", { children: "Registrarse" })] })] }));
};
