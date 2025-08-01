import React, { useCallback } from 'react';
import { Quiz } from '@/course/interfaces/Content';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuiz } from '@/course/contexts/QuizContext';
import SingleChoice from './SingleChoice';
import TrueFalse from './TrueFlase';
import ShortAnswer from './ShortAnswer';
import QuizResults from './QuizResults';

interface QuizComponentProps {
  quizzes: Quiz[];
}

const QuizComponent: React.FC<QuizComponentProps> = React.memo(({ quizzes }) => {
  const { 
    currentQuestionIndex, 
    userAnswers, 
    nextQuestion, 
    previousQuestion, 
    submitAnswer, 
    quizCompleted 
  } = useQuiz();
  
  const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const currentQuiz = quizzes[currentQuestionIndex];

  const handleAnswerSelect = useCallback((answerIndex: number, value?: boolean) => {
    if (!currentQuiz) return;
    
    switch (currentQuiz.type) {
      case 'Single':
        submitAnswer(currentQuestionIndex, [answerIndex]);
        break;
      case 'MultipleChoice':
        const currentAnswers = userAnswers[currentQuestionIndex] || [];
        const newAnswers = currentAnswers.includes(answerIndex)
          ? currentAnswers.filter((i) => i !== answerIndex)
          : [...currentAnswers, answerIndex];
        submitAnswer(currentQuestionIndex, newAnswers);
        break;
      case 'TrueOrFalse':
        // Para TrueOrFalse, convertimos el boolean a un índice (0 para false, 1 para true)
        const answerValue = value ? 1 : 0;
        submitAnswer(currentQuestionIndex, [answerValue]);
        break;
    }
  }, [currentQuiz, submitAnswer, userAnswers, currentQuestionIndex]);

  const handleShortAnswerChange = useCallback((answer: string) => {
    if (currentQuiz) {
      // Para respuestas cortas, guardamos el texto como respuesta
      // Esto podría necesitar ajuste según cómo maneje el backend las respuestas de texto
      submitAnswer(currentQuestionIndex, [0]); // Placeholder, necesita ajuste
    }
  }, [currentQuiz, submitAnswer, currentQuestionIndex]);

  const handleNext = useCallback(() => {
    nextQuestion();
  }, [nextQuestion]);

  const handlePrevious = useCallback(() => {
    previousQuestion();
  }, [previousQuestion]);

  const restartQuiz = useCallback(() => {
    // El contexto maneja el restart
    window.location.reload(); // Temporal hasta implementar reset correcto
  }, []);

  if (quizCompleted) {
    return (
      <QuizResults
        quizzes={quizzes}
        selectedAnswers={userAnswers}
        shortAnswers={{}} // Necesita ajuste para respuestas cortas
        onRestart={restartQuiz}
        letters={letters}
      />
    );
  }

  if (!currentQuiz) {
    return <div>Cargando pregunta...</div>;
  }

  const renderQuestionInput = () => {
    const currentAnswers = userAnswers[currentQuestionIndex] || [];
    
    switch (currentQuiz.type) {
      case 'ShortAnswer':
        return (
          <ShortAnswer
            value="" // Necesita implementación para respuestas cortas
            onChange={handleShortAnswerChange}
          />
        );
      case 'TrueOrFalse':
        return (
          <TrueFalse
            quiz={currentQuiz}
            selectedAnswers={currentAnswers.reduce((acc, answerIndex) => {
              acc[answerIndex] = answerIndex === 1;
              return acc;
            }, {} as { [key: number]: boolean })}
            onAnswerSelect={handleAnswerSelect}
          />
        );
      default:
        return (
          <SingleChoice
            quiz={currentQuiz}
            selectedAnswers={currentAnswers}
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
          <h2 className="text-2xl font-bold text-white mb-2">Pregunta {currentQuestionIndex + 1} de {quizzes.length}</h2>
          <div className="w-full bg-white/30 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / quizzes.length) * 100}%` }}
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
              disabled={currentQuestionIndex === 0}
              className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-all duration-300 ${
                currentQuestionIndex === 0
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
              <span>{currentQuestionIndex === quizzes.length - 1 ? 'Ver Resultados' : 'Siguiente'}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

QuizComponent.displayName = 'QuizComponent';

export default QuizComponent;