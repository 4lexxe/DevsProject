import React from 'react';
import type { Quiz } from '@/course/interfaces/Content';
import { CircleDot } from 'lucide-react';

interface SingleChoiceProps {
  quiz: Quiz;
  selectedAnswers: number[];
  onAnswerSelect: (index: number) => void;
  letters: string[];
}

const SingleChoice: React.FC<SingleChoiceProps> = ({
  quiz,
  selectedAnswers,
  onAnswerSelect,
  letters,
}) => {
  const isAnswerSelected = (index: number): boolean => {
    return selectedAnswers.includes(index);
  };

  return (
    <div className="space-y-4">
      {quiz.answers.map((answer, index) => {
        const selected = isAnswerSelected(index);
        return (
          <button
            key={index}
            onClick={() => onAnswerSelect(index)}
            className={`w-full p-4 text-left rounded-lg transition-all duration-300 flex items-center border-2 ${
              selected
                ? 'bg-cyan-50 border-cyan-400 text-cyan-900'
                : 'bg-slate-50 hover:bg-slate-100 border-transparent hover:border-slate-300'
            }`}
          >
            <span className={`w-8 h-8 flex items-center justify-center rounded-full ${
              selected ? 'bg-cyan-100' : 'bg-slate-200'
            } mr-3`}>
              {letters[index]}
            </span>
            <span className="block font-medium">{answer.answer}</span>
            {selected && (
              <CircleDot className="w-5 h-5 text-cyan-600 ml-auto" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default SingleChoice;