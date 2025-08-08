import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CircleDot } from 'lucide-react';
const SingleChoice = ({ quiz, selectedAnswers, onAnswerSelect, letters, }) => {
    const isAnswerSelected = (index) => {
        return selectedAnswers.includes(index);
    };
    return (_jsx("div", { className: "space-y-4", children: quiz.answers.map((answer, index) => {
            const selected = isAnswerSelected(index);
            return (_jsxs("button", { onClick: () => onAnswerSelect(index), className: `w-full p-4 text-left rounded-lg transition-all duration-300 flex items-center border-2 ${selected
                    ? 'bg-cyan-50 border-cyan-400 text-cyan-900'
                    : 'bg-slate-50 hover:bg-slate-100 border-transparent hover:border-slate-300'}`, children: [_jsx("span", { className: `w-8 h-8 flex items-center justify-center rounded-full ${selected ? 'bg-cyan-100' : 'bg-slate-200'} mr-3`, children: letters[index] }), _jsx("span", { className: "block font-medium", children: answer.answer }), selected && (_jsx(CircleDot, { className: "w-5 h-5 text-cyan-600 ml-auto" }))] }, index));
        }) }));
};
export default SingleChoice;
