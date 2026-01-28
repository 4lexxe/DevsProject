import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { QuizProvider, useQuiz } from "../contexts/QuizContext";
import { Quiz } from "../interfaces/Content";
import QuizComponent from "../components/Quiz/PaginationQuiz";
import AccessDenied from "@/shared/components/AccessDenied";
import { getQuizByContentId } from "../services/contentServices";

// Función para transformar los datos del backend al formato que espera el componente
const transformQuizData = (backendQuiz: any[]): Quiz[] => {
  return backendQuiz.map(quiz => ({
    id: quiz.id.toString(),
    question: quiz.question,
    text: quiz.text || "",
    image: quiz.image || "",
    type: quiz.type,
    answers: quiz.answers.map((answer: any) => ({
      answer: answer.text, // Mapear 'text' a 'answer'
      isCorrect: answer.isCorrect
    }))
  }));
};

// Componente interno que usa el contexto
function QuizPageContent() {
  const { contentId } = useParams<{ contentId: string }>();
  const { 
    quizData, 
    loadQuiz
  } = useQuiz();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!contentId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        
        const data = await getQuizByContentId(contentId);
        
        if (data && data.quiz && data.quiz.length > 0) {
          loadQuiz(contentId, data);
        } else {
          setError('No hay quiz disponible para este contenido');
        }
      } catch (err: any) {
        console.error('Error al cargar el quiz:', err);
        setError(err.response?.data?.message || 'Error al cargar el quiz. Por favor, inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuiz();
  }, [contentId, loadQuiz]);

  // Estados de carga
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Cargando quiz...</div>
        </div>
      </div>
    );
  }

  if (error) {
    const isAccessDenied = error.includes('acceso') || error.includes('No tienes acceso') || error.toLowerCase().includes('denied');
    if (isAccessDenied) {
      return <AccessDenied message={error} fullScreen />;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <div className="text-xl text-gray-800 mb-2">Error al cargar el quiz</div>
          <div className="text-gray-600 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!quizData || !quizData.quiz || quizData.quiz.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <div className="text-xl text-gray-600">No hay quiz disponible para este contenido</div>
          <div className="text-gray-500 mt-2">Este contenido no tiene preguntas asociadas.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <QuizComponent quizzes={transformQuizData(quizData.quiz)} />
    </div>
  );
}

// Componente principal con el provider
function QuizPage() {
  return (
    <QuizProvider>
      <QuizPageContent />
    </QuizProvider>
  );
}

export default QuizPage;