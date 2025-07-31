import { UseFormRegister, FieldErrors, Control, useWatch } from "react-hook-form";
import { MinusIcon } from "lucide-react";
import QuizCustomInput from "./QuizCustomInput";
import QuizCustomSelect from "./QuizCustomSelect";

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
    tags?: string;
  };
}

interface FormState {
  quiz: FormQuiz[];
}

interface QuizQuestionFormProps {
  questionIndex: number;
  register: UseFormRegister<FormState>;
  errors: FieldErrors<FormState>;
  control: Control<FormState>;
  onRemoveQuestion: (index: number) => void;
}

// Componente para mostrar la descripción del tipo de quiz
interface QuizTypeDescriptionProps {
  questionIndex: number;
  control: Control<FormState>;
}

function QuizTypeDescription({ questionIndex, control }: QuizTypeDescriptionProps) {
  const watchedType = useWatch({
    control,
    name: `quiz.${questionIndex}.type`,
    defaultValue: "MultipleChoice"
  });

  const getQuizTypeDescription = (type: string) => {
    switch (type) {
      case "MultipleChoice":
        return {
          title: "Opción Múltiple",
          description: "Los estudiantes pueden seleccionar múltiples respuestas correctas de una lista de opciones. Ideal para preguntas que tienen varias respuestas válidas.",
          icon: "☑️",
          color: "bg-blue-50 border-blue-200 text-blue-800"
        };
      case "Single":
        return {
          title: "Selección Única", 
          description: "Los estudiantes deben seleccionar exactamente una respuesta correcta de las opciones disponibles. Perfecto para preguntas con una sola respuesta válida.",
          icon: "⚫",
          color: "bg-green-50 border-green-200 text-green-800"
        };
      case "TrueOrFalse":
        return {
          title: "Verdadero o Falso",
          description: "Pregunta simple con solo dos opciones: Verdadero o Falso. Debe tener exactamente 2 respuestas y solo una puede ser correcta.",
          icon: "✓/✗",
          color: "bg-purple-50 border-purple-200 text-purple-800"
        };
      case "ShortAnswer":
        return {
          title: "Respuesta Corta",
          description: "Los estudiantes escriben una respuesta breve en texto libre. Las respuestas no se marcan como correctas/incorrectas automáticamente.",
          icon: "✏️", 
          color: "bg-orange-50 border-orange-200 text-orange-800"
        };
      default:
        return {
          title: "Tipo de Quiz",
          description: "Selecciona un tipo de quiz para ver su descripción.",
          icon: "❓",
          color: "bg-gray-50 border-gray-200 text-gray-800"
        };
    }
  };

  const typeInfo = getQuizTypeDescription(watchedType);

  return (
    <div className={`rounded-lg border p-4 ${typeInfo.color}`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{typeInfo.icon}</span>
        <div className="flex-1">
          <h4 className="font-semibold text-sm mb-1">{typeInfo.title}</h4>
          <p className="text-sm leading-relaxed">{typeInfo.description}</p>
        </div>
      </div>
    </div>
  );
}

export default function QuizQuestionForm({ 
  questionIndex, 
  register, 
  errors, 
  control,
  onRemoveQuestion 
}: QuizQuestionFormProps) {
  const quizTypes = ["MultipleChoice", "TrueOrFalse", "ShortAnswer", "Single"];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-4 sm:px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            Pregunta {questionIndex + 1}
          </h2>
          <button
            type="button"
            onClick={() => onRemoveQuestion(questionIndex)}
            className="inline-flex items-center px-2.5 py-1.5 text-sm text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors duration-200"
          >
            <MinusIcon className="h-4 w-4 mr-1.5" />
            Eliminar
          </button>
        </div>
      </div>
      
      <div className="p-4 sm:p-6 space-y-6">
        {/* Campos básicos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <QuizCustomInput
            id={`question-${questionIndex}`}
            label="Pregunta"
            register={register(`quiz.${questionIndex}.question` as const)}
            error={errors.quiz?.[questionIndex]?.question?.message}
          />

          <QuizCustomSelect
            id={`type-${questionIndex}`}
            label="Tipo"
            options={quizTypes}
            register={register(`quiz.${questionIndex}.type` as const)}
            error={
              errors.quiz?.[questionIndex]?.type
                ? (errors.quiz[questionIndex]?.type as { message?: string })
                    ?.message
                : undefined
            }
          />
        </div>

        {/* Descripción del tipo de quiz */}
        <QuizTypeDescription 
          questionIndex={questionIndex} 
          control={control}
        />

        {/* Descripción */}
        <QuizCustomInput
          id={`description-${questionIndex}`}
          label="Descripción"
          register={register(`quiz.${questionIndex}.description` as const)}
          error={errors.quiz?.[questionIndex]?.description?.message}
        />

        {/* Contenido Markdown */}
        <QuizCustomInput
          id={`markdown-${questionIndex}`}
          label="Contenido Markdown (opcional)"
          placeholder="Puedes usar markdown para formatear el contenido de la pregunta..."
          register={register(`quiz.${questionIndex}.markdown` as const)}
          error={errors.quiz?.[questionIndex]?.markdown?.message}
          isTextarea={true}
        />

        {/* Orden y Puntos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <QuizCustomInput
            id={`order-${questionIndex}`}
            label="Orden"
            type="number"
            register={register(`quiz.${questionIndex}.order` as const)}
            error={errors.quiz?.[questionIndex]?.order?.message}
          />

          <QuizCustomInput
            id={`points-${questionIndex}`}
            label="Puntos"
            type="number"
            register={register(`quiz.${questionIndex}.points` as const)}
            error={errors.quiz?.[questionIndex]?.points?.message}
          />
        </div>

        {/* Imagen y Explicación */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <QuizCustomInput
            id={`image-${questionIndex}`}
            label="Imagen URL (opcional)"
            register={register(`quiz.${questionIndex}.image` as const)}
            error={errors.quiz?.[questionIndex]?.image?.message}
          />

          <QuizCustomInput
            id={`explanation-${questionIndex}`}
            label="Explicación (opcional)"
            register={register(`quiz.${questionIndex}.explanation` as const)}
            error={errors.quiz?.[questionIndex]?.explanation?.message}
          />
        </div>

        {/* Metadatos */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Metadatos (opcional)</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <QuizCustomSelect
              id={`difficulty-${questionIndex}`}
              label="Dificultad"
              options={["easy", "medium", "hard"]}
              register={register(`quiz.${questionIndex}.metadata.difficulty` as const)}
              error={errors.quiz?.[questionIndex]?.metadata?.difficulty?.message}
            />

            <QuizCustomInput
              id={`tags-${questionIndex}`}
              label="Tags (separados por comas)"
              register={register(`quiz.${questionIndex}.metadata.tags` as const)}
              error={errors.quiz?.[questionIndex]?.metadata?.tags?.message}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
