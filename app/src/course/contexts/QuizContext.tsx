import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { getQuizByContentId } from '../services/contentServices';

// Definir tipos para los datos del quiz
interface QuizAnswer {
  id: number;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

interface QuizQuestion {
  id: number;
  text: string;
  type: "MultipleChoice" | "TrueOrFalse" | "ShortAnswer" | "Single";
  image: string;
  order: number;
  points: number;
  answers: QuizAnswer[];
  metadata: {
    tags: string[];
    category: string;
    difficulty: "easy" | "medium" | "hard" | "beginner" | "intermediate";
    estimatedTime: number;
  };
  question: string;
  description: string;
  explanation: string;
}

interface QuizData {
  quiz: QuizQuestion[];
  id: string;
}

// Estado del contexto
interface QuizContextState {
  quizData: QuizData | null;
  loading: boolean;
  error: string | null;
  currentQuestionIndex: number;
  userAnswers: Record<number, number[] | string | { [key: number]: boolean }>; // questionId -> diferentes tipos de respuestas
  quizCompleted: boolean;
  score: number;
  totalQuestions: number;
}

// Acciones del contexto
interface QuizContextActions {
  loadQuiz: (contentId: string) => Promise<void>;
  nextQuestion: () => void;
  previousQuestion: () => void;
  goToQuestion: (index: number) => void;
  submitAnswer: (questionId: number, answer: number[] | string | { [key: number]: boolean }) => void;
  completeQuiz: () => void;
  resetQuiz: () => void;
  calculateScore: () => number;
}

// Tipo completo del contexto
interface QuizContextType extends QuizContextState, QuizContextActions {}

// Crear el contexto
const QuizContext = createContext<QuizContextType | undefined>(undefined);

// Funciones de sessionStorage
const STORAGE_KEY_PREFIX = 'quiz_session_';

const saveToSessionStorage = (contentId: string, data: any) => {
  try {
    const key = `${STORAGE_KEY_PREFIX}${contentId}`;
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn('Error al guardar en sessionStorage:', error);
  }
};

const loadFromSessionStorage = (contentId: string) => {
  try {
    const key = `${STORAGE_KEY_PREFIX}${contentId}`;
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.warn('Error al cargar de sessionStorage:', error);
    return null;
  }
};

const clearSessionStorage = (contentId: string) => {
  try {
    const key = `${STORAGE_KEY_PREFIX}${contentId}`;
    sessionStorage.removeItem(key);
  } catch (error) {
    console.warn('Error al limpiar sessionStorage:', error);
  }
};

// Hook personalizado para usar el contexto
export const useQuiz = (): QuizContextType => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz debe ser usado dentro de un QuizProvider');
  }
  return context;
};

// Props del provider
interface QuizProviderProps {
  children: ReactNode;
}

