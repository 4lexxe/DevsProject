import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, BookOpen } from 'lucide-react';
import LearningPath from '@/course/components/LearningPath/LearningPath';
import { getCourseProgress } from '@/course/services/progressService';
import Progress from '@/learnroute/components/Progress';
const CourseProgressPage = () => {
    const { courseId } = useParams();
    const [courseProgress, setCourseProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchProgress = async () => {
            if (!courseId)
                return;
            try {
                setLoading(true);
                const progressData = await getCourseProgress(parseInt(courseId));
                setCourseProgress(progressData);
            }
            catch (err) {
                setError('Error al cargar el progreso del curso');
                console.error('Error fetching course progress:', err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchProgress();
    }, [courseId]);
    if (loading) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600", children: "Cargando progreso del curso..." })] }) }));
    }
    if (error || !courseProgress) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-red-600 mb-4", children: error || 'Error al cargar el progreso' }), _jsxs("button", { onClick: () => window.history.back(), className: "text-blue-600 hover:text-blue-800 flex items-center gap-2 mx-auto", children: [_jsx(ArrowLeft, { className: "w-4 h-4" }), "Volver"] })] }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("div", { className: "bg-white shadow-sm border-b", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6", children: [_jsx("div", { className: "flex items-center gap-4 mb-4", children: _jsxs("button", { onClick: () => window.history.back(), className: "text-gray-600 hover:text-gray-800 flex items-center gap-2", children: [_jsx(ArrowLeft, { className: "w-5 h-5" }), "Volver"] }) }), _jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center gap-6", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("img", { src: courseProgress.course.image, alt: courseProgress.course.title, className: "w-24 h-24 lg:w-32 lg:h-32 rounded-lg object-cover" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h1", { className: "text-2xl lg:text-3xl font-bold text-gray-900 mb-2", children: courseProgress.course.title }), _jsx("p", { className: "text-gray-600 mb-4", children: courseProgress.course.summary }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [_jsx("div", { className: "bg-blue-50 rounded-lg p-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center", children: _jsx(CheckCircle, { className: "w-5 h-5 text-blue-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Progreso General" }), _jsxs("p", { className: "text-xl font-bold text-blue-600", children: [courseProgress.progress.percentage, "%"] })] })] }) }), _jsx("div", { className: "bg-green-50 rounded-lg p-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center", children: _jsx(BookOpen, { className: "w-5 h-5 text-green-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Contenido Completado" }), _jsxs("p", { className: "text-xl font-bold text-green-600", children: [courseProgress.progress.completedContent, "/", courseProgress.progress.totalContent] })] })] }) }), _jsx("div", { className: "bg-purple-50 rounded-lg p-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center", children: _jsx(Clock, { className: "w-5 h-5 text-purple-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Tiempo Total" }), _jsxs("p", { className: "text-xl font-bold text-purple-600", children: [Math.round(courseProgress.progress.totalTimeSpent / 60), "h"] })] })] }) })] }), _jsxs("div", { className: "mt-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-sm font-medium text-gray-700", children: "Progreso del curso" }), _jsxs("span", { className: "text-sm text-gray-500", children: [courseProgress.progress.percentage, "%"] })] }), _jsx(Progress, { progress: courseProgress.progress.percentage, color: "blue", className: "h-3" })] })] })] })] }) }), _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: _jsx(LearningPath, { courseId: parseInt(courseId) }) })] }));
};
export default CourseProgressPage;
