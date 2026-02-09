import { useForm, type SubmitHandler, useFieldArray } from "react-hook-form";
import { type IContentFormData } from "@/course/interfaces/Content";

import MarkdownEditor from "./MarkdownEditor";

import CustomInput from "@/shared/components/inputs/CustomInput";
import TextAreaInput from "@/shared/components/inputs/TextAreaInput";
import { Save, X, Plus, Trash2 } from "lucide-react";
import { useSectionContext } from "@/course/context/SectionFormContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { contentSchema } from "@/course/validations/contentSchema";

export default function ContentForm() {
  const { state: sectionState, saveContent, cancelEdit } = useSectionContext();
  const initialData = sectionState.editingContent;

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<IContentFormData>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      title: initialData?.title || "",
      text: initialData?.text || "",
      markdown: initialData?.markdown || undefined,
      resources: initialData?.resources || [],
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

  const onSubmit: SubmitHandler<IContentFormData> = async (data) => {
    saveContent(data);
  };

  return (
    <div className="w-full mx-auto p-6">
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
        </div>

        {/* Editor de Markdown con Preview */}
        <div className="w-full">
          <MarkdownEditor
            value={markdown || ""}
            onChange={(value) => setValue("markdown", value || "")}
            placeholder="Escribe tu contenido en Markdown aquí...

## Ejemplos de sintaxis:

**Texto en negrita**
*Texto en cursiva*
[Enlace](https://ejemplo.com)

### Listas:
- Item 1
- Item 2

### Código:
\`\`\`javascript
const ejemplo = 'código';
\`\`\`"
            height="600px"
            label="Contenido Markdown"
            error={errors.markdown?.message}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Resources</h3>
          {resourceFields.map((field, index) => {
            const titleError = errors?.resources?.[index]?.title;
            const urlError = errors?.resources?.[index]?.url;

            return (
              <div
                key={field.id}
                className="p-4 border rounded-md space-y-4 shadow-sm"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/*  Campo de título del recurso */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Resource Title
                    </label>
                    <input
                      type="text"
                      placeholder="Resource Title"
                      {...register(`resources.${index}.title` as const)}
                      className={`w-full p-2 border rounded-md focus:ring-2 focus:outline-none ${
                        titleError
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                    />
                    {titleError && (
                      <p className="mt-1 text-xs text-red-500">
                        {titleError.message}
                      </p>
                    )}
                  </div>

                  {/*  Campo de URL del recurso */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Resource URL
                    </label>
                    <input
                      type="text"
                      placeholder="Resource URL"
                      {...register(`resources.${index}.url` as const)}
                      className={`w-full p-2 border rounded-md focus:ring-2 focus:outline-none ${
                        urlError
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                    />
                    {urlError && (
                      <p className="mt-1 text-xs text-red-500">
                        {urlError.message}
                      </p>
                    )}
                  </div>
                </div>

                {/*  Botón para eliminar recurso */}
                <button
                  type="button"
                  className="flex items-center px-3 py-1 text-sm text-red-600 bg-red-100 rounded-md hover:bg-red-200"
                  onClick={() => removeResource(index)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove Resource
                </button>
              </div>
            );
          })}

          {/*  Botón para agregar nuevo recurso */}
          <button
            type="button"
            className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200"
            onClick={() => appendResource({ title: "", url: "" })}
          >
            <Plus className="w-4 h-4 mr-2" />
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
