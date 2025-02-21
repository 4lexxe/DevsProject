import React, { useState } from 'react';
import type { Quiz } from '@/course/interfaces/Content';
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, RotateCcw, CircleDot, Check, X } from 'lucide-react';

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

  const isAnswerSelected = (answerIndex: number): boolean => {
    const currentAnswers = selectedAnswers[currentPage];
    if (Array.isArray(currentAnswers)) {
      return currentAnswers.includes(answerIndex);
    }
    return false;
  };

  const getTrueFalseValue = (answerIndex: number): boolean | undefined => {
    const currentAnswers = selectedAnswers[currentPage] as { [key: number]: boolean } | undefined;
    return currentAnswers?.[answerIndex];
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

  const isAnswerCorrect = (quizIndex: number, answerIndex?: number): boolean => {
    const quiz = quizzes[quizIndex];
    const answer = selectedAnswers[quizIndex];

    switch (quiz.type) {
      case 'Single':
        return Array.isArray(answer) && answer.length === 1 && quiz.answers[answer[0]].isCorrect;
      case 'MultipleChoice':
        if (!Array.isArray(answer)) return false;
        const correctAnswers = quiz.answers.filter(a => a.isCorrect).length;
        return answer.length === correctAnswers && answer.every(idx => quiz.answers[idx].isCorrect);
      case 'TrueOrFalse':
        if (typeof answerIndex === 'number') {
          const trueFalseAnswers = answer as { [key: number]: boolean } | undefined;
          return trueFalseAnswers?.[answerIndex] === quiz.answers[answerIndex].isCorrect;
        }
        const trueFalseAnswers = answer as { [key: number]: boolean } | undefined;
        return trueFalseAnswers !== undefined && 
               Object.entries(trueFalseAnswers).every(([idx, value]) => 
                 value === quiz.answers[parseInt(idx)].isCorrect
               );
      case 'ShortAnswer':
        const userAnswer = shortAnswers[quizIndex]?.toLowerCase().trim();
        return quiz.answers.some(a => a.isCorrect && a.answer.toLowerCase().trim() === userAnswer);
      default:
        return false;
    }
  };

  const calculateScore = () => {
    let correctCount = 0;
    let totalQuestions = quizzes.length;

    quizzes.forEach((quiz, index) => {
      if (quiz.type === 'TrueOrFalse') {
        const trueFalseAnswers = selectedAnswers[index] as { [key: number]: boolean } | undefined;
        if (trueFalseAnswers) {
          quiz.answers.forEach((_, answerIndex) => {
            if (isAnswerCorrect(index, answerIndex)) {
              correctCount++;
            }
          });
          totalQuestions += quiz.answers.length - 1; // -1 because we already counted the question itself
        }
      } else if (isAnswerCorrect(index)) {
        correctCount++;
      }
    });

    return {
      score: correctCount,
      total: totalQuestions,
      percentage: Math.round((correctCount / totalQuestions) * 100)
    };
  };

  const renderQuestionInput = () => {
    switch (currentQuiz.type) {
      case 'ShortAnswer':
        return (
          <div className="space-y-4">
            <input
              type="text"
              value={shortAnswers[currentPage] || ''}
              onChange={(e) => handleShortAnswerChange(e.target.value)}
              placeholder="Escribe tu respuesta aquí..."
              className="w-full p-4 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-300"
            />
          </div>
        );
      case 'TrueOrFalse':
        return (
          <div className="space-y-6">
            {currentQuiz.answers.map((answer, answerIndex) => (
              <div key={answerIndex} className="bg-white rounded-lg p-4 shadow-sm">
                <p className="font-medium mb-3">{answer.answer}</p>
                <div className="flex gap-4">
                  {[
                    { value: true, label: 'Verdadero', icon: <Check className="w-4 h-4" /> },
                    { value: false, label: 'Falso', icon: <X className="w-4 h-4" /> }
                  ].map(({ value, label, icon }) => {
                    const isSelected = getTrueFalseValue(answerIndex) === value;
                    return (
                      <button
                        key={value.toString()}
                        onClick={() => handleAnswerSelect(answerIndex, value)}
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
      default:
        return (
          <div className="space-y-4">
            {currentQuiz.answers.map((answer, index) => {
              const selected = isAnswerSelected(index);
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left rounded-lg transition-all duration-300 flex items-center border-2 ${
                    selected
                      ? 'bg-blue-100 border-blue-500 text-blue-700'
                      : 'bg-gray-50 hover:bg-gray-100 border-transparent hover:border-gray-300'
                  }`}
                >
                  <span className={`w-8 h-8 flex items-center justify-center rounded-full ${
                    selected ? 'bg-blue-200' : 'bg-gray-200'
                  } mr-3`}>
                    {letters[index]})
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
    }
  };

  const renderResultAnswer = (quiz: Quiz, quizIndex: number) => {
    switch (quiz.type) {
      case 'ShortAnswer':
        const userAnswer = shortAnswers[quizIndex] || '';
        const correctAnswer = quiz.answers.find(a => a.isCorrect)?.answer || '';
        return (
          <div className="space-y-3">
            <div className={`p-3 rounded-lg ${isAnswerCorrect(quizIndex) ? 'bg-green-100' : 'bg-red-100'}`}>
              <p className="font-medium">Tu respuesta:</p>
              <p className="mt-1">{userAnswer || '(Sin respuesta)'}</p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50">
              <p className="font-medium">Respuesta correcta:</p>
              <p className="mt-1">{correctAnswer}</p>
            </div>
          </div>
        );
      case 'TrueOrFalse':
        const trueFalseAnswers = selectedAnswers[quizIndex] as { [key: number]: boolean } | undefined;
        return (
          <div className="space-y-4">
            {quiz.answers.map((answer, answerIndex) => {
              const selectedValue = trueFalseAnswers?.[answerIndex];
              const isCorrect = isAnswerCorrect(quizIndex, answerIndex);
              return (
                <div key={answerIndex} className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="font-medium mb-3">{answer.answer}</p>
                  <div className="flex gap-4">
                    {[
                      { value: true, label: 'Verdadero', icon: <Check className="w-4 h-4" /> },
                      { value: false, label: 'Falso', icon: <X className="w-4 h-4" /> }
                    ].map(({ value, label, icon }) => {
                      const isSelected = selectedValue === value;
                      const isCorrectValue = answer.isCorrect === value;
                      return (
                        <div
                          key={value.toString()}
                          className={`flex-1 p-3 rounded-lg flex items-center justify-center gap-2 ${
                            isCorrectValue
                              ? 'bg-green-100'
                              : isSelected && !isCorrectValue
                              ? 'bg-red-100'
                              : 'bg-gray-50'
                          }`}
                        >
                          <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200">
                            {icon}
                          </span>
                          <span className="font-medium">{label}</span>
                          {isSelected && <CircleDot className="w-5 h-5 text-blue-600 ml-2" />}
                          {isCorrectValue ? (
                            <CheckCircle className="w-5 h-5 text-green-600 ml-2" />
                          ) : isSelected && !isCorrectValue ? (
                            <XCircle className="w-5 h-5 text-red-600 ml-2" />
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        );
      default:
        return (
          <div className="space-y-3">
            {quiz.answers.map((answer, answerIndex) => {
              const isSelected = Array.isArray(selectedAnswers[quizIndex]) && 
                               (selectedAnswers[quizIndex] as number[]).includes(answerIndex);
              return (
                <div
                  key={answerIndex}
                  className={`flex items-center p-3 rounded-lg ${
                    answer.isCorrect
                      ? 'bg-green-100'
                      : isSelected && !answer.isCorrect
                      ? 'bg-red-100'
                      : 'bg-white'
                  }`}
                >
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 mr-3">
                    {letters[answerIndex]})
                  </span>
                  <span className="flex-grow">{answer.answer}</span>
                  <div className="flex items-center space-x-2">
                    {isSelected && <CircleDot className="w-5 h-5 text-blue-600 mr-2" />}
                    {answer.isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : isSelected && !answer.isCorrect ? (
                      <XCircle className="w-5 h-5 text-red-600" />
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        );
    }
  };

  if (currentPage === quizzes.length) {
    const score = calculateScore();
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <h2 className="text-3xl font-bold mb-2">Resultados del Quiz</h2>
              <p className="text-lg opacity-90">Has completado todas las preguntas</p>
            </div>

            <div className="p-6">
              <div className="text-center mb-8">
                <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  {score.percentage}%
                </div>
                <p className="text-xl text-gray-600">
                  Has acertado {score.score} de {score.total} preguntas
                </p>
              </div>

              <div className="space-y-6">
                {quizzes.map((quiz, quizIndex) => (
                  <div key={quizIndex} className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-lg mb-4">
                      {quizIndex + 1}. {quiz.question}
                    </h3>
                    {renderResultAnswer(quiz, quizIndex)}
                    <div className="mt-4 text-sm text-gray-600">
                      <p>
                        {quiz.type === 'Single' && 'Pregunta de respuesta única'}
                        {quiz.type === 'MultipleChoice' && 'Pregunta de respuesta múltiple'}
                        {quiz.type === 'TrueOrFalse' && 'Pregunta de verdadero o falso'}
                        {quiz.type === 'ShortAnswer' && 'Pregunta de respuesta corta'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={restartQuiz}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Reintentar Quiz</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
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
            <p className="text-gray-600 mb-4">{currentQuiz.text}</p>
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
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Anterior</span>
            </button>

            <button
              onClick={handleNext}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
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