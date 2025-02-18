import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import CustomInput from "@/shared/components/inputs/CustomInput";
import CheckInput from "@/shared/components/inputs/CheckInput";
import TextAreaInput from "@/shared/components/inputs/TextAreaInput";
import SelectInput from "@/shared/components/inputs/SelectInput";
import MultiSelectInput from "@/shared/components/inputs/MultiSelectInput";
import ImagePreview from "@/course/components/forms/previews/ImagePreview";

import { ICourseInput } from "@/course/interfaces/CourseFormInterfaces";
import { courseSchema } from "@/course/validations/courseSchema";

import { createFullCourse } from "@/course/services/courseFormService";

import {
  getCategories,
  getCareerTypes,
} from "@/course/services/courseFormService";

export default function CourseForm() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<ICourseInput>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      image: "",
      categoryIds: [],
      summary: "",
      about: "",
      learningOutcomes: "",
      isActive: false,
      isInDevelopment: false,
    },
  });

  /* Cargar las categorias y carreras para seleccionar */
  const [categories, setCategories] = useState<any[]>([]);
  const [careerTypes, setCareerTypes] = useState<any[]>([]);
  useEffect(() => {
    const getCategoriesF = async () => {
      try {
        const data = await getCategories();

        setCategories(data);
      } catch (err) {
        console.error("Error al cargar las categorías", err);
      }
    };

    const getCareerTypesF = async () => {
      try {
        const data = await getCareerTypes();
        setCareerTypes(data);
      } catch (err) {
        console.error("Error al cargar las categorías", err);
      }
    };

    getCategoriesF();
    getCareerTypesF();
  }, []);

  /* Manejar el envio de la data del formulario al backend */
  const handleCreateCourse = async (courseData: any) => {
    try {
      const newCourse = await createFullCourse(courseData);
      console.log("Curso creado:", newCourse);
      // Aquí podrías redirigir a otra página o limpiar el formulario
    } catch (err) {
      console.log("Error al crear el curso. Inténtalo nuevamente.", err);
    }
  };

  const onSubmit: SubmitHandler<ICourseInput> = (data: ICourseInput): void => {
    const newCategoryIds = data.categoryIds.map(Number);
    const carrerId =(data.careerTypeId !== "") ? Number(data.careerTypeId) : null;
    const newData = { ...data, categoryIds: newCategoryIds, adminId: 1, careerTypeId: carrerId };

    console.log("Los datos del curso: ", newData);
    handleCreateCourse(newData);
  };

  return (
    <div className="w-full mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Añadir Nuevo Curso</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomInput
            name="title"
            register={register}
            type="text"
            error={errors["title"]?.message}
            labelText="Titulo"
          />

          <CustomInput
            name="image"
            register={register}
            type="text"
            error={errors["image"]?.message}
            labelText="URL de la imagen"
          />
        </div>

        <ImagePreview watchContentImage={watch("image")} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MultiSelectInput
            name="categoryIds"
            labelText="Categories"
            control={control}
            error={errors.categoryIds?.message}
            options={
              categories
                ? categories.map((category: any) => ({
                    value: category.id, // ID de la categoría como valor
                    label: category.name, // Nombre de la categoría como etiqueta
                  }))
                : []
            }
            placeholder="Seleccione alguna categoría"
          />
          <SelectInput
            name="careerTypeId"
            labelText="Tipo de Carrera Relacionada"
            register={register}
            error={errors["careerTypeId"]?.message}
            placeholder="Seleccione algun tipo de carrera"
            options={
              careerTypes
                ? careerTypes.map((careerType: any) => ({
                    value: careerType.id,
                    label: careerType.name,
                  }))
                : []
            }
          />
        </div>

        <TextAreaInput
          name="prerequisites"
          labelText="Prerequisitos"
          rows={2}
          register={register}
          error={errors["prerequisites"]?.message}
          arrayValue={true}
        />

        <TextAreaInput
          name="summary"
          labelText="Resumen"
          rows={2}
          register={register}
          error={errors["summary"]?.message}
        />
        <TextAreaInput
          name="about"
          labelText="Acerca del Curso"
          register={register}
          error={errors["about"]?.message}
          rows={2}
        />

        <TextAreaInput
          name="learningOutcomes"
          labelText="Resultados de Aprendizaje"
          register={register}
          arrayValue={true}
          error={errors["learningOutcomes"]?.message}
        />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <CheckInput
              name="isActive"
              labelText="Activo"
              register={register}
            />
            <CheckInput
              name="isInDevelopment"
              labelText="En desarrollo"
              register={register}
            />
          </div>
        </div>
        {errors.isActive?.message && <p className="mt-1 text-xs text-red-500">{errors.isActive?.message}</p>}

        <div className="flex justify-end space-x-3 pt-8">
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg rounded-lg shadow-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
          >
            Enviar datos del curso
          </button>
        </div>
      </form>
    </div>
  );
}
