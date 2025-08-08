import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, CheckSquare, Square, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCourseProgress, markContentCompleted } from '@/course/services/progressService';
import { toast } from 'react-hot-toast';
const LearningPath = ({ courseId }) => {
    const [courseProgress, setCourseProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedSections, setExpandedSections] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchProgress = async () => {
            try {
                setLoading(true);
                const progressData = await getCourseProgress(courseId);
                setCourseProgress(progressData);
            }
            catch (error) {
                console.error('Error al cargar progreso:', error);
                toast.error('Error al cargar el progreso del curso');
            }
            finally {
                setLoading(false);
            }
        };
        fetchProgress();
    }, [courseId]);
    const toggleSection = (sectionId) => {
        setExpandedSections(current => current.includes(sectionId)
            ? current.filter(id => id !== sectionId)
            : [...current, sectionId]);
    };
    const handleContentClick = (contentId) => {
        navigate(`/course/${courseId}/section/content/${contentId}`);
    };
    const toggleCompletion = async (contentId, isCompleted) => {
        if (isCompleted) {
            toast('Este contenido ya está completado');
            return;
        }
        try {
            await markContentCompleted(courseId, contentId);
            toast.success('Contenido marcado como completado');
            // Refrescar el progreso
            const updatedProgress = await getCourseProgress(courseId);
            setCourseProgress(updatedProgress);
        }
        catch (error) {
            console.error('Error al marcar como completado:', error);
            toast.error('Error al marcar como completado');
        }
    };
    if (loading) {
        return (_jsx("div", { className: "bg-gray-50 py-16 px-4", children: _jsx("div", { className: "max-w-4xl mx-auto", children: _jsxs("div", { className: "animate-pulse space-y-6", children: [_jsx("div", { className: "h-8 bg-gray-300 rounded w-1/3" }), _jsx("div", { className: "space-y-4", children: [1, 2, 3].map(i => (_jsxs("div", { className: "bg-white rounded-lg p-6", children: [_jsx("div", { className: "h-6 bg-gray-300 rounded w-1/2 mb-4" }), _jsx("div", { className: "h-4 bg-gray-200 rounded w-3/4" })] }, i))) })] }) }) }));
    }
    if (!courseProgress) {
        return (_jsx("div", { className: "bg-gray-50 py-16 px-4", children: _jsx("div", { className: "max-w-4xl mx-auto text-center", children: _jsx("p", { className: "text-gray-600", children: "No se pudo cargar el progreso del curso" }) }) }));
    }
    return (_jsx("div", { className: "bg-gray-50 py-16 px-4", children: _jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsxs("div", { className: "mb-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Contenido del Curso" }), _jsxs("span", { className: "text-sm font-medium text-gray-500", children: [courseProgress.progress.completedContent, " de ", courseProgress.progress.totalContent, " completados"] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-3 mb-4", children: _jsx("div", { className: "bg-blue-600 h-3 rounded-full transition-all duration-300", style: { width: `${courseProgress.progress.percentage}%` } }) }), _jsxs("p", { className: "text-gray-600", children: ["Progreso general: ", courseProgress.progress.percentage, "%"] })] }), _jsx("div", { className: "space-y-6", children: courseProgress.sections.map((section) => {
                        const isExpanded = expandedSections.includes(section.id.toString());
                        const sectionCompleted = section.progress === 100;
                        return (_jsxs("div", { className: `border rounded-lg transition-colors ${sectionCompleted ? "bg-green-50/50 border-green-100" : "bg-white"}`, children: [_jsxs("div", { className: "flex items-center p-4 cursor-pointer", onClick: () => toggleSection(section.id.toString()), children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h3", { className: "font-medium text-lg", children: section.title }), _jsxs("span", { className: "text-sm text-gray-500", children: [section.completedContent, "/", section.totalContent, " completados"] })] }), _jsx("p", { className: "text-sm text-gray-600 mb-2", children: section.description }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("span", { className: "inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs", children: section.moduleType }), _jsx("div", { className: "flex-1 bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-blue-600 h-2 rounded-full transition-all duration-300", style: { width: `${section.progress}%` } }) }), _jsxs("span", { className: "text-sm font-medium text-gray-700", children: [section.progress, "%"] })] })] }), _jsx("button", { className: "ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors", children: isExpanded ? _jsx(ChevronDown, { className: "h-5 w-5" }) : _jsx(ChevronRight, { className: "h-5 w-5" }) })] }), isExpanded && (_jsx("div", { className: "px-4 pb-4 pt-0", children: _jsx("div", { className: "pl-4 space-y-3", children: section.contents.map((content) => {
                                            return (_jsxs("div", { className: `flex items-center p-3 rounded-lg border transition-colors ${content.isCompleted
                                                    ? "bg-green-50 border-green-200"
                                                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"}`, children: [_jsx("button", { className: "h-6 w-6 mr-3 flex items-center justify-center", onClick: () => toggleCompletion(content.id, content.isCompleted), children: content.isCompleted ? (_jsx(CheckSquare, { className: "h-4 w-4 text-green-600" })) : (_jsx(Square, { className: "h-4 w-4 text-gray-400" })) }), _jsxs("div", { className: "flex-1 cursor-pointer", onClick: () => handleContentClick(content.id), children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h4", { className: "font-medium text-sm", children: content.title }), _jsxs("div", { className: "flex items-center gap-2 text-xs text-gray-500", children: [_jsx(Clock, { className: "w-3 h-3" }), _jsxs("span", { children: [content.duration, " min"] }), content.timeSpent > 0 && (_jsxs("span", { children: ["\u2022 ", content.timeSpent, " min gastados"] }))] })] }), content.completedAt && (_jsxs("p", { className: "text-xs text-green-600 mt-1", children: ["Completado el ", new Date(content.completedAt).toLocaleDateString()] }))] })] }, content.id));
                                        }) }) }))] }, section.id));
                    }) })] }) }));
};
export default LearningPath;
