"use client";

import { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { IContentInput } from "@/course/interfaces/interfaces";

import CustomInput from "@/shared/components/inputs/CustomInput";
import SelectInput from "@/shared/components/inputs/SelectInput";
import TextAreaInput from "@/shared/components/inputs/TextAreaInput";
import { Save, X } from "lucide-react";


import { zodResolver } from "@hookform/resolvers/zod";
import { contentSchema, contentTypes } from "@/course/validations/contentSchema";
import { useCourseContext } from "@/course/context/CourseContext";

interface propsContentForm{
  sectionId: string;
}

export default function ContentForm({sectionId}: propsContentForm) {
  const { state: courseState, saveContent, cancelEdit } = useCourseContext();
  const initialData = courseState.editingContent;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IContentInput>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      type: initialData?.type || "",

      contentText: initialData?.contentText || "",
      contentTextTitle: initialData?.contentTextTitle || "",

      contentVideo: initialData?.contentVideo || "",
      contentVideoTitle: initialData?.contentVideoTitle || "",

      contentImage: initialData?.contentImage || "",
      contentImageTitle: initialData?.contentImageTitle || "",

      contentFile: initialData?.contentFile || "",
      contentFileTitle: initialData?.contentFileTitle || "",

      externalLink: initialData?.externalLink || "",
      externalLinkTitle: initialData?.externalLinkTitle || "",

      quizTitle: initialData?.quizTitle || "",
      quizContent: initialData?.quizContent || "",

      questions:  Array.isArray(initialData?.questions)? initialData.questions.join("\n") :  "",
      duration: initialData?.duration || undefined,

      position: initialData?.position || 0,
    },
  });

  const [contentType, setContentType] = useState("");

  const watchContentType = watch("type");
  const watchContentImage = watch("contentImage");
  const watchContentVideo = watch("contentVideo");

  useEffect(() => {
    setContentType(watchContentType);
  }, [watchContentType]);

  const onSubmit: SubmitHandler<IContentInput> = async (data) => {
    
    
    saveContent(sectionId, data)
  };

  return  ( 
    <div className="w-full max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Añadir Nuevo Contenido</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectInput
            name="type"
            labelText="Tipo de Contenido"
            register={register}
            error={errors["type"]?.message}
            options={ contentTypes.map(contentType => ({
              value: contentType,
              label: contentType,
            }))}

          />
        </div>

        {contentType === "Texto" && (
          <div className="space-y-2">
            <CustomInput
              name="contentTextTitle"
              type="text"
              labelText="Título del Texto"
              register={register}
              error={errors.contentTextTitle?.message}
            />

            <TextAreaInput
              name="contentText"
              labelText="Contenido del Texto"
              register={register}
              error={errors["contentText"]?.message}
            />
          </div>
        )}

        {contentType === "Video" && (
          <div className="space-y-2">
            <CustomInput
              name="contentVideoTitle"
              type="text"
              labelText="Título del Video"
              register={register}
              error={errors.contentVideoTitle?.message}
            />
            <CustomInput
              name="contentVideo"
              type="url"
              labelText="URL del Video"
              register={register}
              error={errors.contentVideo?.message}
            />
            {watchContentVideo && (
              <div className="mt-2">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Previsualización del Video:
                </h3>
                <video controls className="w-full max-w-md mx-auto">
                  <source src={watchContentVideo} type="video/mp4" />
                  Tu navegador no soporta el tag de video.
                </video>
              </div>
            )}
          </div>
        )}

        {contentType === "Imagen" && (
          <div className="space-y-2">
            <CustomInput
              name="contentImageTitle"
              type="text"
              labelText="Título de la Imagen"
              register={register}
              error={errors.contentImageTitle?.message}
            />
            <CustomInput
              name="contentImage"
              type="url"
              labelText="URL de la Imagen"
              register={register}
              error={errors.contentImage?.message}
            />
            {watchContentImage && (
              <div className="mt-2">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Previsualización de la Imagen:
                </h3>
                <img
                  src={watchContentImage || "/placeholder.svg"}
                  alt="Preview"
                  className="max-w-md mx-auto"
                />
              </div>
            )}
          </div>
        )}

        {contentType === "Archivo" && (
          <div className="space-y-2">
            <CustomInput
              name="contentFileTitle"
              type="text"
              labelText="Título del Archivo"
              register={register}
              error={errors.contentFileTitle?.message}
            />
            <CustomInput
              name="contentFile"
              type="url"
              labelText="URL del Archivo"
              register={register}
              error={errors.contentFile?.message}
            />
          </div>
        )}

        {contentType === "Link Externo" && (
          <div className="space-y-2">
            <CustomInput
              name="externalLinkTitle"
              type="text"
              labelText="Título del Enlace Externo"
              register={register}
              error={errors.externalLinkTitle?.message}
            />
            <CustomInput
              name="externalLink"
              type="url"
              labelText="URL del Enlace Externo"
              register={register}
              error={errors.externalLink?.message}
            />
          </div>
        )}

        {contentType === "Cuestionario" && (
          <div className="space-y-2">
            <CustomInput
              name="quizTitle"
              type="text"
              labelText="Título del Cuestionario"
              register={register}
              error={errors.quizTitle?.message}
            />

            <TextAreaInput
              name="quizContent"
              labelText="Contenido del Cuestionario"
              register={register}
              error={errors["quizContent"]?.message}
            />

            <TextAreaInput
              name="questions"
              labelText="Preguntas"
              register={register}
              error={errors["questions"]?.message}
              arrayValue={true}
            />
          </div>
        )}

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
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
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
