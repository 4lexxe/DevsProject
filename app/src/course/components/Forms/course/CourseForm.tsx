import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import CustomInput from "@/shared/components/inputs/CustomInput";
import CheckInput from "@/shared/components/inputs/CheckInput";
import TextAreaInput from "@/shared/components/inputs/TextAreaInput";
import SelectInput from "@/shared/components/inputs/SelectInput";
import MultiSelectInput from "@/shared/components/inputs/MultiSelectInput";
import ImagePreview from "@/course/components/forms/previews/ImagePreview";

import { ICourseInput, ICourse } from "@/course/interfaces/CourseForm";
import { courseSchema } from "@/course/validations/courseSchema";

import { createFullCourse } from "@/course/services/courseFormService";
import { editFullCourse } from "@/course/services/courseFormService";
import { Loader2 } from "lucide-react";

import {
  getCategories,
  getCareerTypes,
} from "@/course/services/courseFormService";

export default function CourseForm({ course }: { course?: ICourse }) {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"success" | "error" | undefined>(
    undefined
  );
  const [message, setMessage] = useState<string>();
  // Se obtienen datos de las categorias y tipo de carrera del backend para poder ser seleccionadas
  const [categories, setCategories] = useState<any[]>([]);
  const [careerTypes, setCareerTypes] = useState<any[]>([]);
  // Aca se guardaran errores de las validaciones del backend si es que hay
  const [errors2, setErrors2] = useState<string[]>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<ICourseInput>({
    resolver: zodResolver(courseSchema),
    defaultValues: course || {
      title: "",
      image: "",
      prerequisites: "",
      careerTypeId: undefined,
      categoryIds: [],
      summary: "",
      about: "",
      learningOutcomes: "",
      isActive: false,
      isInDevelopment: false,
      adminId: "1",
    },
  });

  useEffect(() => {
    if (course) {
      reset(course);
    }
  }, [course]);

  /* Cargar las categorias y carreras para seleccionar */
  useEffect(() => {
    const getCategoriesF = async () => {
      try {
        const data = await getCategories();

        setCategories(data.data);
      } catch (err) {
        console.error("Error al cargar las categorías", err);
      }
    };

    const getCareerTypesF = async () => {
      try {
        const data = await getCareerTypes();
        setCareerTypes(data.data);
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
      const response = await createFullCourse(courseData);

      setStatus(response.status);
      setMessage(response.message);

      if (response.statusCode === 201) {
        setTimeout(() => {
          navigate(`/course/${response.data.id}`);
        }, 2000);
      }
    } catch (err: any) {
      setMessage(err.response.data.message);
      setStatus("error");
      if (err.response.data.errors) {
        setErrors2(err.response.data.errors.map((error: any) => error.msg));
      }
      console.log("Error al crear el curso. Inténtalo nuevamente.", err);
    } finally {
      setIsLoading(false);
    }
  };

  /* Manejar el envio de la data del formulario al backend */
  const handleEditCourse = async (courseData: any) => {
    try {
      const response = await editFullCourse(
        course ? course.id : "1",
        courseData
      );

      setStatus(response.status);
      setMessage(response.message);

      if (response.statusCode === 200) {
        setTimeout(() => {
          navigate(`/course/${response.data.id}`);
        }, 2000);
      }
    } catch (err: any) {
      setMessage(err.response.data.message);
      setStatus("error");
      if (err.response.data.errors) {
        setErrors2(err.response.data.errors.map((error: any) => error.msg));
      }
      console.log("Error al editar el curso. Inténtalo nuevamente.", err);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit: SubmitHandler<ICourseInput> = (data: ICourseInput): void => {
    setIsLoading(true);
    setTimeout(() => {
      const newData = {
        ...data,
        categoryIds: data.categoryIds?.map(Number) ?? [], // Asegura que sea un array de números o vacío
        careerTypeId: data.careerTypeId ? Number(data.careerTypeId) : null, // Convierte solo si existe
        adminId: Number(data.adminId),
      };

      if (course) {
        handleEditCourse(newData);
      } else {
        handleCreateCourse(newData);
      }
    }, 1000);
  };
  const getButtonClasses = () => {
    const baseClasses =
      "px-6 py-3 text-lg font-bold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-transform duration-300 hover:scale-105 text-white";

    switch (status) {
      case "success":
        return `${baseClasses} bg-green-500 hover:bg-green-600 focus:ring-green-500`;
      case "error":
        return `${baseClasses} bg-red-500 hover:bg-red-600 focus:ring-red-500`;
      default:
        return `${baseClasses} bg-blue-600 hover:bg-blue-700 text-sm font-medium`;
    }
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
        {errors.isActive?.message && (
          <p className="mt-1 text-xs text-red-500">
            {errors.isActive?.message}
          </p>
        )}

        {errors2 && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
            <h3 className="font-semibold">Errores encontrados:</h3>
            <ul className="list-disc list-inside mt-2">
              {errors2.map((error, index) => (
                <li key={index} className="text-sm">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-8">
          <button
            type="submit"
            className={getButtonClasses()}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </div>
            ) : message ? (
              message
            ) : (
              "Enviar datos del curso"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
