import { useForm, useFieldArray, Controller } from "react-hook-form";
import { PlusIcon, MinusIcon, Save, X } from "lucide-react";
import { quizTypes, type Quiz } from "@/course/interfaces/Content";
import { useQuizContext } from "@/course/context/QuizFormContext";
import { useSectionContext } from "@/course/context/SectionFormContext";
import { quizSchema } from "@/course/validations/contentSchema";
import { zodResolver } from "@hookform/resolvers/zod";

import QuizCustomInput from "./inputs/QuizCustomInput";
import QuizCustomSelect from "./inputs/QuizCustomSelect";

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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "quiz",
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mx-auto">
      {fields.map((field, questionIndex) => (
        <div key={field.id} className="bg-white p-6 space-y-4 rounded-md">
          <h2 className="text-xl font-semibold">
            Pregunta {questionIndex + 1}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <QuizCustomInput
              id={`question-${questionIndex}`}
              label="Pregunta"
              register={register(`quiz.${questionIndex}.question` as const)}
              error={errors.quiz?.[questionIndex]?.question?.message}
            />

            <QuizCustomSelect
              id={`type-${questionIndex}`}
              label="Tipo"
              options={quizTypes} // Ahora funciona correctamente
              register={register(`quiz.${questionIndex}.type` as const)}
              error={
                errors.quiz?.[questionIndex]?.type
                  ? (errors.quiz[questionIndex]?.type as { message?: string })
                      ?.message
                  : undefined
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* Answers Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Respuestas
            </label>
            <Controller
              name={`quiz.${questionIndex}.answers` as const}
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  {field.value.map((_, answerIndex) => (
                    <div
                      key={answerIndex}
                      className="flex items-center space-x-2"
                    >
                      <QuizCustomInput
                        id={`answer-${questionIndex}-${answerIndex}`}
                        label={`Respuesta ${answerIndex + 1}`}
                        register={register(
                          `quiz.${questionIndex}.answers.${answerIndex}.answer` as const
                        )}
                        error={
                          errors.quiz?.[questionIndex]?.answers?.[answerIndex]
                            ?.answer?.message
                        }
                      />
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          {...register(
                            `quiz.${questionIndex}.answers.${answerIndex}.isCorrect` as const
                          )}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <label className="text-sm text-gray-700">
                          Correcta
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newAnswers = [...field.value];
                          newAnswers.splice(answerIndex, 1);
                          field.onChange(newAnswers);
                        }}
                        className="p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      field.onChange([
                        ...field.value,
                        { answer: "", isCorrect: false },
                      ])
                    }
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Agregar Respuesta
                  </button>
                </div>
              )}
            />
          </div>

          <button
            type="button"
            onClick={() => remove(questionIndex)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex"
          >
            <MinusIcon className="h-4 w-4 mr-2" />
            Eliminar Pregunta
          </button>
        </div>
      ))}

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md flex"
        >
          <Save className="h-5 w-5 mr-2" />
          Guardar
        </button>
      </div>
    </form>
  );
}
