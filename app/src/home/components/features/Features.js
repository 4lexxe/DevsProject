import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AcademicCapIcon, UsersIcon, ShoppingCartIcon } from '@heroicons/react/outline';
const features = [
    {
        id: 1,
        title: 'Organiza Tus Materias',
        description: 'Accede a tus cursos, materiales y recursos en un solo lugar.',
        icon: _jsx(AcademicCapIcon, { className: "h-6 w-6 text-blue-500 mx-auto" }),
    },
    {
        id: 2,
        title: 'Comunidad Activa',
        description: 'Encuentra apuntes compartidos por estudiantes de todo el país.',
        icon: _jsx(UsersIcon, { className: "h-6 w-6 text-blue-500 mx-auto" }),
    },
    {
        id: 3,
        title: 'Compra y Venta de Materiales',
        description: 'Vende o compra libros, apuntes y herramientas que necesitas.',
        icon: _jsx(ShoppingCartIcon, { className: "h-6 w-6 text-blue-500 mx-auto" }),
    },
];
export default function Features() {
    return (_jsx("section", { className: "px-2 sm:px-4 py-6 sm:py-8 bg-[#FFFF]", children: _jsx("div", { className: "max-w-3xl mx-auto text-center", children: _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6", children: features.map((feature) => (_jsxs("div", { className: "bg-white p-4 sm:p-5 rounded-lg shadow-md transition-transform hover:scale-105", children: [_jsx("div", { className: "flex justify-center mb-2", children: feature.icon }), _jsx("h3", { className: "text-base sm:text-lg font-semibold text-black text-center", children: feature.title }), _jsx("p", { className: "mt-1 text-xs sm:text-sm text-black/80 text-center", children: feature.description })] }, feature.id))) }) }) }));
}
