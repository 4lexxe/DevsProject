import React, { createContext, useContext, useState } from "react";

interface QuizState {
  contentId: string;
}

interface QuizContextType {
  quizState: QuizState;
  isAddingQuiz: boolean;
  isEditingQuiz: boolean;
  startAddingQuiz: (contentId: string) => void;
  startEditingQuiz: (contentId: string) => void;
  cancelQuizAction: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [quizState, setQuizState] = useState<QuizState>({ contentId: "" });
  const [isAddingQuiz, setIsAddingQuiz] = useState(false);
  const [isEditingQuiz, setIsEditingQuiz] = useState(false);

  // Activar el modo de añadir un quiz
  const startAddingQuiz = (contentId: string) => {
    setQuizState({ contentId });
    setIsAddingQuiz(true);
    setIsEditingQuiz(false);
  };

  // Activar el modo de edición
  const startEditingQuiz = (contentId: string) => {
    setQuizState({ contentId });
    setIsEditingQuiz(true);
    setIsAddingQuiz(false);
  };

  // Cancelar cualquier acción de agregar o editar
  const cancelQuizAction = () => {
    setQuizState({ contentId: "" });
    setIsAddingQuiz(false);
    setIsEditingQuiz(false);
  };

  return (
    <QuizContext.Provider
      value={{
        quizState,
        isAddingQuiz,
        isEditingQuiz,
        startAddingQuiz,
        startEditingQuiz,
        cancelQuizAction,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuizContext() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuizContext must be used within a QuizProvider");
  }
  return context;
}
