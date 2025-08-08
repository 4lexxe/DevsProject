import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
const Prerequisites = ({ prerequisites }) => {
    const [showAll, setShowAll] = useState(false); // Estado para controlar si se muestra todo el contenido
    const maxVisibleItemsMobile = 6; // Número máximo de elementos a mostrar inicialmente en dispositivos móviles
    // Dividir los resultados en dos partes: visibles y ocultos
    const visiblePrerequisites = prerequisites.slice(0, showAll ? prerequisites.length : maxVisibleItemsMobile);
    const hiddenPrerequisites = prerequisites.slice(maxVisibleItemsMobile);
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
        window.addEventListener("resize", handleResize);
        // Limpiar el listener al desmontar el componente
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return (_jsxs("section", { className: "bg-white rounded-xl shadow-sm p-6 lg:p-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-6 text-[#1a1f36]", children: "Pre-requisitos del curso" }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6", children: [visiblePrerequisites.map((prerequisite, index) => (_jsxs("div", { className: "flex items-start space-x-3", children: [_jsx(BookOpen, { className: "w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" }), _jsx("p", { className: "text-[#1a1f36] text-sm", children: prerequisite })] }, index))), !showAll && hiddenPrerequisites.length > 0 && (_jsx("button", { onClick: () => setShowAll(true), className: "text-blue-600 text-sm font-medium hover:underline focus:outline-none block lg:hidden", children: "Ver m\u00E1s" })), showAll &&
                        hiddenPrerequisites.map((prerequisite, index) => (_jsxs("div", { className: "flex items-start space-x-3", children: [_jsx(BookOpen, { className: "w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" }), _jsx("p", { className: "text-[#1a1f36] text-sm", children: prerequisite })] }, index + maxVisibleItemsMobile))), showAll && hiddenPrerequisites.length > 0 && (_jsx("button", { onClick: () => setShowAll(false), className: "text-red-600 text-sm font-medium hover:underline focus:outline-none block lg:hidden", children: "Cerrar" }))] })] }));
};
export default Prerequisites;
