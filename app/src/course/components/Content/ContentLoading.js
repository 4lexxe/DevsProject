import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import TopBar from "./TopBar";
import ContentDetail from "./ContentDetail";
import { getContentById } from "@/course/services/contentServices";
import { accessContent, markContentCompleted } from "@/course/services/progressService";
import { toast } from 'react-hot-toast';
function ContentLoading({ contentId, courseId, }) {
    const [content, setContent] = useState(null);
    useEffect(() => {
        let isMounted = true;
        const fetchContent = async () => {
            if (!contentId)
                return;
            try {
                const data = await getContentById(contentId);
                if (isMounted) {
                    setContent(data);
                }
            }
            catch (err) {
                if (isMounted) {
                    console.error("Error al obtener el contenido:", err);
                }
            }
        };
        const registerContentAccess = async () => {
            try {
                // Registrar acceso al contenido
                await accessContent(parseInt(courseId), parseInt(contentId));
                console.log('Acceso al contenido registrado');
                // Marcar automáticamente como completado
                await markContentCompleted(parseInt(courseId), parseInt(contentId));
                console.log('Contenido marcado como completado automáticamente');
                toast.success('¡Contenido completado!');
            }
            catch (error) {
                console.error('Error al procesar contenido:', error);
            }
        };
        setContent(null);
        fetchContent();
        return () => {
            isMounted = false;
        };
    }, [contentId, courseId]);
    if (!content) {
        return (_jsxs("div", { className: "flex-1 transition-all duration-500 ease-in-out", children: [_jsx("div", { className: "mb-8", children: _jsxs("div", { className: "flex items-center justify-between h-12 px-2 rounded-lg", style: { backgroundColor: "#f2f6f9" }, children: [_jsx("div", { className: "p-2 w-8 h-8" }), _jsx("div", { className: "h-6 w-48 bg-gray-300 rounded animate-pulse" }), _jsx("div", { className: "p-2 w-8 h-8" })] }) }), _jsxs("div", { className: "bg-white rounded-lg shadow-xl overflow-hidden", children: [_jsxs("div", { className: "bg-gradient-to-r from-cyan-600 to-blue-900 p-6 text-white", children: [_jsx("div", { className: "h-10 w-3/4 bg-white bg-opacity-30 rounded animate-pulse mb-4" }), _jsxs("div", { className: "flex items-center text-sm", children: [_jsx("div", { className: "w-4 h-4 mr-2 bg-white bg-opacity-30 rounded animate-pulse" }), _jsx("div", { className: "h-4 w-24 bg-white bg-opacity-30 rounded animate-pulse" })] })] }), _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "space-y-3", children: [_jsx("div", { className: "h-4 w-full bg-gray-200 rounded animate-pulse" }), _jsx("div", { className: "h-4 w-full bg-gray-200 rounded animate-pulse" }), _jsx("div", { className: "h-4 w-3/4 bg-gray-200 rounded animate-pulse" })] }), _jsxs("div", { className: "mb-8 mt-8 bg-gradient-to-r from-cyan-50 to-slate-100 p-6 rounded-xl", children: [_jsx("div", { className: "h-6 w-48 bg-gray-300 rounded animate-pulse mb-3" }), _jsx("div", { className: "h-12 w-40 bg-gradient-to-r from-cyan-600 to-blue-900 rounded-lg animate-pulse" })] }), _jsx("div", { className: "mt-8", children: _jsxs("div", { className: "bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-8", children: [_jsx("div", { className: "h-8 w-48 bg-gray-300 rounded animate-pulse mb-6" }), _jsxs("div", { className: "space-y-3", children: [_jsx("div", { className: "h-4 w-full bg-gray-300 rounded animate-pulse" }), _jsx("div", { className: "h-4 w-3/4 bg-gray-300 rounded animate-pulse" }), _jsx("div", { className: "h-4 w-5/6 bg-gray-300 rounded animate-pulse" })] })] }) })] }), _jsxs("div", { className: "bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 flex justify-between items-center", children: [_jsx("div", { className: "h-4 w-48 bg-gray-300 rounded animate-pulse" }), _jsx("div", { className: "h-10 w-32 bg-gradient-to-r from-cyan-600 to-blue-900 rounded-lg animate-pulse" })] })] })] }));
    }
    return (_jsxs("div", { className: `flex-1 transition-all duration-500 ease-in-out`, children: [_jsx("div", { className: "mb-8", children: _jsx(TopBar, { courseId: courseId, prev: content.previousContentId, next: content.nextContentId, title: content.content.title }) }), _jsx(ContentDetail, { courseId: courseId, content: content.content })] }));
}
export default ContentLoading;
