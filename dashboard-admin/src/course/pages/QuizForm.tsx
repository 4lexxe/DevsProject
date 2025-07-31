import { useForm, useFieldArray } from "react-hook-form";
import { type Quiz } from "@/course/interfaces/Content";
import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import { quizSchema } from "@/course/validations/quizSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { saveContentQuiz } from "@/course/services/contentServices";
import { getQuizByContentId } from "@/course/services/contentServices";

import {
  QuizFormHeader,
  QuizQuestionForm,
  QuizAnswersSection,
  QuizFormActions
} from "../components/QuizForm";

interface FormQuiz {
  id: string;
  question: string;
  description: string;
  markdown?: string;
  order: number;
  points: number;
  explanation?: string;
  image?: string;
  type: "MultipleChoice" | "TrueOrFalse" | "ShortAnswer" | "Single";
  answers: Array<{
    id?: string;
    text: string;
    isCorrect: boolean;
    explanation?: string;
  }>;
  metadata?: {
    difficulty?: 'easy' | 'medium' | 'hard';
    tags?: string; // Como string en el formulario, se convertirá a array al enviar
  };
}

interface FormState {
  quiz: FormQuiz[];
}

export default function QuizForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { contentId } = useParams<{ contentId: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [serverErrors, setServerErrors] = useState<Array<{path: string, message: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Detectar si estamos en modo edición
  const isEditMode = location.pathname.includes('/edit');

  const handleCancel = () => {
    navigate(-1); // Volver a la página anterior
  };

  // Función para transformar Quiz a FormQuiz
  const transformQuizToFormQuiz = (quiz: Quiz[]): FormQuiz[] => {
    return quiz.map(q => ({
      ...q,
      metadata: q.metadata ? {
        ...q.metadata,
        tags: q.metadata.tags?.join(', ') || undefined
      } : undefined
    }));
  };

  // Función para transformar FormQuiz a Quiz
  const transformFormQuizToQuiz = (formQuiz: FormQuiz[]): Quiz[] => {
    return formQuiz.map(q => ({
      ...q,
      metadata: q.metadata ? {
        ...q.metadata,
        tags: q.metadata.tags ? 
          q.metadata.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : 
          undefined
      } : undefined
    }));
  };

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<FormState>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      quiz: [
        {
          id: crypto.randomUUID(),
          question: "",
          description: "",
          markdown: "",
          order: 1,
          points: 1,
          type: "MultipleChoice",
          answers: [{ id: crypto.randomUUID(), text: "", isCorrect: false }],
        },
      ],
    },
  });

  // Cargar datos existentes en modo edición
  useEffect(() => {
    const loadQuizData = async () => {
      if (!isEditMode || !contentId) return;
      
      setIsLoading(true);
      setSubmitError(null);
      setServerErrors([]);
      
      try {
        const quizData = await getQuizByContentId(contentId);
        if (quizData && quizData.length > 0) {
          const formattedQuiz = transformQuizToFormQuiz(quizData);
          reset({ quiz: formattedQuiz });
        } else {
          console.log("No quiz data found, using default values");
        }
      } catch (error) {
        console.error("Error al cargar los datos del quiz:", error);
        setSubmitError("Error al cargar los datos del quiz. Se mostrarán valores por defecto.");
      } finally {
        setIsLoading(false);
      }
    };

    loadQuizData();
  }, [isEditMode, contentId, reset]);

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: "quiz",
  });

  const onSubmit = async (data: FormState) => {
    if (!contentId) {
      setSubmitError("ID de contenido no válido");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setServerErrors([]);
    
    try {
      const transformedQuiz = transformFormQuizToQuiz(data.quiz);
      await saveContentQuiz(contentId, { quiz: transformedQuiz });
      navigate(-1);
    } catch (error: any) {
      console.error("Error al guardar el quiz:", error);
      
      let errorMessage = "Error al guardar el quiz. Por favor, inténtalo de nuevo.";
      let validationErrors: Array<{path: string, message: string}> = [];
      
      if (error?.response?.data) {
        const serverError = error.response.data;
        
        if (serverError.errors && Array.isArray(serverError.errors)) {
          validationErrors = serverError.errors.map((err: any) => ({
            path: err.path || err.param || 'campo',
            message: err.msg || err.message || "Error de validación"
          }));
          
          setServerErrors(validationErrors);
          errorMessage = `Se encontraron ${validationErrors.length} errores de validación. Revisa los campos marcados.`;
        } else if (serverError.message) {
          errorMessage = serverError.message;
        } else if (serverError.error) {
          errorMessage = serverError.error;
        }
      } else if (error?.message) {
        errorMessage = `Error de conexión: ${error.message}`;
      }
      
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddQuestion = () => {
    appendQuestion({
      id: crypto.randomUUID(),
      question: "",
      description: "",
      markdown: "",
      order: questionFields.length + 1,
      points: 1,
      type: "MultipleChoice",
      answers: [{ id: crypto.randomUUID(), text: "", isCorrect: false }],
    });
  };

  return (
    <div className="w-full p-6">
      <QuizFormHeader
        isEditMode={isEditMode}
        isLoading={isLoading}
        submitError={submitError}
        serverErrors={serverErrors}
      />

      {!isLoading && (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
          {questionFields.map((field, questionIndex) => (
            <div key={field.id} className="space-y-6">
              <QuizQuestionForm
                questionIndex={questionIndex}
                register={register}
                errors={errors}
                control={control}
                onRemoveQuestion={removeQuestion}
              />
              
              <QuizAnswersSection
                questionIndex={questionIndex}
                control={control}
                register={register}
                errors={errors}
              />
            </div>
          ))}

          <QuizFormActions
            isSubmitting={isSubmitting}
            questionFields={questionFields}
            onCancel={handleCancel}
            onAddQuestion={handleAddQuestion}
          />
        </form>
      )}
    </div>
  );
}
