import React, { createContext, useContext, useEffect, useState } from "react";
import { Quiz } from "../interfaces/CourseForm";

interface QuizContextType {
  quizState: Quiz[];
  isAddingQuiz: boolean;
  isEditingQuiz: boolean;
  currentQuizIndex: number | null;
  addQuiz: (newQuiz: Quiz[]) => void;
  resetQuizState: () => void;
  startAddingQuiz: () => void;
  startEditingQuiz: () => void;
  cancelQuizAction: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);
const STORAGE_KEY = "quiz-data";

const getInitialState = (): Quiz[] => {
  const storedData = sessionStorage.getItem(STORAGE_KEY);
  if (storedData) {
    try {
      return JSON.parse(storedData);
    } catch (error) {
      console.error("Error parsing stored quiz data:", error);
    }
  }
  return [];
};

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [quizState, setQuizState] = useState<Quiz[]>(getInitialState);
  const [isAddingQuiz, setIsAddingQuiz] = useState(false);
  const [isEditingQuiz, setIsEditingQuiz] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number | null>(null);

  // 🔹 Guardar en sessionStorage cada vez que el estado cambia
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(quizState));
  }, [quizState]);

  /*** ✅ Métodos para manejar el estado ***/

  // Agregar un nuevo quiz
  const addQuiz = (newQuiz: Quiz[]) => {
    setQuizState(newQuiz);
    setIsAddingQuiz(false); // 🔹 Finaliza el modo de agregar
    setIsEditingQuiz(false); 
  };

  // 🔹 Reiniciar todo el estado del quiz (similar a clearQuizzes pero más claro)
  const resetQuizState = () => {
    setQuizState([]);
    setIsAddingQuiz(false);
    setIsEditingQuiz(false);
    setCurrentQuizIndex(null);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  // Activar el modo de añadir un quiz
  const startAddingQuiz = () => {
    setIsAddingQuiz(true);
    setIsEditingQuiz(false);
    setCurrentQuizIndex(null);
  };

  // Activar el modo de edición
  const startEditingQuiz = () => {
    setIsEditingQuiz(true);
    setIsAddingQuiz(false);
  };

  // Cancelar cualquier acción de agregar o editar
  const cancelQuizAction = () => {
    setIsAddingQuiz(false);
    setIsEditingQuiz(false);
    setCurrentQuizIndex(null);
  };

  return (
    <QuizContext.Provider
      value={{
        quizState,
        isAddingQuiz,
        isEditingQuiz,
        currentQuizIndex,
        addQuiz,
        resetQuizState,
        startAddingQuiz,
        startEditingQuiz,
        cancelQuizAction,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

// Hook para usar el contexto
export function useQuizContext() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuizContext must be used within a QuizProvider");
  }
  return context;
}
