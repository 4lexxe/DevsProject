import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { BookOpen, Map, Library } from 'lucide-react';
import NavLink from './NavLink';
export const NavLinks = ({ onNavigate, isMobile = false }) => {
    const linkItems = [
        { href: '/cursos', icon: BookOpen, label: 'Cursos' },
        { href: '/ruta-aprendizaje', icon: Map, label: 'Ruta de Aprendizaje' },
        { href: '/recursosxd', icon: Library, label: 'Recursos' }
    ];
    const baseClasses = `flex items-center space-x-2 px-4 py-${isMobile ? '3' : '2'} rounded-lg`;
    const hoverClasses = `hover:bg-blue-${isMobile ? '50' : '100'} transition-colors duration-200`;
    return (_jsx(_Fragment, { children: linkItems.map(({ href, icon: Icon, label }) => (_jsxs(NavLink, { href: href, className: `${baseClasses} ${hoverClasses}`, children: [_jsx(Icon, { className: `h-5 w-5 ${isMobile ? 'text-blue-500' : ''}` }), _jsx("span", { children: label })] }, href))) }));
};
