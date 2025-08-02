import { Control, Controller, UseFormRegister, FieldErrors } from "react-hook-form";
import { PlusIcon, X } from "lucide-react";
import QuizCustomInput from "./QuizCustomInput";

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

interface QuizAnswersSectionProps {
  questionIndex: number;
  control: Control<FormState>;
  register: UseFormRegister<FormState>;
  errors: FieldErrors<FormState>;
}

export default function QuizAnswersSection({ 
  questionIndex, 
  control, 
  register, 
  errors 
}: QuizAnswersSectionProps) {
  return (
    <div className="space-y-3 border-t pt-6">
      <label className="block text-sm font-semibold text-gray-700">
        Respuestas
      </label>
      
      <Controller
        name={`quiz.${questionIndex}.answers` as const}
        control={control}
        render={({ field }) => (
          <div className="space-y-3">
            <div className="space-y-3">
              {field.value.map((_, answerIndex) => (
                <div
                  key={answerIndex}
                  className="bg-gray-50 p-4 rounded-lg space-y-3 border border-gray-200"
                >
                  <div className="flex items-start">
                    <div className="flex-grow">
                      <QuizCustomInput
                        id={`answer-${questionIndex}-${answerIndex}`}
                        label={`Respuesta ${answerIndex + 1}`}
                        register={register(
                          `quiz.${questionIndex}.answers.${answerIndex}.text` as const
                        )}
                        error={
                          errors.quiz?.[questionIndex]?.answers?.[
                            answerIndex
                          ]?.text?.message
                        }
                      />
                    </div>
                    <div className="flex items-start gap-2 pl-2 pt-7">
                      <label className="flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
                        <input
                          type="checkbox"
                          {...register(
                            `quiz.${questionIndex}.answers.${answerIndex}.isCorrect` as const
                          )}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="text-sm text-gray-700 font-medium">
                          Correcta
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const newAnswers = [...field.value];
                          newAnswers.splice(answerIndex, 1);
                          field.onChange(newAnswers);
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-100 rounded-md transition-colors duration-200"
                        title="Eliminar respuesta"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Explicación de la respuesta */}
                  <QuizCustomInput
                    id={`answer-explanation-${questionIndex}-${answerIndex}`}
                    label="Explicación de la respuesta (opcional)"
                    placeholder="Explica por qué esta respuesta es correcta o incorrecta..."
                    register={register(
                      `quiz.${questionIndex}.answers.${answerIndex}.explanation` as const
                    )}
                    error={
                      errors.quiz?.[questionIndex]?.answers?.[
                        answerIndex
                      ]?.explanation?.message
                    }
                  />
                </div>
              ))}
            </div>
            
            {/* Botón para agregar respuesta */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() =>
                  field.onChange([
                    ...field.value,
                    { id: crypto.randomUUID(), text: "", isCorrect: false },
                  ])
                }
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-md hover:bg-green-100 transition-colors duration-200 border border-green-200"
              >
                <PlusIcon className="h-4 w-4 mr-1.5" />
                Agregar Respuesta
              </button>
              
              <div className="text-xs text-gray-500">
                {field.value.length} respuesta{field.value.length !== 1 ? 's' : ''} configurada{field.value.length !== 1 ? 's' : ''}
              </div>
            </div>
            
            {/* Error específico para las respuestas */}
            {errors.quiz?.[questionIndex]?.answers?.message && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error en las respuestas</h3>
                    <p className="text-red-700 text-sm font-medium mt-1">
                      {errors.quiz[questionIndex]?.answers?.message}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      />
    </div>
  );
}
