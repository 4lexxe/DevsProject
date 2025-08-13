import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import SideNavigation from "./SideNavigation";
import { getNavegationById } from "@/course/services/courseServices";
function SideNavigationLoading({ contentId, courseId, sidebarExpanded, setSidebarExpanded, }) {
    const [navigate, setNavigate] = useState(null);
    useEffect(() => {
        const fetchNavegation = async () => {
            if (!courseId)
                return; // Evita hacer la petición si no hay un ID válido
            try {
                const data = await getNavegationById(courseId);
                setNavigate(data);
            }
            catch (err) {
                console.error("Error al obtener la navegacion:", err);
            }
        };
        fetchNavegation();
    }, [courseId]);
    if (!navigate) {
        return (_jsx("div", { className: `transition-all duration-500 ease-in-out rounded-lg md:w-1/3 lg:w-1/4 h-full hidden md:block `, style: { backgroundColor: "#f2f6f9" }, children: _jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "flex items-center gap-2 mb-6", children: [_jsx("div", { className: "w-8 h-8 bg-gray-300 rounded animate-pulse" }), _jsx("div", { className: "h-6 w-32 bg-gray-300 rounded animate-pulse" })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "rounded-lg bg-gray-100 p-2", children: [_jsx("div", { className: "h-6 w-24 bg-gray-300 rounded mb-3 animate-pulse" }), [1, 2, 3].map((item) => (_jsx("div", { className: "flex items-center gap-2 p-2 mb-2", children: _jsx("div", { className: "h-4 w-full bg-gray-300 rounded animate-pulse" }) }, item)))] }), _jsxs("div", { className: "rounded-lg bg-gray-100 p-2", children: [_jsx("div", { className: "h-6 w-32 bg-gray-300 rounded mb-3 animate-pulse" }), [1, 2].map((item) => (_jsx("div", { className: "flex items-center gap-2 p-2 mb-2", children: _jsx("div", { className: "h-4 w-full bg-gray-300 rounded animate-pulse" }) }, item)))] })] })] }) }));
    }
    return (_jsx("div", { className: `transition-all duration-500 ease-in-out rounded-lg mt-0 h-full hidden md:block ${sidebarExpanded ? "md:w-1/3 lg:w-1/4" : "md:w-16"}`, style: { backgroundColor: "#f2f6f9" }, children: _jsx(SideNavigation, { currentId: contentId, navigate: navigate, isExpanded: sidebarExpanded, setIsExpanded: setSidebarExpanded }) }));
}
export default SideNavigationLoading;
