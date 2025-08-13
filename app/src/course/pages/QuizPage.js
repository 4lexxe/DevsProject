import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { QuizProvider, useQuiz } from "../contexts/QuizContext";
import QuizComponent from "../components/Quiz/PaginationQuiz";
// Función para transformar los datos del backend al formato que espera el componente
const transformQuizData = (backendQuiz) => {
    return backendQuiz.map(quiz => ({
        id: quiz.id.toString(),
        question: quiz.question,
        text: quiz.text || "",
        image: quiz.image || "",
        type: quiz.type,
        answers: quiz.answers.map((answer) => ({
            answer: answer.text, // Mapear 'text' a 'answer'
            isCorrect: answer.isCorrect
        }))
    }));
};
// Componente interno que usa el contexto
function QuizPageContent() {
    const { contentId } = useParams();
    const { quizData, loading, error, loadQuiz } = useQuiz();
    useEffect(() => {
        if (contentId) {
            loadQuiz(contentId);
        }
    }, [contentId, loadQuiz]);
    // Estados de carga
    if (loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" }), _jsx("div", { className: "text-xl text-gray-600", children: "Cargando quiz..." })] }) }));
    }
    if (error) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50", children: _jsxs("div", { className: "text-center max-w-md mx-auto p-6", children: [_jsx("div", { className: "text-red-500 text-6xl mb-4", children: "\u26A0\uFE0F" }), _jsx("div", { className: "text-xl text-gray-800 mb-2", children: "Error al cargar el quiz" }), _jsx("div", { className: "text-gray-600 mb-4", children: error }), _jsx("button", { onClick: () => contentId && loadQuiz(contentId), className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: "Reintentar" })] }) }));
    }
    if (!quizData || !quizData.quiz || quizData.quiz.length === 0) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50", children: _jsxs("div", { className: "text-center max-w-md mx-auto p-6", children: [_jsx("div", { className: "text-gray-400 text-6xl mb-4", children: "\uD83D\uDCDD" }), _jsx("div", { className: "text-xl text-gray-600", children: "No hay quiz disponible para este contenido" }), _jsx("div", { className: "text-gray-500 mt-2", children: "Este contenido no tiene preguntas asociadas." })] }) }));
    }
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50", children: _jsx(QuizComponent, { quizzes: transformQuizData(quizData.quiz) }) }));
}
// Componente principal con el provider
function QuizPage() {
    return (_jsx(QuizProvider, { children: _jsx(QuizPageContent, {}) }));
}
export default QuizPage;
