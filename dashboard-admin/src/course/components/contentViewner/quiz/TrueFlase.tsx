import React from 'react';
import type { Quiz } from '@/course/interfaces/Content';
import { Check, X } from 'lucide-react';

interface TrueFalseProps {
  quiz: Quiz;
  selectedAnswers: { [key: number]: boolean };
  onAnswerSelect: (index: number, value: boolean) => void;
}

const TrueFalse: React.FC<TrueFalseProps> = ({
  quiz,
  selectedAnswers,
  onAnswerSelect,
}) => {
  return (
    <div className="space-y-6">
      {quiz.answers.map((answer, answerIndex) => (
        <div key={answerIndex} className="bg-white rounded-lg p-4 shadow-sm">
          <p className="font-medium mb-3">{answer.answer}</p>
          <div className="flex gap-4">
            {[
              { value: true, label: 'Verdadero', icon: <Check className="w-4 h-4" /> },
              { value: false, label: 'Falso', icon: <X className="w-4 h-4" /> }
            ].map(({ value, label, icon }) => {
              const isSelected = selectedAnswers[answerIndex] === value;
              return (
                <button
                  key={value.toString()}
                  onClick={() => onAnswerSelect(answerIndex, value)}
                  className={`flex-1 p-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 border-2 ${
                    isSelected
                      ? 'bg-blue-100 border-blue-500 text-blue-700'
                      : 'bg-gray-50 hover:bg-gray-100 border-transparent hover:border-gray-300'
                  }`}
                >
                  <span className={`w-6 h-6 flex items-center justify-center rounded-full ${
                    isSelected ? 'bg-blue-200' : 'bg-gray-200'
                  }`}>
                    {icon}
                  </span>
                  <span className="font-medium">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrueFalse;