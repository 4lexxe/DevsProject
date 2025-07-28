import React from 'react';
import type { Quiz } from '@/course/interfaces/Content';
import { CheckCircle, XCircle, CircleDot, RotateCcw, Check, X } from 'lucide-react';

interface QuizResultsProps {
  quizzes: Quiz[];
  selectedAnswers: { [key: number]: number[] | { [key: number]: boolean } | string };
  shortAnswers: { [key: number]: string };
  onRestart: () => void;
  letters: string[];
}

const QuizResults: React.FC<QuizResultsProps> = ({
  quizzes,
  selectedAnswers,
  shortAnswers,
  onRestart,
  letters,
}) => {
  const calculateScore = () => {
    let correctCount = 0;
    let totalQuestions = quizzes.length;

    quizzes.forEach((quiz, index) => {
      if (quiz.type === 'TrueOrFalse') {
        const trueFalseAnswers = selectedAnswers[index] as { [key: number]: boolean } | undefined;
        if (trueFalseAnswers) {
          quiz.answers.forEach((answer, answerIndex) => {
            if (trueFalseAnswers[answerIndex] === answer.isCorrect) {
              correctCount++;
            }
          });
          totalQuestions += quiz.answers.length - 1;
        }
      } else if (isAnswerCorrect(quiz, index)) {
        correctCount++;
      }
    });

    return {
      score: correctCount,
      total: totalQuestions,
      percentage: Math.round((correctCount / totalQuestions) * 100)
    };
  };

  const isAnswerCorrect = (quiz: Quiz, quizIndex: number): boolean => {
    const answer = selectedAnswers[quizIndex];

    switch (quiz.type) {
      case 'Single':
        return Array.isArray(answer) && answer.length === 1 && quiz.answers[answer[0]].isCorrect;
      case 'MultipleChoice':
        if (!Array.isArray(answer)) return false;
        const correctAnswers = quiz.answers.filter(a => a.isCorrect).length;
        return answer.length === correctAnswers && answer.every(idx => quiz.answers[idx].isCorrect);
      case 'TrueOrFalse':
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

  const renderResultAnswer = (quiz: Quiz, quizIndex: number) => {
    switch (quiz.type) {
      case 'ShortAnswer':
        const userAnswer = shortAnswers[quizIndex] || '';
        const correctAnswer = quiz.answers.find(a => a.isCorrect)?.answer || '';
        return (
          <div className="space-y-3">
            <div className={`p-3 rounded-lg ${isAnswerCorrect(quiz, quizIndex) ? 'bg-teal-100' : 'bg-red-100'}`}>
              <p className="font-medium">Tu respuesta:</p>
              <p className="mt-1">{userAnswer || '(Sin respuesta)'}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50">
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
              const isCorrect = selectedValue === answer.isCorrect;
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
                              ? 'bg-teal-100'
                              : isSelected && !isCorrectValue
                              ? 'bg-red-100'
                              : 'bg-slate-50'
                          }`}
                        >
                          <span className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-200">
                            {icon}
                          </span>
                          <span className="font-medium">{label}</span>
                          {isSelected && <CircleDot className="w-5 h-5 text-cyan-600 ml-2" />}
                          {isCorrectValue ? (
                            <CheckCircle className="w-5 h-5 text-teal-600 ml-2" />
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
                      ? 'bg-teal-100'
                      : isSelected && !answer.isCorrect
                      ? 'bg-red-100'
                      : 'bg-white'
                  }`}
                >
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 mr-3">
                    {letters[answerIndex]})
                  </span>
                  <span className="flex-grow">{answer.answer}</span>
                  <div className="flex items-center space-x-2">
                    {isSelected && <CircleDot className="w-5 h-5 text-cyan-600 mr-2" />}
                    {answer.isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-teal-600" />
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

  const score = calculateScore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-600 to-blue-900 p-6 text-white">
            <h2 className="text-3xl font-bold mb-2">Resultados del Quiz</h2>
            <p className="text-lg opacity-90">Has completado todas las preguntas</p>
          </div>

          <div className="p-6">
            <div className="text-center mb-8">
              <div className="text-6xl font-bold bg-gradient-to-r from-cyan-600 to-blue-900 bg-clip-text text-transparent mb-4">
                {score.percentage}%
              </div>
              <p className="text-xl text-slate-600">
                Has acertado {score.score} de {score.total} preguntas
              </p>
            </div>

            <div className="space-y-6">
              {quizzes.map((quiz, quizIndex) => (
                <div key={quizIndex} className="bg-slate-50 rounded-xl p-6">
                  <h3 className="font-semibold text-lg mb-4">
                    {quizIndex + 1}. {quiz.question}
                  </h3>
                  {renderResultAnswer(quiz, quizIndex)}
                  <div className="mt-4 text-sm text-slate-600">
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
                onClick={onRestart}
                className="flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-900 text-white px-6 py-3 rounded-lg hover:from-cyan-700 hover:to-blue-950 transition-all duration-300"
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
};

export default QuizResults;