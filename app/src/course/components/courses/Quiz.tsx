import React, { useState } from 'react';
import { ClipboardCheck, AlertCircle } from 'lucide-react';

interface Question {
  question: string;
  answers: Array<{
    answer: string;
    isCorrect: boolean;
  }>;
}

interface QuizProps {
  title: string;
  content?: string;
  questions: Question[];
}

const Quiz: React.FC<QuizProps> = ({ title, content, questions }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const handleSubmit = () => {
    const totalQuestions = questions.length;
    let correctAnswers = 0;

    questions.forEach((question, index) => {
      const selectedAnswerIndex = selectedAnswers[index];
      if (selectedAnswerIndex !== undefined && question.answers[selectedAnswerIndex].isCorrect) {
        correctAnswers++;
      }
    });

    setScore((correctAnswers / totalQuestions) * 100);
    setShowResults(true);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>

      {content && (
        <div className="px-6 py-4 border-b border-gray-200">
          <p className="text-gray-700">{content}</p>
        </div>
      )}

      <div className="px-6 py-4 space-y-6">
        {questions.map((question, questionIndex) => (
          <div key={questionIndex} className="space-y-3">
            <p className="font-medium text-gray-900">{`${questionIndex + 1}. ${question.question}`}</p>
            <div className="space-y-2">
              {question.answers.map((answer, answerIndex) => (
                <label
                  key={answerIndex}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors
                    ${selectedAnswers[questionIndex] === answerIndex 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  <input
                    type="radio"
                    name={`question-${questionIndex}`}
                    className="hidden"
                    checked={selectedAnswers[questionIndex] === answerIndex}
                    onChange={() => handleAnswerSelect(questionIndex, answerIndex)}
                    disabled={showResults}
                  />
                  <span className="ml-2 text-gray-700">{answer.answer}</span>
                  {showResults && (
                    <span className="ml-auto">
                      {answer.isCorrect ? (
                        <ClipboardCheck className="w-5 h-5 text-green-500" />
                      ) : selectedAnswers[questionIndex] === answerIndex ? (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      ) : null}
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        {!showResults ? (
          <button
            onClick={handleSubmit}
            disabled={Object.keys(selectedAnswers).length !== questions.length}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Submit Quiz
          </button>
        ) : (
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900">
              Your Score: {score.toFixed(0)}%
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {score >= 70 ? 'Great job!' : 'Keep practicing!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;