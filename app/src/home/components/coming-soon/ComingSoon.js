import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { ComingSoonCard } from "./ComingSoonCard";
import { getCourses } from "../../../course/services/courseServices";
import { Sparkles } from 'lucide-react';
export function ComingSoon() {
    // Inicializar estados
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        // Obtener y procesar cursos
        const fetchCourses = async () => {
            try {
                const data = await getCourses();
                const sortedCourses = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                const inDevelopmentCourses = sortedCourses
                    .filter((course) => course.isInDevelopment)
                    .slice(0, 5);
                setCourses(inDevelopmentCourses);
            }
            catch (err) {
                setError("Failed to load courses");
                console.error("Error loading courses:", err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);
    // Renderizar encabezado
    const Header = () => (_jsxs("div", { className: "flex items-center gap-3 mb-8", children: [_jsx("div", { className: "bg-gray-100 p-2 rounded-lg", children: _jsx(Sparkles, { className: "w-6 h-6 text-gray-600" }) }), _jsx("h2", { className: "text-2xl font-bold text-gray-800", children: "Pr\u00F3ximamente" })] }));
    // Mostrar estado de carga
    if (loading) {
        return (_jsxs("section", { className: "container mx-auto px-6 py-12", children: [_jsx(Header, {}), _jsx("div", { className: "flex items-center justify-center min-h-[300px]", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-gray-600" }) })] }));
    }
    // Mostrar estado de error
    if (error) {
        return (_jsxs("section", { className: "container mx-auto px-6 py-12", children: [_jsx(Header, {}), _jsx("div", { className: "bg-red-50 border border-red-200 rounded-lg p-6 text-center", children: _jsx("p", { className: "text-red-600", children: error }) })] }));
    }
    // Mostrar estado sin cursos
    if (courses.length === 0) {
        return (_jsxs("section", { className: "container mx-auto px-6 py-12", children: [_jsx(Header, {}), _jsx("div", { className: "bg-gray-50 border border-gray-200 rounded-lg p-8 text-center", children: _jsx("p", { className: "text-gray-600", children: "No courses in development at the moment." }) })] }));
    }
    // Renderizar lista de cursos
    return (_jsxs("section", { className: "container mx-auto px-6 py-12", children: [_jsx(Header, {}), _jsx("div", { className: "grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3", children: courses.map((course, index) => {
                    // Renderizar tarjeta principal
                    if (index === 0) {
                        return (_jsx("div", { className: "md:col-span-2 lg:col-span-2 h-full", children: _jsx(ComingSoonCard, { aspectRatio: "landscape", title: course.title, category: course.category, careerType: course.careerType[0]?.name || 'Sin categoría', imageUrl: course.image, className: "hover:shadow-2xl" }) }, course.id));
                    }
                    // Renderizar tarjetas verticales
                    if ((index - 1) % 3 === 0) {
                        return (_jsx(ComingSoonCard, { aspectRatio: "portrait", title: course.title, category: course.category, careerType: course.careerType[0]?.name || 'Sin categoría', imageUrl: course.image }, course.id));
                    }
                    // Renderizar tarjetas cuadradas
                    return (_jsx(ComingSoonCard, { title: course.title, category: course.category, careerType: course.careerType[0]?.name || 'Sin categoría', imageUrl: course.image }, course.id));
                }) })] }));
}
