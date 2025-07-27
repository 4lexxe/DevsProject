import React, { useState } from 'react';
import { Quiz } from '@/course/interfaces/Content';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SingleChoice from './SingleChoice';
import TrueFalse from './TrueFlase';
import ShortAnswer from './ShortAnswer';
import QuizResults from './QuizResults';

interface QuizComponentProps {
  quizzes: Quiz[];
}

const QuizComponent: React.FC<QuizComponentProps> = ({ quizzes }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: { [key: number]: boolean } | number[] | string }>({});
  const [shortAnswers, setShortAnswers] = useState<{ [key: number]: string }>({});

  const currentQuiz = quizzes[currentPage];
  const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  const handleAnswerSelect = (answerIndex: number, value?: boolean) => {
    switch (currentQuiz.type) {
      case 'Single':
        setSelectedAnswers({
          ...selectedAnswers,
          [currentPage]: [answerIndex],
        });
        break;
      case 'MultipleChoice':
        const currentMultipleAnswers = (selectedAnswers[currentPage] as number[]) || [];
        const newMultipleAnswers = currentMultipleAnswers.includes(answerIndex)
          ? currentMultipleAnswers.filter((i) => i !== answerIndex)
          : [...currentMultipleAnswers, answerIndex];
        setSelectedAnswers({
          ...selectedAnswers,
          [currentPage]: newMultipleAnswers,
        });
        break;
      case 'TrueOrFalse':
        const currentTrueFalseAnswers = (selectedAnswers[currentPage] as { [key: number]: boolean }) || {};
        setSelectedAnswers({
          ...selectedAnswers,
          [currentPage]: {
            ...currentTrueFalseAnswers,
            [answerIndex]: value!,
          },
        });
        break;
    }
  };

  const handleShortAnswerChange = (answer: string) => {
    setShortAnswers({
      ...shortAnswers,
      [currentPage]: answer,
    });
  };

  const handleNext = () => {
    if (currentPage < quizzes.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const restartQuiz = () => {
    setCurrentPage(0);
    setSelectedAnswers({});
    setShortAnswers({});
  };

  if (currentPage === quizzes.length) {
    return (
      <QuizResults
        quizzes={quizzes}
        selectedAnswers={selectedAnswers}
        shortAnswers={shortAnswers}
        onRestart={restartQuiz}
        letters={letters}
      />
    );
  }

  const renderQuestionInput = () => {
    switch (currentQuiz.type) {
      case 'ShortAnswer':
        return (
          <ShortAnswer
            value={shortAnswers[currentPage] || ''}
            onChange={handleShortAnswerChange}
          />
        );
      case 'TrueOrFalse':
        return (
          <TrueFalse
            quiz={currentQuiz}
            selectedAnswers={selectedAnswers[currentPage] as { [key: number]: boolean } || {}}
            onAnswerSelect={handleAnswerSelect}
          />
        );
      default:
        return (
          <SingleChoice
            quiz={currentQuiz}
            selectedAnswers={selectedAnswers[currentPage] as number[] || []}
            onAnswerSelect={handleAnswerSelect}
            letters={letters}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-600 to-blue-900 p-6">
          <h2 className="text-2xl font-bold text-white mb-2">Pregunta {currentPage + 1} de {quizzes.length}</h2>
          <div className="w-full bg-white/30 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-300"
              style={{ width: `${((currentPage + 1) / quizzes.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">{currentQuiz.question}</h3>
            <p className="text-slate-600 mb-4">{currentQuiz.text}</p>
            {currentQuiz.image && (
              <img 
                src={currentQuiz.image} 
                alt="Quiz question" 
                className="w-full rounded-lg mb-6 shadow-md"
              />
            )}
          </div>

          {renderQuestionInput()}

          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 0}
              className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-all duration-300 ${
                currentPage === 0
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-600 to-blue-900 text-white hover:from-cyan-700 hover:to-blue-950'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Anterior</span>
            </button>

            <button
              onClick={handleNext}
              className="flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-900 text-white px-6 py-2 rounded-lg hover:from-cyan-700 hover:to-blue-950 transition-all duration-300"
            >
              <span>{currentPage === quizzes.length - 1 ? 'Ver Resultados' : 'Siguiente'}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizComponent;