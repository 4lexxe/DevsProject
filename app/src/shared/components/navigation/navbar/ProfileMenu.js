import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from 'react';
import { User, Settings, LogOut } from 'lucide-react';
import { useClickOutside } from '../../../hooks/useClickOutside';
export const ProfileMenu = ({ user, isOpen, setIsOpen, onLogout, onNavigate, isMobile = false, }) => {
    const menuRef = useRef(null);
    useClickOutside(menuRef, () => setIsOpen(false), isOpen);
    if (isMobile) {
        return (_jsxs("div", { className: "px-4 space-y-3", children: [_jsxs("div", { className: "flex items-center px-4", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("img", { src: user.avatar ||
                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`, alt: user.name, className: "h-12 w-12 rounded-full border-2 border-blue-400" }) }), _jsxs("div", { className: "ml-3", children: [_jsx("div", { className: "text-base font-medium text-gray-800", children: user.name }), user.email && _jsx("div", { className: "text-sm font-medium text-gray-500", children: user.email })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(ProfileMenuItem, { href: "/profile", icon: User, label: "Perfil", onClick: onNavigate, isMobile: true }), _jsx(ProfileMenuItem, { href: "/settings", icon: Settings, label: "Configuraci\u00F3n", onClick: onNavigate, isMobile: true }), _jsx(ProfileMenuItem, { icon: LogOut, label: "Cerrar sesi\u00F3n", onClick: onLogout, isMobile: true, isLogout: true })] })] }));
    }
    return (_jsxs("div", { className: "relative", ref: menuRef, children: [_jsxs("button", { onClick: () => setIsOpen(!isOpen), className: "flex items-center space-x-3 p-2 rounded-lg hover:bg-blue-100 transition-colors duration-200 focus:outline-none", children: [_jsx("span", { className: "text-sm font-medium", children: user.name }), _jsx("img", { src: user.avatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`, alt: user.name, className: "h-10 w-10 rounded-full object-cover border-2 border-blue-400 transition-transform duration-200 hover:scale-105" })] }), isOpen && (_jsx("div", { className: "absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 transform transition-all duration-200", children: _jsxs("div", { className: "py-1", role: "menu", children: [_jsx(ProfileMenuItem, { href: "/profile", icon: User, label: "Perfil", onClick: onNavigate }), _jsx(ProfileMenuItem, { href: "/settings", icon: Settings, label: "Configuraci\u00F3n", onClick: onNavigate }), _jsx(ProfileMenuItem, { icon: LogOut, label: "Cerrar sesi\u00F3n", onClick: onLogout, isLogout: true })] }) }))] }));
};
const ProfileMenuItem = ({ href, icon: Icon, label, onClick, isMobile, isLogout }) => {
    const baseClasses = `flex items-center ${isMobile ? 'px-4 py-3 text-base' : 'px-4 py-3 text-sm'} text-gray-700`;
    const hoverClasses = `hover:bg-${isLogout ? 'red' : 'blue'}-50 transition-colors duration-200`;
    const Component = href ? 'a' : 'button';
    const props = {
        ...(href ? { href } : {}),
        className: `${baseClasses} ${hoverClasses} ${!href ? 'w-full' : ''}`,
        onClick,
    };
    return (_jsxs(Component, { ...props, children: [_jsx(Icon, { className: `mr-3 h-4 w-4 ${isLogout ? 'text-red-500' : 'text-blue-500'}` }), label] }));
};
