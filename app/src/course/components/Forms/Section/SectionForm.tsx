"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { ISectionInput } from "@/course/interfaces/CourseFormInterfaces";

import CustomInput from "@/shared/components/inputs/CustomInput";
import SelectInput from "@/shared/components/inputs/SelectInput";
import TextAreaInput from "@/shared/components/inputs/TextAreaInput";
import { X, Save } from "lucide-react";
import { sectionSchema, moduleTypes } from "@/course/validations/sectionSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCourseContext } from "@/course/context/CourseFormContext"; 

export default function SectionForm() {
  const { state: sectionState, saveSection, cancelEdit } = useCourseContext();
  const initialData = sectionState.editingSection;
 
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISectionInput>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      moduleType: initialData?.moduleType || "",
      coverImage: initialData?.coverImage || "",
    },
  });

  const onSubmit: SubmitHandler<ISectionInput> = (data: ISectionInput): void => {
    saveSection(data) 
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Añadir Nueva Sección</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomInput
            name="title"
            type="text"
            labelText="Titulo"
            error={errors["title"]?.message}
            register={register}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectInput
            name="moduleType"
            labelText="Tipo de Módulo"
            placeholder="Seleccione alguno"
            register={register}
            error={errors["moduleType"]?.message}
            options={ moduleTypes.map(moduleType => ({
              value: moduleType,
              label: moduleType
            }))
            }
          />

          <CustomInput
            name="coverImage"
            type="url"
            register={register}
            error={errors["coverImage"]?.message}
          />
        </div>

        <TextAreaInput
          name="description"
          labelText="Descripción"
          register={register}
          error={errors["description"]?.message}
        />

        <div className="flex justify-end space-x-3 pt-4">
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
