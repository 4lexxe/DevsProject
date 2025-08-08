"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Play, CheckCircle, Clock, Award, GraduationCap, ArrowLeft } from "lucide-react";
import { courseService } from "../services";
import { useAuth } from "@/user/contexts/AuthContext";
export default function MyCoursesPage() {
    const [courses, setCourses] = useState([]);
    const [coursesLoading, setCoursesLoading] = useState(true);
    const { user, loading: authLoading } = useAuth();
    useEffect(() => {
        if (user) {
            loadUserCourses();
        }
    }, [user]);
    const loadUserCourses = async () => {
        if (!user)
            return;
        try {
            const userCourses = await courseService.getUserCourses(user.id.toString());
            setCourses(userCourses);
        }
        catch (error) {
            console.error('Error loading user courses:', error);
        }
        finally {
            setCoursesLoading(false);
        }
    };
    const getProgressColor = (progress) => {
        if (progress >= 100)
            return "#16a34a"; // Green for completed
        if (progress >= 70)
            return "#eab308"; // Yellow for almost complete
        if (progress >= 30)
            return "#f97316"; // Orange for in progress
        return "#6b7280"; // Gray for just started
    };
    const getStatusBadge = (progress) => {
        if (progress >= 100) {
            return {
                text: "Completado",
                icon: _jsx(CheckCircle, { className: "h-4 w-4" }),
                style: {
                    backgroundColor: "#dcfce7",
                    color: "#166534",
                    border: "1px solid #bbf7d0"
                }
            };
        }
        if (progress > 0) {
            return {
                text: "En progreso",
                icon: _jsx(Clock, { className: "h-4 w-4" }),
                style: {
                    backgroundColor: "#fef3c7",
                    color: "#92400e",
                    border: "1px solid #fde68a"
                }
            };
        }
        return {
            text: "No iniciado",
            icon: _jsx(Play, { className: "h-4 w-4" }),
            style: {
                backgroundColor: "#f3f4f6",
                color: "#374151",
                border: "1px solid #d1d5db"
            }
        };
    };
    // Verificaciones condicionales después de todos los hooks
    if (authLoading) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600" }), _jsx("p", { className: "mt-4 text-gray-600", children: "Verificando autenticaci\u00F3n..." })] }) }));
    }
    if (!user) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    if (coursesLoading) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600" }), _jsx("p", { className: "mt-4 text-gray-600", children: "Cargando tus cursos..." })] }) }));
    }
    return (_jsx("div", { className: "min-h-screen bg-gray-50 py-8", children: _jsxs("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsx("div", { className: "mb-8", children: _jsxs(Link, { to: "/dashboard", className: "inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:opacity-80 transition-opacity", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), "Volver al Dashboard"] }) }), _jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-2", children: "Mis Cursos" }), _jsx("p", { className: "text-gray-600", children: "Contin\u00FAa tu aprendizaje donde lo dejaste" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8", children: [_jsx("div", { className: "border-2 rounded-lg shadow-sm bg-white", style: { borderColor: "#42d7c7" }, children: _jsxs("div", { className: "p-6 text-center", children: [_jsx("div", { className: "text-3xl font-bold mb-2", style: { color: "#1d4ed8" }, children: courses.length }), _jsx("div", { className: "text-sm text-gray-600", children: "Cursos Totales" })] }) }), _jsx("div", { className: "border-2 rounded-lg shadow-sm bg-white", style: { borderColor: "#42d7c7" }, children: _jsxs("div", { className: "p-6 text-center", children: [_jsx("div", { className: "text-3xl font-bold mb-2", style: { color: "#16a34a" }, children: courses.filter(course => course.progress >= 100).length }), _jsx("div", { className: "text-sm text-gray-600", children: "Completados" })] }) }), _jsx("div", { className: "border-2 rounded-lg shadow-sm bg-white", style: { borderColor: "#42d7c7" }, children: _jsxs("div", { className: "p-6 text-center", children: [_jsx("div", { className: "text-3xl font-bold mb-2", style: { color: "#f97316" }, children: courses.filter(course => course.progress > 0 && course.progress < 100).length }), _jsx("div", { className: "text-sm text-gray-600", children: "En Progreso" })] }) })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: courses.map((course) => {
                        const statusBadge = getStatusBadge(course.progress);
                        return (_jsxs("div", { className: "border-2 rounded-lg shadow-sm bg-white transition-shadow hover:shadow-lg overflow-hidden", style: { borderColor: "#42d7c7" }, children: [course.imageUrl ? (_jsx("img", { src: course.imageUrl, alt: course.title, className: "w-full h-48 object-cover" })) : (_jsx("div", { className: "w-full h-48 flex items-center justify-center", style: { backgroundColor: "#e0f2fe" }, children: _jsx(GraduationCap, { className: "h-16 w-16", style: { color: "#1d4ed8" } }) })), _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "mb-4", children: [_jsxs("div", { className: "flex items-start justify-between mb-2", children: [_jsx(Link, { className: "font-bold text-lg text-gray-900 line-clamp-2", to: `/my-course/${course.id}`, children: course.title }), _jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ml-2 flex-shrink-0", style: statusBadge.style, children: [statusBadge.icon, statusBadge.text] })] }), course.description && (_jsx("p", { className: "text-sm text-gray-600 line-clamp-2", children: course.description }))] }), _jsxs("div", { className: "mb-4", children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsx("span", { className: "text-sm font-medium text-gray-700", children: "Progreso" }), _jsxs("span", { className: "text-sm font-medium", style: { color: getProgressColor(course.progress) }, children: [course.progress, "%"] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "h-2 rounded-full transition-all duration-300", style: {
                                                            width: `${course.progress}%`,
                                                            backgroundColor: getProgressColor(course.progress)
                                                        } }) })] }), _jsx("div", { className: "grid grid-cols-1 gap-4 mb-4 text-sm text-gray-600", children: _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Play, { className: "h-4 w-4" }), _jsx("span", { children: "M\u00F3dulos" })] }) }), _jsx("div", { className: "flex gap-2", children: _jsxs(Link, { to: `/my-course/${course.id}`, className: "flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white font-medium transition-colors", style: { backgroundColor: "#1d4ed8" }, onMouseOver: (e) => e.currentTarget.style.backgroundColor = "#1e40af", onMouseOut: (e) => e.currentTarget.style.backgroundColor = "#1d4ed8", children: [_jsx(Play, { className: "h-4 w-4" }), course.progress > 0 ? 'Continuar' : 'Comenzar'] }) }), _jsx("div", { className: "mt-4 pt-4 border-t border-gray-200", children: _jsxs("p", { className: "text-xs text-gray-500", children: ["Acceso concedido el ", new Date(course.grantedAt).toLocaleDateString('es-ES', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })] }) })] })] }, course.id));
                    }) }), courses.length === 0 && (_jsxs("div", { className: "text-center py-12", children: [_jsx(GraduationCap, { className: "h-16 w-16 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-xl font-medium text-gray-900 mb-2", children: "No tienes cursos a\u00FAn" }), _jsx("p", { className: "text-gray-600 mb-6", children: "Explora nuestro cat\u00E1logo y comienza tu journey de aprendizaje" }), _jsxs(Link, { to: "/courses", className: "inline-flex items-center gap-2 px-6 py-3 rounded-md text-white font-medium transition-colors", style: { backgroundColor: "#1d4ed8" }, onMouseOver: (e) => e.currentTarget.style.backgroundColor = "#1e40af", onMouseOut: (e) => e.currentTarget.style.backgroundColor = "#1d4ed8", children: [_jsx(Award, { className: "h-5 w-5" }), "Explorar Cursos"] })] }))] }) }));
}
