import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import AddResourceButton from '../components/AddResourceButton';
import { AlertCircle } from 'lucide-react'; // Importamos el ícono de Lucide
const ResourceListHeader = () => {
    // Estado para controlar la visibilidad del modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (_jsx("div", { className: "flex flex-col sm:flex-row justify-between items-center gap-3 mb-8", children: _jsxs("div", { className: "flex w-full justify-between items-center", children: [_jsx("h1", { className: "text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600", children: "Recursos Educativos" }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "relative cursor-pointer", onMouseEnter: () => setIsModalOpen(true), onMouseLeave: () => setIsModalOpen(false), children: [_jsx(AlertCircle, { className: "w-5 h-5 text-gray-500" }), isModalOpen && (_jsxs("div", { className: "fixed inset-0 flex items-center justify-center z-50", children: [_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50", onClick: () => setIsModalOpen(false) }), _jsx("div", { className: "relative bg-white p-6 rounded-lg shadow-lg max-w-sm w-full z-10", children: _jsxs("p", { className: "text-gray-700", children: [_jsx("strong", { children: "Recuerda:" }), " Respeta la comunidad de recursos. La publicaci\u00F3n de contenido inapropiado o fuera de lugar puede resultar en la suspensi\u00F3n permanente de tu cuenta."] }) })] }))] }), _jsx(AddResourceButton, {})] })] }) }));
};
export default ResourceListHeader;
