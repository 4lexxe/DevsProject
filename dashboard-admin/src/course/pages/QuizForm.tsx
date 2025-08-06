import { useForm, useFieldArray } from "react-hook-form";
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
  QuizFormActions,
  QuizErrors,
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
    difficulty?: "easy" | "medium" | "hard";
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
  const [serverErrors, setServerErrors] = useState<
    Array<{ path: string; message: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  // Detectar si estamos en modo edición
  const isEditMode = location.pathname.includes("/edit");

  const handleCancel = () => {
    navigate(-1); // Volver a la página anterior
  };

  // Función para transformar Quiz a FormQuiz
  const transformQuizToFormQuiz = (quiz: any[]): FormQuiz[] => {
    return quiz.map((q, index) => ({
      id: q.id?.toString() || crypto.randomUUID(), // Convertir número a string, o generar nuevo ID
      question: q.question || "", // Campo de pregunta
      description: q.description || q.text || "", // Usar description o text como fallback
      markdown: q.markdown || "", // Valor por defecto vacío
      order: q.order || index + 1, // Usar order del backend o índice + 1
      points: q.points || 1, // Valor por defecto 1 punto
      explanation: q.explanation || "", // Valor por defecto vacío
      image: q.image || "", // Valor por defecto vacío
      type: q.type || "MultipleChoice", // Valor por defecto MultipleChoice
      answers: q.answers?.map((answer: any) => ({
        id: answer.id?.toString() || crypto.randomUUID(), // Convertir a string o generar ID
        text: answer.text || "", // Texto de respuesta
        isCorrect: answer.isCorrect || false, // Valor por defecto false
        explanation: answer.explanation || "", // Valor por defecto vacío
      })) || [{ id: crypto.randomUUID(), text: "", isCorrect: false }], // Array vacío si no hay respuestas
      metadata: q.metadata ? {
        difficulty: (q.metadata.difficulty as "easy" | "medium" | "hard") || "medium", // Valor por defecto medium
        tags: q.metadata.tags?.join(", ") || "", // Convertir array a string, o vacío
      } : {
        difficulty: "medium" as const, // Valores por defecto si no hay metadata
        tags: "",
      },
    }));
  };

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    reset,
    trigger,
  } = useForm<FormState>({
    resolver: zodResolver(quizSchema) as any, // Temporarily cast to any to avoid type conflicts
    mode: "onChange", // Validar en tiempo real
    reValidateMode: "onChange", // Re-validar cuando cambian los campos
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
        
        if (quizData && quizData.quiz && quizData.quiz.length > 0) {
          const formattedQuiz = transformQuizToFormQuiz(quizData.quiz);
          reset({ quiz: formattedQuiz });
        } else {
          console.log("No quiz data found, using default values");
        }
      } catch (error) {
        console.error("Error al cargar los datos del quiz:", error);
        setSubmitError(
          "Error al cargar los datos del quiz. Se mostrarán valores por defecto."
        );
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
      
      // Los datos ya vienen transformados por el schema de Zod
      // No necesitamos transformación manual aquí
      await saveContentQuiz(contentId, { quiz: data.quiz });
      navigate(-1);
    } catch (error: any) {
      console.error("Error al guardar el quiz:", error);

      let errorMessage =
        "Error al guardar el quiz. Por favor, inténtalo de nuevo.";
      let validationErrors: Array<{ path: string; message: string }> = [];

      if (error?.response?.data) {
        const serverError = error.response.data;

        if (serverError.errors && Array.isArray(serverError.errors)) {
          validationErrors = serverError.errors.map((err: any) => ({
            path: err.path || err.param || "campo",
            message: err.msg || err.message || "Error de validación",
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

  const handleAddQuestion = async () => {
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
    
    // Forzar revalidación de todas las preguntas para mantener errores existentes
    setTimeout(() => {
      trigger();
    }, 100);
  };

  return (
    <div className="w-full p-6">
      <QuizFormHeader isEditMode={isEditMode} />

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

          <QuizErrors
            submitError={submitError}
            serverErrors={serverErrors}
            formErrors={errors}
          />

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
