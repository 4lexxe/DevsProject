import { useState, useEffect } from "react";
import { useForm, type SubmitHandler, useFieldArray } from "react-hook-form";
import {
  IContentInput,
  linkTypes,
  quizTypes,
} from "@/course/interfaces/CourseFormInterfaces";

import MarkdownPreview from "../previews/MarkdownPreview";

import CustomInput from "@/shared/components/inputs/CustomInput";
import SelectInput from "@/shared/components/inputs/SelectInput";
import TextAreaInput from "@/shared/components/inputs/TextAreaInput";
import { Save, X } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { contentSchema } from "@/course/validations/contentSchema";
import { useCourseContext } from "@/course/context/CourseFormContext";
import { useQuizContext } from "@/course/context/QuizFormContext";

interface propsContentForm {
  sectionId: string;
}

export default function ContentForm({ sectionId }: propsContentForm) {
  const { state: courseState, saveContent, cancelEdit } = useCourseContext();
  const initialData = courseState.editingContent;
  const { quizState, startAddingQuiz, startEditingQuiz } = useQuizContext();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<IContentInput>({
    /* resolver: zodResolver(contentSchema), */
    defaultValues: {
      title: initialData?.title || "",
      text: initialData?.text || "",

      markdown: initialData?.markdown || undefined,

      linkType: initialData?.linkType || undefined,
      link: initialData?.link || undefined,

      quiz: quizState || undefined,

      resources: initialData?.resources || undefined,

      duration: initialData?.duration || undefined,
      position: initialData?.position || 0,
    },
  });

  const markdown = watch("markdown");

  const {
    fields: resourceFields,
    append: appendResource,
    remove: removeResource,
  } = useFieldArray({
    control,
    name: "resources",
  });

  const onSubmit: SubmitHandler<IContentInput> = async (data) => {
    saveContent(sectionId, data);
  };

  return (
    <div className="w-full mx-auto p-6">
      {/* max-w-4xl */}
      <h2 className="text-2xl font-semibold mb-6">Añadir Nuevo Contenido</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomInput
            name="title"
            type="text"
            labelText="Título del Contenido"
            register={register}
            error={errors.title?.message}
          />
          <CustomInput
            name="text"
            type="text"
            labelText="Texto"
            register={register}
            error={errors.text?.message}
          />

          <SelectInput
            name="linkType"
            register={register}
            labelText="Tipo de Link"
            placeholder="Seleccione algún tipo"
            error={errors.linkType?.message}
            options={linkTypes.map((linkType) => ({
              value: linkType,
              label: linkType,
            }))}
          />

          <CustomInput
            name="link"
            type="text"
            labelText="Link"
            register={register}
            error={errors.link?.message}
          />

          <TextAreaInput
            name="markdown"
            labelText="Texto en markdown"
            rows={4}
            register={register}
            error={errors.markdown?.message}
          />

          <MarkdownPreview markdown={markdown || ""} />
        </div>

        <div className="space-y-4">
          {(quizState.length > 0) ? (
            <button
              className="px-4 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
              onClick={startEditingQuiz}
            >
              Editar Cuestionario
            </button>
          ) : (
            <button
              className="px-4 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
              onClick={startAddingQuiz}
            >
              Añadir Cuestionario
            </button>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Resources</h3>
          {resourceFields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-md space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Resource Title"
                  {...register(`resources.${index}.title` as const)}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Resource URL"
                  {...register(`resources.${index}.url` as const)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <button
                type="button"
                className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200"
                onClick={() => removeResource(index)}
              >
                Remove Resource
              </button>
            </div>
          ))}
          <button
            type="button"
            className="px-4 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
            onClick={() => appendResource({ title: "", url: "" })}
          >
            Add Resource
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomInput
            name="duration"
            type="number"
            labelText="Duración (en minutos)"
            register={register}
            error={errors.duration?.message}
            min={1}
          />
          <CustomInput
            name="position"
            type="number"
            labelText="Posición"
            register={register}
            error={errors.position?.message}
            disabled={true}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={cancelEdit}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 mr-6"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
