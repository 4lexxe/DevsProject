import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckCircle, XCircle, CircleDot, RotateCcw, Check, X } from 'lucide-react';
const QuizResults = ({ quizzes, selectedAnswers, shortAnswers, onRestart, letters, }) => {
    const calculateScore = () => {
        let correctCount = 0;
        let totalQuestions = quizzes.length;
        quizzes.forEach((quiz, index) => {
            if (quiz.type === 'TrueOrFalse') {
                const trueFalseAnswers = selectedAnswers[index];
                if (trueFalseAnswers) {
                    quiz.answers.forEach((answer, answerIndex) => {
                        if (trueFalseAnswers[answerIndex] === answer.isCorrect) {
                            correctCount++;
                        }
                    });
                    totalQuestions += quiz.answers.length - 1;
                }
            }
            else if (isAnswerCorrect(quiz, index)) {
                correctCount++;
            }
        });
        return {
            score: correctCount,
            total: totalQuestions,
            percentage: Math.round((correctCount / totalQuestions) * 100)
        };
    };
    const isAnswerCorrect = (quiz, quizIndex) => {
        const answer = selectedAnswers[quizIndex];
        switch (quiz.type) {
            case 'Single':
                return Array.isArray(answer) && answer.length === 1 && quiz.answers[answer[0]].isCorrect;
            case 'MultipleChoice':
                if (!Array.isArray(answer))
                    return false;
                const correctAnswers = quiz.answers.filter(a => a.isCorrect).length;
                return answer.length === correctAnswers && answer.every(idx => quiz.answers[idx].isCorrect);
            case 'TrueOrFalse':
                const trueFalseAnswers = answer;
                return trueFalseAnswers !== undefined &&
                    Object.entries(trueFalseAnswers).every(([idx, value]) => value === quiz.answers[parseInt(idx)].isCorrect);
            case 'ShortAnswer':
                const userAnswer = (typeof answer === 'string' ? answer : shortAnswers[quizIndex] || '').toLowerCase().trim();
                return quiz.answers.some(a => a.isCorrect && a.answer.toLowerCase().trim() === userAnswer);
            default:
                return false;
        }
    };
    const renderResultAnswer = (quiz, quizIndex) => {
        switch (quiz.type) {
            case 'ShortAnswer':
                const userAnswer = typeof selectedAnswers[quizIndex] === 'string'
                    ? selectedAnswers[quizIndex]
                    : shortAnswers[quizIndex] || '';
                const correctAnswer = quiz.answers.find(a => a.isCorrect)?.answer || '';
                return (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: `p-3 rounded-lg ${isAnswerCorrect(quiz, quizIndex) ? 'bg-teal-100' : 'bg-red-100'}`, children: [_jsx("p", { className: "font-medium", children: "Tu respuesta:" }), _jsx("p", { className: "mt-1", children: userAnswer || '(Sin respuesta)' })] }), _jsxs("div", { className: "p-3 rounded-lg bg-slate-50", children: [_jsx("p", { className: "font-medium", children: "Respuesta correcta:" }), _jsx("p", { className: "mt-1", children: correctAnswer })] })] }));
            case 'TrueOrFalse':
                const trueFalseAnswers = selectedAnswers[quizIndex];
                return (_jsx("div", { className: "space-y-4", children: quiz.answers.map((answer, answerIndex) => {
                        const selectedValue = trueFalseAnswers?.[answerIndex];
                        const isCorrect = selectedValue === answer.isCorrect;
                        return (_jsxs("div", { className: "bg-white rounded-lg p-4 shadow-sm", children: [_jsx("p", { className: "font-medium mb-3", children: answer.answer }), _jsx("div", { className: "flex gap-4", children: [
                                        { value: true, label: 'Verdadero', icon: _jsx(Check, { className: "w-4 h-4" }) },
                                        { value: false, label: 'Falso', icon: _jsx(X, { className: "w-4 h-4" }) }
                                    ].map(({ value, label, icon }) => {
                                        const isSelected = selectedValue === value;
                                        const isCorrectValue = answer.isCorrect === value;
                                        return (_jsxs("div", { className: `flex-1 p-3 rounded-lg flex items-center justify-center gap-2 ${isCorrectValue
                                                ? 'bg-teal-100'
                                                : isSelected && !isCorrectValue
                                                    ? 'bg-red-100'
                                                    : 'bg-slate-50'}`, children: [_jsx("span", { className: "w-6 h-6 flex items-center justify-center rounded-full bg-slate-200", children: icon }), _jsx("span", { className: "font-medium", children: label }), isSelected && _jsx(CircleDot, { className: "w-5 h-5 text-cyan-600 ml-2" }), isCorrectValue ? (_jsx(CheckCircle, { className: "w-5 h-5 text-teal-600 ml-2" })) : isSelected && !isCorrectValue ? (_jsx(XCircle, { className: "w-5 h-5 text-red-600 ml-2" })) : null] }, value.toString()));
                                    }) })] }, answerIndex));
                    }) }));
            default:
                return (_jsx("div", { className: "space-y-3", children: quiz.answers.map((answer, answerIndex) => {
                        const isSelected = Array.isArray(selectedAnswers[quizIndex]) &&
                            selectedAnswers[quizIndex].includes(answerIndex);
                        return (_jsxs("div", { className: `flex items-center p-3 rounded-lg ${answer.isCorrect
                                ? 'bg-teal-100'
                                : isSelected && !answer.isCorrect
                                    ? 'bg-red-100'
                                    : 'bg-white'}`, children: [_jsxs("span", { className: "w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 mr-3", children: [letters[answerIndex], ")"] }), _jsx("span", { className: "flex-grow", children: answer.answer }), _jsxs("div", { className: "flex items-center space-x-2", children: [isSelected && _jsx(CircleDot, { className: "w-5 h-5 text-cyan-600 mr-2" }), answer.isCorrect ? (_jsx(CheckCircle, { className: "w-5 h-5 text-teal-600" })) : isSelected && !answer.isCorrect ? (_jsx(XCircle, { className: "w-5 h-5 text-red-600" })) : null] })] }, answerIndex));
                    }) }));
        }
    };
    const score = calculateScore();
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-cyan-50 via-white to-slate-100 p-4 sm:p-6 lg:p-8", children: _jsx("div", { className: "max-w-3xl mx-auto", children: _jsxs("div", { className: "bg-white rounded-2xl shadow-xl overflow-hidden", children: [_jsxs("div", { className: "bg-gradient-to-r from-cyan-600 to-blue-900 p-6 text-white", children: [_jsx("h2", { className: "text-3xl font-bold mb-2", children: "Resultados del Quiz" }), _jsx("p", { className: "text-lg opacity-90", children: "Has completado todas las preguntas" })] }), _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsxs("div", { className: "text-6xl font-bold bg-gradient-to-r from-cyan-600 to-blue-900 bg-clip-text text-transparent mb-4", children: [score.percentage, "%"] }), _jsxs("p", { className: "text-xl text-slate-600", children: ["Has acertado ", score.score, " de ", score.total, " preguntas"] })] }), _jsx("div", { className: "space-y-6", children: quizzes.map((quiz, quizIndex) => (_jsxs("div", { className: "bg-slate-50 rounded-xl p-6", children: [_jsxs("h3", { className: "font-semibold text-lg mb-4", children: [quizIndex + 1, ". ", quiz.question] }), renderResultAnswer(quiz, quizIndex), _jsx("div", { className: "mt-4 text-sm text-slate-600", children: _jsxs("p", { children: [quiz.type === 'Single' && 'Pregunta de respuesta única', quiz.type === 'MultipleChoice' && 'Pregunta de respuesta múltiple', quiz.type === 'TrueOrFalse' && 'Pregunta de verdadero o falso', quiz.type === 'ShortAnswer' && 'Pregunta de respuesta corta'] }) })] }, quizIndex))) }), _jsx("div", { className: "mt-8 flex justify-center", children: _jsxs("button", { onClick: onRestart, className: "flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-900 text-white px-6 py-3 rounded-lg hover:from-cyan-700 hover:to-blue-950 transition-all duration-300", children: [_jsx(RotateCcw, { className: "w-5 h-5" }), _jsx("span", { children: "Reintentar Quiz" })] }) })] })] }) }) }));
};
export default QuizResults;
