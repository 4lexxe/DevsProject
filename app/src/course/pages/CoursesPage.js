import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import CoursesList from "../components/courses/CoursesList";
import { getCourses } from "../services/courseServices";
import { getCoursesByCategory } from "@/home/services/categoriesService";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
export default function CoursesPage({ activeByCategory = false }) {
    const { categoryId } = useParams();
    const [courses, setCourses] = useState([]);
    const fetchCourses = async () => {
        try {
            const data = await getCourses();
            setCourses(data);
        }
        catch (error) {
            console.error("No se pudieron cargar los cursos", error);
        }
    };
    const fetchCoursesByCategory = async () => {
        if (categoryId) {
            try {
                const data = await getCoursesByCategory(categoryId);
                setCourses(data);
            }
            catch (error) {
                console.error("No se pudo obtener los cursos por categoria: ", error);
            }
        }
    };
    useEffect(() => {
        if (activeByCategory) {
            fetchCoursesByCategory();
        }
        else {
            fetchCourses();
        }
    }, [activeByCategory]);
    return (_jsx("div", { className: "min-h-screen bg-gray-50", children: _jsxs("div", { className: "max-w-5xl mx-auto", children: [_jsx("div", { className: "px-4 py-6 md:py-8 border-b border-gray-200", children: _jsx("div", { className: "flex items-center justify-between", children: _jsx("h1", { className: "text-xl md:text-2xl font-semibold text-gray-900", children: "Todos los Cursos" }) }) }), _jsx("div", { className: "pb-20", children: _jsx(CoursesList, { courses: courses }) })] }) }));
}
;
