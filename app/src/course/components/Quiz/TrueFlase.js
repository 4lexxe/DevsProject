import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Check, X } from 'lucide-react';
const TrueFalse = ({ quiz, selectedAnswers, onAnswerSelect, }) => {
    return (_jsx("div", { className: "space-y-6", children: quiz.answers.map((answer, answerIndex) => (_jsxs("div", { className: "bg-white rounded-lg p-4 shadow-sm", children: [_jsx("p", { className: "font-medium mb-3", children: answer.answer }), _jsx("div", { className: "flex gap-4", children: [
                        { value: true, label: 'Verdadero', icon: _jsx(Check, { className: "w-4 h-4" }) },
                        { value: false, label: 'Falso', icon: _jsx(X, { className: "w-4 h-4" }) }
                    ].map(({ value, label, icon }) => {
                        const isSelected = selectedAnswers[answerIndex] === value;
                        return (_jsxs("button", { onClick: () => onAnswerSelect(answerIndex, value), className: `flex-1 p-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 border-2 ${isSelected
                                ? 'bg-blue-100 border-blue-500 text-blue-700'
                                : 'bg-gray-50 hover:bg-gray-100 border-transparent hover:border-gray-300'}`, children: [_jsx("span", { className: `w-6 h-6 flex items-center justify-center rounded-full ${isSelected ? 'bg-blue-200' : 'bg-gray-200'}`, children: icon }), _jsx("span", { className: "font-medium", children: label })] }, value.toString()));
                    }) })] }, answerIndex))) }));
};
export default TrueFalse;
