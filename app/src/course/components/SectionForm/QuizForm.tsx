import { useForm, useFieldArray, Controller } from "react-hook-form";
import { PlusIcon, MinusIcon, Save, X } from "lucide-react";
import { quizTypes, type Quiz } from "@/course/interfaces/Content";
import { useQuizContext } from "@/course/context/QuizFormContext";
import { useSectionContext } from "@/course/context/SectionFormContext";
import { quizSchema } from "@/course/validations/contentSchema";
import { zodResolver } from "@hookform/resolvers/zod";

import QuizCustomInput from "./QuizCustomInput";
import QuizCustomSelect from "./QuizCustomSelect";

interface FormState {
  quiz: Quiz[];
}

export default function QuizForm() {
  const { quizState, cancelQuizAction } = useQuizContext();
  const { state: sectionState, addQuizToContent } = useSectionContext();

  const content = sectionState.section?.contents.find(
    (content) => content.id === quizState.contentId
  );

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormState>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      quiz: content?.quiz ?? [
        {
          question: "",
          type: "MultipleChoice",
          answers: [{ answer: "", isCorrect: false }],
        },
      ],
    },
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: "quiz",
  });

  const onSubmit = (data: FormState) => {
    addQuizToContent(quizState.contentId, data.quiz);
    cancelQuizAction();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
      {questionFields.map((field, questionIndex) => (
        <div
          key={field.id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="bg-gray-50 px-4 sm:px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                Pregunta {questionIndex + 1}
              </h2>
              <button
                type="button"
                onClick={() => removeQuestion(questionIndex)}
                className="inline-flex items-center px-2.5 py-1.5 text-sm text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors duration-200"
              >
                <MinusIcon className="h-4 w-4 mr-1.5" />
                Eliminar
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-6">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <QuizCustomInput
                id={`image-${questionIndex}`}
                label="Imagen URL"
                register={register(`quiz.${questionIndex}.image` as const)}
                error={errors.quiz?.[questionIndex]?.image?.message}
              />

              <QuizCustomInput
                id={`text-${questionIndex}`}
                label="Texto"
                register={register(`quiz.${questionIndex}.text` as const)}
                error={errors.quiz?.[questionIndex]?.text?.message}
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Respuestas
              </label>
              <Controller
                name={`quiz.${questionIndex}.answers` as const}
                control={control}
                render={({ field }) => (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      {field.value.map((_, answerIndex) => (
                        <div
                          key={answerIndex}
                          className="flex items-start bg-gray-50 p-3 rounded-lg"
                        >
                          <div className="flex-grow">
                            <QuizCustomInput
                              id={`answer-${questionIndex}-${answerIndex}`}
                              label={`Respuesta ${answerIndex + 1}`}
                              register={register(
                                `quiz.${questionIndex}.answers.${answerIndex}.answer` as const
                              )}
                              error={
                                errors.quiz?.[questionIndex]?.answers?.[
                                  answerIndex
                                ]?.answer?.message
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
                              <span className="text-sm text-gray-700">
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
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        field.onChange([
                          ...field.value,
                          { answer: "", isCorrect: false },
                        ])
                      }
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-md hover:bg-green-100 transition-colors duration-200"
                    >
                      <PlusIcon className="h-4 w-4 mr-1.5" />
                      Agregar Respuesta
                    </button>
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          appendQuestion({
            question: "",
            type: "MultipleChoice",
            answers: [{ answer: "", isCorrect: false }],
          })
        }
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-md hover:bg-green-100 transition-colors duration-200"
      >
        <PlusIcon className="h-4 w-4 mr-1.5" />
        Agregar Pregunta
      </button>
      <div className="flex items-center justify-end pt-4">
        <button
          type="button"
          onClick={cancelQuizAction}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 mr-4"
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </button>

        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-sm"
        >
          <Save className="w-4 h-4 mr-2" />
          Guardar Quiz
        </button>
      </div>
    </form>
  );
}
