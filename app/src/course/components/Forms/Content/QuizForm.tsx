import { useForm, useFieldArray, Controller } from "react-hook-form";
import { PlusIcon, MinusIcon } from "lucide-react";
import {
  quizType,
  quizTypes,
  Quiz,
} from "@/course/interfaces/Content";
import { useQuizContext } from "@/course/context/QuizFormContext";
import { Save, X } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { quizSchema } from "@/course/validations/contentSchema";

interface FormState {
  quiz: Quiz[];
}
export default function QuizForm() {
  const { quizState, addQuiz, cancelQuizAction } = useQuizContext();

  const { control, handleSubmit, register, formState: { errors } } = useForm<FormState>({
    /* resolver: zodResolver(quizSchema), */
    defaultValues: {
      quiz: [
        {
          question: "",
          type: "Multiple Choice",
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
    addQuiz(data.quiz);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {questionFields.map((field, questionIndex) => (
        <div key={field.id} className="bg-white rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Question {questionIndex + 1}</h2>
  
          {/* Campo de pregunta */}
          <div>
            <label
              htmlFor={`question-${questionIndex}`}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Question:
            </label>
            <input
              id={`question-${questionIndex}`}
              {...register(`quiz.${questionIndex}.question` as const)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.quiz?.[questionIndex]?.question && (
              <p className="mt-1 text-xs text-red-500">
                {errors.quiz[questionIndex].question.message}
              </p>
            )}
          </div>
  
          {/* Campo de tipo de pregunta */}
          <div>
            <label
              htmlFor={`type-${questionIndex}`}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Type:
            </label>
            <select
              id={`type-${questionIndex}`}
              {...register(`quiz.${questionIndex}.type` as const)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {quizTypes.map((quizType, index) => (
                <option value={quizType} key={index}>
                  {quizType}
                </option>
              ))}
            </select>
          </div>
  
          {/* Campo de URL de la imagen */}
          <div>
            <label
              htmlFor={`image-${questionIndex}`}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Image URL:
            </label>
            <input
              id={`image-${questionIndex}`}
              {...register(`quiz.${questionIndex}.image` as const)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.quiz?.[questionIndex]?.image && (
              <p className="mt-1 text-xs text-red-500">
                {errors.quiz[questionIndex].image.message}
              </p>
            )}
          </div>
  
          {/* Campo de texto */}
          <div>
            <label
              htmlFor={`text-${questionIndex}`}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Text:
            </label>
            <textarea
              id={`text-${questionIndex}`}
              {...register(`quiz.${questionIndex}.text` as const)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            {errors.quiz?.[questionIndex]?.text && (
              <p className="mt-1 text-xs text-red-500">
                {errors.quiz[questionIndex].text.message}
              </p>
            )}
          </div>
  
          {/* Campo de respuestas */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Answers
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
                      <input
                        {...register(
                          `quiz.${questionIndex}.answers.${answerIndex}.answer` as const
                        )}
                        placeholder="Answer"
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.quiz?.[questionIndex]?.answers?.[answerIndex]?.answer && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.quiz[questionIndex].answers[answerIndex].answer.message}
                        </p>
                      )}
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`correct-${questionIndex}-${answerIndex}`}
                          {...register(
                            `quiz.${questionIndex}.answers.${answerIndex}.isCorrect` as const
                          )}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`correct-${questionIndex}-${answerIndex}`}
                          className="text-sm text-gray-700"
                        >
                          Correct
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newAnswers = [...field.value];
                          newAnswers.splice(answerIndex, 1);
                          field.onChange(newAnswers);
                        }}
                        className="p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
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
                    className="mt-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Answer
                  </button>
                </div>
              )}
            />
          </div>
  
          {/* Botón para eliminar pregunta */}
          <button
            type="button"
            onClick={() => removeQuestion(questionIndex)}
            className="px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center"
          >
            <MinusIcon className="h-4 w-4 mr-2" />
            Remove Question
          </button>
        </div>
      ))}
  
      {/* Botón para agregar nueva pregunta */}
      <button
        type="button"
        onClick={() =>
          appendQuestion({
            question: "",
            type: "Multiple Choice",
            answers: [{ answer: "", isCorrect: false }],
          })
        }
        className="px-4 py-2 bg-green-100 text-green-600 rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center"
      >
        <PlusIcon className="h-4 w-4 mr-2" />
        Add Question
      </button>
  
      {/* Botones de acción (Cancelar y Guardar) */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={cancelQuizAction}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 mr-6"
        >
          <X className="w-6 h-6 mr-2" />
          Cancel
        </button>
        <button
          type="submit"
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          <Save className="w-6 h-6 mr-2" />
          Save
        </button>
      </div>
    </form>
  );
}
