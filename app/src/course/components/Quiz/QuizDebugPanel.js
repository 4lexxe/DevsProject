import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuiz } from '../../contexts/QuizContext';
const QuizDebugPanel = ({ isVisible = false }) => {
    const { quizData, userAnswers, currentQuestionIndex, quizCompleted, score } = useQuiz();
    // Calcular valores directamente
    const getTotalAnsweredQuestions = () => {
        return Object.keys(userAnswers).length;
    };
    const getProgressPercentage = () => {
        const totalQuestions = quizData?.quiz?.length || 0;
        if (totalQuestions === 0)
            return 0;
        return Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);
    };
    const hasAnyProgress = () => {
        return getTotalAnsweredQuestions() > 0 || currentQuestionIndex > 0;
    };
    const questionNumber = currentQuestionIndex + 1;
    const totalQuestions = quizData?.quiz?.length || 0;
    if (!isVisible || !quizData)
        return null;
    return (_jsxs("div", { className: "fixed bottom-4 left-4 bg-black bg-opacity-80 text-white text-xs p-4 rounded-lg max-w-sm z-50", children: [_jsx("div", { className: "font-bold mb-2", children: "\uD83D\uDD27 Quiz Debug Panel" }), _jsxs("div", { className: "space-y-1", children: [_jsxs("div", { children: ["\uD83D\uDCDD ", _jsx("strong", { children: "Quiz ID:" }), " ", quizData.id] }), _jsxs("div", { children: ["\uD83D\uDCCA ", _jsx("strong", { children: "Progreso:" }), " ", questionNumber, "/", totalQuestions, " (", getProgressPercentage(), "%)"] }), _jsxs("div", { children: ["\u2705 ", _jsx("strong", { children: "Respondidas:" }), " ", getTotalAnsweredQuestions()] }), _jsxs("div", { children: ["\uD83C\uDFAF ", _jsx("strong", { children: "Puntuaci\u00F3n:" }), " ", score, " pts"] }), _jsxs("div", { children: ["\uD83D\uDD04 ", _jsx("strong", { children: "Completado:" }), " ", quizCompleted ? 'Sí' : 'No'] }), _jsxs("div", { children: ["\uD83D\uDCBE ", _jsx("strong", { children: "Progreso guardado:" }), " ", hasAnyProgress() ? 'Sí' : 'No'] })] }), _jsxs("div", { className: "mt-3 pt-2 border-t border-gray-600", children: [_jsx("div", { className: "font-bold mb-1", children: "Respuestas actuales:" }), _jsx("div", { className: "max-h-24 overflow-y-auto text-xs", children: Object.entries(userAnswers).length > 0 ? (Object.entries(userAnswers).map(([questionId, answer]) => (_jsxs("div", { children: ["Q", questionId, ": ", Array.isArray(answer)
                                    ? `[${answer.join(', ')}]`
                                    : typeof answer === 'string'
                                        ? `"${answer}"`
                                        : typeof answer === 'object'
                                            ? `{${Object.entries(answer).map(([k, v]) => `${k}:${v}`).join(', ')}}`
                                            : String(answer)] }, questionId)))) : (_jsx("div", { className: "text-gray-400", children: "Sin respuestas" })) })] }), _jsx("div", { className: "mt-2 pt-2 border-t border-gray-600 text-xs text-gray-400", children: "Los datos se guardan autom\u00E1ticamente en sessionStorage" })] }));
};
export default QuizDebugPanel;
