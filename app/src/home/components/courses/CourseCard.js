import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { GraduationCap, ArrowRight, DollarSign, Percent } from "lucide-react";
import { useNavigate } from "react-router-dom";
const CourseCard = ({ id, title, summary, image, careerType, pricing, }) => {
    console.log('🎯 CourseCard recibió props - id:', id, 'tipo:', typeof id, 'title:', title);
    const navigate = useNavigate();
    const handleViewCourse = () => {
        console.log('🔍 handleViewCourse - id:', id, 'tipo:', typeof id);
        if (id && id !== undefined) {
            console.log('✅ Navegando a /course/' + id);
            navigate(`/course/${id}`);
        }
        else {
            console.error('❌ ID del curso no válido:', id);
        }
    };
    return (_jsxs(motion.div, { whileHover: { y: -6, scale: 1.01 }, transition: { duration: 0.2 }, className: "relative w-full max-w-sm mx-auto bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200", children: [_jsxs("div", { className: "relative h-48 overflow-hidden", children: [_jsx("img", { src: image || "/placeholder.svg", alt: title, className: "w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" }), _jsxs("div", { className: "absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-gray-700 shadow-md flex items-center gap-2", children: [_jsx(GraduationCap, { className: "w-3.5 h-3.5 text-blue-600" }), careerType] }), pricing?.hasDiscount && pricing.activeDiscount && (_jsxs("div", { className: "absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-lg", children: [_jsx(Percent, { className: "w-3 h-3" }), pricing.activeDiscount.percentage, "% OFF"] }))] }), _jsxs("div", { className: "p-5 space-y-4", children: [_jsx("h3", { className: "text-xl font-bold text-gray-900 line-clamp-2 leading-tight", children: title }), _jsx("p", { className: "text-sm text-gray-600 line-clamp-2 leading-relaxed", children: summary }), pricing && (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(DollarSign, { className: "w-4 h-4 text-green-600" }), pricing.isFree ? (_jsx("span", { className: "text-lg font-bold text-green-600", children: "GRATIS" })) : pricing.hasDiscount ? (_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "text-lg font-bold text-green-600", children: ["$", pricing.finalPrice.toFixed(2)] }), _jsxs("span", { className: "text-sm line-through text-gray-400", children: ["$", pricing.originalPrice.toFixed(2)] })] })) : (_jsxs("span", { className: "text-lg font-bold text-green-600", children: ["$", pricing.finalPrice.toFixed(2)] }))] }), pricing.hasDiscount && pricing.savings > 0 && !pricing.isFree && (_jsxs("div", { className: "text-xs text-green-600 font-medium", children: ["Ahorras $", pricing.savings.toFixed(2)] })), pricing.isFree && pricing.hasDiscount && (_jsx("div", { className: "text-xs text-green-600 font-medium", children: "\u00A1Curso completamente gratuito!" }))] })), _jsxs(motion.button, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, onClick: handleViewCourse, className: "w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg", children: ["Ver curso", _jsx(ArrowRight, { className: "w-4 h-4" })] })] })] }));
};
export default CourseCard;
