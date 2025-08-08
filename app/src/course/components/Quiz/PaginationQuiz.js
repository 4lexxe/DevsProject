import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuiz } from '@/course/contexts/QuizContext';
import SingleChoice from './SingleChoice';
import TrueFalse from './TrueFlase';
import ShortAnswer from './ShortAnswer';
import QuizResults from './QuizResults';
const QuizComponent = React.memo(({ quizzes }) => {
    const { currentQuestionIndex, userAnswers, nextQuestion, previousQuestion, submitAnswer, quizCompleted, completeQuiz, resetQuiz } = useQuiz();
    const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const currentQuiz = quizzes[currentQuestionIndex];
    const handleAnswerSelect = useCallback((answerIndex, value) => {
        if (!currentQuiz)
            return;
        switch (currentQuiz.type) {
            case 'Single':
                submitAnswer(currentQuestionIndex, [answerIndex]);
                break;
            case 'MultipleChoice':
                const currentAnswers = Array.isArray(userAnswers[currentQuestionIndex])
                    ? userAnswers[currentQuestionIndex]
                    : [];
                const newAnswers = currentAnswers.includes(answerIndex)
                    ? currentAnswers.filter((i) => i !== answerIndex)
                    : [...currentAnswers, answerIndex];
                submitAnswer(currentQuestionIndex, newAnswers);
                break;
            case 'TrueOrFalse':
                // Para TrueOrFalse, guardamos un objeto con las respuestas boolean
                const currentTrueFalseAnswers = (typeof userAnswers[currentQuestionIndex] === 'object' && !Array.isArray(userAnswers[currentQuestionIndex]))
                    ? userAnswers[currentQuestionIndex]
                    : {};
                submitAnswer(currentQuestionIndex, {
                    ...currentTrueFalseAnswers,
                    [answerIndex]: value
                });
                break;
        }
    }, [currentQuiz, submitAnswer, userAnswers, currentQuestionIndex]);
    const handleShortAnswerChange = useCallback((answer) => {
        if (currentQuiz) {
            submitAnswer(currentQuestionIndex, answer);
        }
    }, [currentQuiz, submitAnswer, currentQuestionIndex]);
    const handleNext = useCallback(() => {
        if (currentQuestionIndex < quizzes.length - 1) {
            nextQuestion();
        }
        else {
            // Es la última pregunta, completar el quiz
            completeQuiz();
        }
    }, [currentQuestionIndex, quizzes.length, nextQuestion, completeQuiz]);
    const handlePrevious = useCallback(() => {
        previousQuestion();
    }, [previousQuestion]);
    const restartQuiz = useCallback(() => {
        resetQuiz();
    }, [resetQuiz]);
    if (quizCompleted) {
        // Mapear las respuestas a índices de quiz para QuizResults
        const mappedSelectedAnswers = {};
        const shortAnswers = {};
        quizzes.forEach((quiz, quizIndex) => {
            const userAnswer = userAnswers[quizIndex];
            if (userAnswer !== undefined) {
                mappedSelectedAnswers[quizIndex] = userAnswer;
                if (typeof userAnswer === 'string') {
                    shortAnswers[quizIndex] = userAnswer;
                }
            }
        });
        return (_jsx(QuizResults, { quizzes: quizzes, selectedAnswers: mappedSelectedAnswers, shortAnswers: shortAnswers, onRestart: restartQuiz, letters: letters }));
    }
    if (!currentQuiz) {
        return _jsx("div", { children: "Cargando pregunta..." });
    }
    const renderQuestionInput = () => {
        const userAnswer = userAnswers[currentQuestionIndex];
        switch (currentQuiz.type) {
            case 'ShortAnswer':
                return (_jsx(ShortAnswer, { value: typeof userAnswer === 'string' ? userAnswer : '', onChange: handleShortAnswerChange }));
            case 'TrueOrFalse':
                return (_jsx(TrueFalse, { quiz: currentQuiz, selectedAnswers: typeof userAnswer === 'object' && !Array.isArray(userAnswer)
                        ? userAnswer
                        : {}, onAnswerSelect: handleAnswerSelect }));
            default:
                return (_jsx(SingleChoice, { quiz: currentQuiz, selectedAnswers: Array.isArray(userAnswer) ? userAnswer : [], onAnswerSelect: handleAnswerSelect, letters: letters }));
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-cyan-50 via-white to-slate-100 p-4 sm:p-6 lg:p-8", children: _jsxs("div", { className: "max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden", children: [_jsxs("div", { className: "bg-gradient-to-r from-cyan-600 to-blue-900 p-6", children: [_jsxs("h2", { className: "text-2xl font-bold text-white mb-2", children: ["Pregunta ", currentQuestionIndex + 1, " de ", quizzes.length] }), _jsx("div", { className: "w-full bg-white/30 rounded-full h-2", children: _jsx("div", { className: "bg-white rounded-full h-2 transition-all duration-300", style: { width: `${((currentQuestionIndex + 1) / quizzes.length) * 100}%` } }) })] }), _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h3", { className: "text-xl font-semibold mb-4", children: currentQuiz.question }), _jsx("p", { className: "text-slate-600 mb-4", children: currentQuiz.text }), currentQuiz.image && (_jsx("img", { src: currentQuiz.image, alt: "Quiz question", className: "w-full rounded-lg mb-6 shadow-md" }))] }), renderQuestionInput(), _jsxs("div", { className: "mt-8 flex justify-between items-center", children: [_jsxs("button", { onClick: handlePrevious, disabled: currentQuestionIndex === 0, className: `flex items-center space-x-2 px-6 py-2 rounded-lg transition-all duration-300 ${currentQuestionIndex === 0
                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-cyan-600 to-blue-900 text-white hover:from-cyan-700 hover:to-blue-950'}`, children: [_jsx(ChevronLeft, { className: "w-5 h-5" }), _jsx("span", { children: "Anterior" })] }), _jsxs("button", { onClick: handleNext, className: "flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-900 text-white px-6 py-2 rounded-lg hover:from-cyan-700 hover:to-blue-950 transition-all duration-300", children: [_jsx("span", { children: currentQuestionIndex === quizzes.length - 1 ? 'Ver Resultados' : 'Siguiente' }), _jsx(ChevronRight, { className: "w-5 h-5" })] })] })] })] }) }));
});
QuizComponent.displayName = 'QuizComponent';
export default QuizComponent;
