import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import CourseListItem from "@/course/components/Courses/CourseListItem";
import { Loader2 } from "lucide-react";
export default function CoursesList({ courses }) {
    return (_jsx("section", { className: "py-16 px-6", children: _jsx("div", { className: "max-w-7xl mx-auto", children: _jsx("div", { className: "rounded-xl shadow-sm overflow-hidden", children: courses === null || courses === undefined ? (_jsxs("div", { className: "flex flex-col items-center justify-center p-8", children: [_jsx(Loader2, { className: "w-8 h-8 text-blue-600 animate-spin" }), _jsx("p", { className: "mt-4 text-gray-600", children: "Cargando cursos..." })] })) : courses.length === 0 ? (_jsx("p", { className: "text-center py-8 text-gray-600", children: "No se encontraron cursos." })) : (courses
                    .filter((course) => course.id && course.id !== undefined)
                    .map((course) => (_jsx(CourseListItem, { ...course, categories: course.categories, pricing: course.pricing }, course.id)))) }) }) }));
}
