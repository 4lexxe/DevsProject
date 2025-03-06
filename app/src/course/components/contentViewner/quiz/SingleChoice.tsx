import React from 'react';
import { Quiz } from '@/course/interfaces/Content';
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
                ? 'bg-blue-100 border-blue-500 text-blue-700'
                : 'bg-gray-50 hover:bg-gray-100 border-transparent hover:border-gray-300'
            }`}
          >
            <span className={`w-8 h-8 flex items-center justify-center rounded-full ${
              selected ? 'bg-blue-200' : 'bg-gray-200'
            } mr-3`}>
              {letters[index]}
            </span>
            <span className="block font-medium">{answer.answer}</span>
            {selected && (
              <CircleDot className="w-5 h-5 text-blue-600 ml-auto" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default SingleChoice;