// Provider del contexto
export const QuizProvider: React.FC<QuizProviderProps> = ({ children }) => {
  // Estado
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number[] | string | { [key: number]: boolean }>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [currentContentId, setCurrentContentId] = useState<string | null>(null);

  // Propiedades calculadas
  const totalQuestions = quizData?.quiz?.length || 0;

  // Efecto para guardar el estado en sessionStorage cuando cambia (optimizado)
  useEffect(() => {
    if (currentContentId && quizData) {
      const sessionData = {
        currentQuestionIndex,
        userAnswers,
        quizCompleted,
        score,
        timestamp: Date.now() // Para saber cuándo se guardó
      };
      
      // Solo guardamos si hay cambios significativos
      const prevData = loadFromSessionStorage(currentContentId);
      const hasChanges = !prevData || 
        prevData.currentQuestionIndex !== currentQuestionIndex ||
        JSON.stringify(prevData.userAnswers) !== JSON.stringify(userAnswers) ||
        prevData.quizCompleted !== quizCompleted;
      
      if (hasChanges) {
        console.log('=== GUARDANDO EN SESSION STORAGE ===');
        console.log('Content ID:', currentContentId);
        console.log('Datos guardados:', sessionData);
        
        saveToSessionStorage(currentContentId, sessionData);
      }
    }
  }, [currentContentId, currentQuestionIndex, userAnswers, quizCompleted, score, quizData]);

  // Función para cargar el estado desde sessionStorage
  const loadSessionData = (contentId: string) => {
    const sessionData = loadFromSessionStorage(contentId);
    
    if (sessionData) {
      console.log('=== CARGANDO DE SESSION STORAGE ===');
      console.log('Datos recuperados:', sessionData);
      
      // Verificar que los datos no sean muy antiguos (opcional, ej: 24 horas)
      const isRecent = Date.now() - sessionData.timestamp < 24 * 60 * 60 * 1000;
      
      if (isRecent) {
        setCurrentQuestionIndex(sessionData.currentQuestionIndex || 0);
        setUserAnswers(sessionData.userAnswers || {});
        setQuizCompleted(sessionData.quizCompleted || false);
        setScore(sessionData.score || 0);
        
        console.log('Progreso restaurado:');
        console.log('- Pregunta actual:', sessionData.currentQuestionIndex + 1);
        console.log('- Respuestas guardadas:', Object.keys(sessionData.userAnswers || {}).length);
        console.log('- Quiz completado:', sessionData.quizCompleted);
        
        return true; // Indica que se cargaron datos
      } else {
        console.log('Datos de sesión expirados, empezando desde el inicio');
        clearSessionStorage(contentId);
      }
    }
    
    return false; // No se cargaron datos
  };

  // Acciones optimizadas con useCallback
  const loadQuiz = useCallback(async (contentId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    setCurrentContentId(contentId);
    
    try {
      console.log('=== CARGANDO QUIZ ===');
      console.log('Content ID:', contentId);
      
      const data = await getQuizByContentId(contentId);
      console.log('Datos recibidos:', JSON.stringify(data, null, 2));
      
      if (data && data.quiz && data.quiz.length > 0) {
        setQuizData(data);
        
        // Intentar cargar el progreso guardado
        const sessionLoaded = loadSessionData(contentId);
        
        if (!sessionLoaded) {
          // Si no hay datos de sesión, empezar desde el inicio
          console.log('No hay progreso guardado, empezando desde el inicio');
          setCurrentQuestionIndex(0);
          setUserAnswers({});
          setQuizCompleted(false);
          setScore(0);
        }
        
        console.log('Quiz cargado correctamente:', data.quiz.length, 'preguntas');
      } else {
        setError('No hay quiz disponible para este contenido');
        setQuizData(null);
      }
    } catch (err) {
      console.error('Error al cargar el quiz:', err);
      setError('Error al cargar el quiz. Por favor, inténtalo de nuevo.');
      setQuizData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const nextQuestion = useCallback((): void => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, totalQuestions]);

  const previousQuestion = useCallback((): void => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);

  const goToQuestion = useCallback((index: number): void => {
    if (index >= 0 && index < totalQuestions) {
      setCurrentQuestionIndex(index);
    }
  }, [totalQuestions]);

  const submitAnswer = useCallback((questionId: number, answer: number[] | string | { [key: number]: boolean }): void => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  }, []);

  const calculateScore = useCallback((): number => {
    if (!quizData?.quiz) return 0;

    let totalScore = 0;
    
    quizData.quiz.forEach(question => {
      const userAnswer = userAnswers[question.id];
      if (!userAnswer) return;

      const correctAnswerIds = question.answers
        .filter(answer => answer.isCorrect)
        .map(answer => answer.id);

      let isCorrect = false;

      // Manejar diferentes tipos de respuestas
      if (Array.isArray(userAnswer)) {
        // Para MultipleChoice y Single
        isCorrect = userAnswer.length === correctAnswerIds.length &&
          userAnswer.every(id => correctAnswerIds.includes(id));
      } else if (typeof userAnswer === 'string') {
        // Para ShortAnswer - necesitaría lógica específica del backend
        // Por ahora, consideramos correcto si hay texto
        isCorrect = userAnswer.trim().length > 0;
      } else if (typeof userAnswer === 'object') {
        // Para TrueOrFalse
        isCorrect = Object.entries(userAnswer).every(([answerIndex, value]) => {
          const expectedValue = correctAnswerIds.includes(parseInt(answerIndex));
          return value === expectedValue;
        });
      }

      if (isCorrect) {
        totalScore += question.points;
      }
    });

    return totalScore;
  }, [quizData, userAnswers]);

  const completeQuiz = useCallback((): void => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setQuizCompleted(true);
  }, [calculateScore]);

  const resetQuiz = useCallback((): void => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizCompleted(false);
    setScore(0);
    
    // Limpiar también los datos de sesión
    if (currentContentId) {
      console.log('=== RESETEANDO QUIZ ===');
      console.log('Limpiando datos de sesión para:', currentContentId);
      clearSessionStorage(currentContentId);
    }
  }, [currentContentId]);

  // Valor del contexto optimizado con useMemo
  const contextValue: QuizContextType = useMemo(() => ({
    // Estado
    quizData,
    loading,
    error,
    currentQuestionIndex,
    userAnswers,
    quizCompleted,
    score,
    totalQuestions,
    
    // Acciones
    loadQuiz,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    submitAnswer,
    completeQuiz,
    resetQuiz,
    calculateScore,
  }), [
    quizData,
    loading,
    error,
    currentQuestionIndex,
    userAnswers,
    quizCompleted,
    score,
    totalQuestions,
    loadQuiz,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    submitAnswer,
    completeQuiz,
    resetQuiz,
    calculateScore,
  ]);

  return (
    <QuizContext.Provider value={contextValue}>
      {children}
    </QuizContext.Provider>
  );
};

export default QuizContext;
