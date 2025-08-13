import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// components/courses/SectionList.tsx
import { useEffect, useState } from "react";
import { getSectionsByCourse } from "../../services/sectionServices";
import SectionModule from "./SectionModule";
const SectionList = ({ courseId }) => {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchSections = async () => {
            try {
                setLoading(true);
                const response = await getSectionsByCourse(courseId);
                setSections(response);
            }
            catch (err) {
                console.error("Error fetching sections:", err);
                setError("No se pudieron cargar las secciones del curso");
            }
            finally {
                setLoading(false);
            }
        };
        fetchSections();
    }, [courseId]);
    if (loading) {
        return (_jsx("div", { className: "space-y-4", children: [1, 2, 3].map((n) => (_jsxs("div", { className: "animate-pulse", children: [_jsx("div", { className: "h-24 bg-gray-200 rounded-t-lg" }), _jsxs("div", { className: "p-6 bg-white rounded-b-lg border border-gray-100", children: [_jsx("div", { className: "h-4 bg-gray-200 rounded w-1/4 mb-4" }), _jsx("div", { className: "h-6 bg-gray-200 rounded w-3/4 mb-4" }), _jsx("div", { className: "h-4 bg-gray-200 rounded w-full mb-4" }), _jsx("div", { className: "h-4 bg-gray-200 rounded w-full" })] })] }, n))) }));
    }
    if (error) {
        return (_jsx("div", { className: "text-center py-8", children: _jsx("p", { className: "text-red-500", children: error }) }));
    }
    if (sections.length === 0) {
        return (_jsx("div", { className: "text-center py-8", children: _jsx("p", { className: "text-gray-500", children: "No hay secciones disponibles para este curso." }) }));
    }
    return (_jsx("div", { children: _jsx("div", { className: "grid grid-cols-1 gap-4", children: sections.map((section) => (_jsx("div", { children: _jsx(SectionModule, { section: section }) }, section.id))) }) }));
};
export default SectionList;
