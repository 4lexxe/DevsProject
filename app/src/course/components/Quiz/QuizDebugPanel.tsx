import React from 'react';
import { useQuiz } from '../../contexts/QuizContext';

interface QuizDebugPanelProps {
  isVisible?: boolean;
}

const QuizDebugPanel: React.FC<QuizDebugPanelProps> = ({ isVisible = false }) => {
  const { 
    quizData, 
    userAnswers, 
    currentQuestionIndex, 
    quizCompleted, 
    score 
  } = useQuiz();
  
  // Calcular valores directamente
  const getTotalAnsweredQuestions = () => {
    return Object.keys(userAnswers).length;
  };
  
  const getProgressPercentage = () => {
    const totalQuestions = quizData?.quiz?.length || 0;
    if (totalQuestions === 0) return 0;
    return Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);
  };
  
  const hasAnyProgress = () => {
    return getTotalAnsweredQuestions() > 0 || currentQuestionIndex > 0;
  };
  
  const questionNumber = currentQuestionIndex + 1;
  const totalQuestions = quizData?.quiz?.length || 0;

  if (!isVisible || !quizData) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-black bg-opacity-80 text-white text-xs p-4 rounded-lg max-w-sm z-50">
      <div className="font-bold mb-2">🔧 Quiz Debug Panel</div>
      
      <div className="space-y-1">
        <div>📝 <strong>Quiz ID:</strong> {quizData.id}</div>
        <div>📊 <strong>Progreso:</strong> {questionNumber}/{totalQuestions} ({getProgressPercentage()}%)</div>
        <div>✅ <strong>Respondidas:</strong> {getTotalAnsweredQuestions()}</div>
        <div>🎯 <strong>Puntuación:</strong> {score} pts</div>
        <div>🔄 <strong>Completado:</strong> {quizCompleted ? 'Sí' : 'No'}</div>
        <div>💾 <strong>Progreso guardado:</strong> {hasAnyProgress() ? 'Sí' : 'No'}</div>
      </div>
      
      <div className="mt-3 pt-2 border-t border-gray-600">
        <div className="font-bold mb-1">Respuestas actuales:</div>
        <div className="max-h-24 overflow-y-auto text-xs">
          {Object.entries(userAnswers).length > 0 ? (
            Object.entries(userAnswers).map(([questionId, answerIds]) => (
              <div key={questionId}>
                Q{questionId}: [{(answerIds as number[]).join(', ')}]
              </div>
            ))
          ) : (
            <div className="text-gray-400">Sin respuestas</div>
          )}
        </div>
      </div>
      
      <div className="mt-2 pt-2 border-t border-gray-600 text-xs text-gray-400">
        Los datos se guardan automáticamente en sessionStorage
      </div>
    </div>
  );
};

export default QuizDebugPanel;
