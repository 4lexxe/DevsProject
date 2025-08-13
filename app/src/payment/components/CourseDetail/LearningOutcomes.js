import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
const LearningOutcomes = ({ outcomes }) => {
    const [showAll, setShowAll] = useState(false); // Estado para controlar si se muestra todo el contenido
    const maxVisibleItemsMobile = 6; // Número máximo de elementos a mostrar inicialmente en dispositivos móviles
    // Dividir los resultados en dos partes: visibles y ocultos
    const visibleOutcomes = outcomes.slice(0, showAll ? outcomes.length : maxVisibleItemsMobile);
    const hiddenOutcomes = outcomes.slice(maxVisibleItemsMobile);
    // Detectar el modo (móvil o PC) usando useEffect
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setShowAll(true); // En modo PC, mostrar todo el contenido
            }
            else {
                setShowAll(false); // En modo móvil, ocultar el contenido adicional
            }
        };
        // Ejecutar al cargar el componente
        handleResize();
        // Escuchar cambios en el tamaño de la ventana
        window.addEventListener('resize', handleResize);
        // Limpiar el listener al desmontar el componente
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return (_jsxs("section", { className: "bg-white rounded-xl shadow-sm p-6 lg:p-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-6 text-[#1a1f36]", children: "Lo que aprender\u00E1s" }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6", children: [visibleOutcomes.map((outcome, index) => (_jsxs("div", { className: "flex items-start space-x-3 min-w-0", children: [_jsx(CheckCircle2, { className: "w-5 h-5 text-blue-600 mt-1 flex-shrink-0" }), _jsx("p", { className: "text-[#1a1f36] text-sm word-break break-all leading-relaxed min-w-0 flex-1", children: outcome })] }, index))), !showAll && hiddenOutcomes.length > 0 && (_jsx("button", { onClick: () => setShowAll(true), className: "text-blue-600 text-sm font-medium hover:underline focus:outline-none block lg:hidden", children: "Ver m\u00E1s" })), showAll &&
                        hiddenOutcomes.map((outcome, index) => (_jsxs("div", { className: "flex items-start space-x-3 min-w-0", children: [_jsx(CheckCircle2, { className: "w-5 h-5 text-blue-600 mt-1 flex-shrink-0" }), _jsx("p", { className: "text-[#1a1f36] text-sm word-break break-all leading-relaxed min-w-0 flex-1", children: outcome })] }, index + maxVisibleItemsMobile))), showAll && hiddenOutcomes.length > 0 && (_jsx("button", { onClick: () => setShowAll(false), className: "text-red-600 text-sm font-medium hover:underline focus:outline-none block lg:hidden", children: "Cerrar" }))] })] }));
};
export default LearningOutcomes;
