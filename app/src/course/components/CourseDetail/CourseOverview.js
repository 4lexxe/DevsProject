import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Clock, BookOpen, Code } from 'lucide-react';
const CourseOverview = ({ about, careerType, numberOfModules, createdAt, }) => {
    // Formateamos la fecha de creación a 'día mes año'
    const formattedDate = new Date(createdAt).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    return (_jsxs("section", { className: "bg-white rounded-xl shadow-sm p-6 mb-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Descripci\u00F3n del Curso" }), _jsx("p", { className: "text-gray-600 mb-6 break-words overflow-wrap-anywhere leading-relaxed", children: about }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Code, { className: "w-5 h-5 text-blue-600" }), _jsx("span", { children: careerType })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(BookOpen, { className: "w-5 h-5 text-blue-600" }), _jsxs("span", { children: [numberOfModules, " m\u00F3dulos"] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Clock, { className: "w-5 h-5 text-blue-600" }), _jsx("span", { children: formattedDate })] })] })] }));
};
export default CourseOverview;
