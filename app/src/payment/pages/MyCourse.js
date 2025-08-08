import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HeroCourse from "@/payment/components/CourseDetail/HeroCourse";
import CourseOverview from "@/payment/components/CourseDetail/CourseOverview";
import LearningOutcomes from "@/payment/components/CourseDetail/LearningOutcomes";
import Prerequisites from "@/payment/components/CourseDetail/Prerequisites";
import SectionList from "@/payment/components/CourseDetail/SectionList";
import { courseService } from "@/payment/services/courseService";
const CourseDetails = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [moduleCount, setModuleCount] = useState(0);
    useEffect(() => {
        const fetchCourseData = async () => {
            if (id) {
                try {
                    setLoading(true);
                    const course = await courseService.getCourseById(id);
                    if (course) {
                        setCourse(course);
                        const count = course.sections.length;
                        setModuleCount(count);
                    }
                    else {
                        setError("Curso no encontrado.");
                    }
                }
                catch (err) {
                    console.error("Error al cargar el curso:", err);
                    setError("Hubo un error al cargar los datos del curso.");
                }
                finally {
                    setLoading(false);
                }
            }
        };
        fetchCourseData();
    }, [id]);
    if (loading) {
        return _jsx("p", { className: "p-6 text-blue-500", children: "Cargando curso..." });
    }
    if (error) {
        return _jsx("p", { className: "p-6 text-red-500", children: error });
    }
    if (!course) {
        return _jsx("p", { className: "p-6 text-red-500", children: "Curso no encontrado." });
    }
    return (_jsxs("div", { children: [_jsx("div", { className: "w-full", children: _jsx(HeroCourse, { title: course.title, description: course.summary, image: course.image, categories: course.categories, courseId: id, progress: course.progress, status: course.status }) }), _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsxs("div", { className: "lg:col-span-1 lg:order-2 flex flex-col space-y-6", children: [course.prerequisites && course.prerequisites.length > 0 && (_jsx("div", { className: "border border-gray-200 rounded-lg p-6 bg-white shadow-sm", children: _jsx(Prerequisites, { prerequisites: course.prerequisites }) })), _jsx("div", { className: "border border-gray-200 rounded-lg p-6 bg-white shadow-sm", children: _jsx(LearningOutcomes, { outcomes: course.learningOutcomes }) })] }), _jsxs("div", { className: "lg:col-span-2 lg:order-1", children: [_jsx(CourseOverview, { about: course.about, careerType: course.careerType?.name || 'Sin categoría', numberOfModules: moduleCount, createdAt: course.createdAt }), _jsx("div", { className: "flex items-center justify-between mb-6 mt-8", children: _jsx("div", { className: "flex items-center gap-4", children: _jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "M\u00F3dulos del Curso" }) }) }), _jsx("div", { className: "mt-6", children: _jsx(SectionList, { courseId: id || "" }) })] })] }) })] }));
};
export default CourseDetails;
