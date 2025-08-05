import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  GraduationCap,
  FileText,
  Tags,
  Loader2,
  CheckCircle2,
  XCircle,
  Save,
  X,
} from "lucide-react";

import CustomInput from "@/shared/components/inputs/CustomInput";
import CheckInput from "@/shared/components/inputs/CheckInput";
import TextAreaInput from "@/shared/components/inputs/TextAreaInput";
import SelectInput from "@/shared/components/inputs/SelectInput";
import MultiSelectInput from "@/shared/components/inputs/MultiSelectInput";
import ImagePreview from "./ImagePreview";

import { ICourseFormData, ICourse } from "@/course/interfaces/CourseForm";
import { courseSchema } from "@/course/validations/courseSchema";

import { createFullCourse } from "@/course/services/courseFormService";
import { editFullCourse } from "@/course/services/courseFormService";

import {
  getCategories,
  getCareerTypes,
} from "@/course/services/courseFormService";

export default function CourseForm({ course }: { course?: ICourse }) {
  // Estado para el manejo de carga y mensajes
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"success" | "error" | undefined>(
    undefined
  );
  const [message, setMessage] = useState<string>();

  // Estado para datos de categorías y tipos de carrera
  const [categories, setCategories] = useState<any[]>([]);
  const [careerTypes, setCareerTypes] = useState<any[]>([]);

  // Estado para errores de validación del backend
  const [errors2, setErrors2] = useState<string[]>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<ICourseFormData>({
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
      price: undefined,
      isActive: false,
      isInDevelopment: false,
      adminId: "1",
    },
  });

  // Resetear formulario cuando cambia el curso
  useEffect(() => {
    if (course) {
      reset(course);
    }
  }, [course, reset]);

  // Cargar datos iniciales de categorías y tipos de carrera
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, careerTypesData] = await Promise.all([
          getCategories(),
          getCareerTypes(),
        ]);
        setCategories(categoriesData.data);
        setCareerTypes(careerTypesData.data);
      } catch (err) {
        console.error("Error al cargar datos", err);
      }
    };
    fetchData();
  }, []);

  // Manejar el envío del formulario
  const handleSubmitCourse = async (courseData: any) => {
    setIsLoading(true);
    try {
      const response = course
        ? await editFullCourse(course.id, courseData)
        : await createFullCourse(courseData);

      setStatus(response.status);
      setMessage(response.message);
      if (response.statusCode === 200) {
        navigate(-1);
      }
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error desconocido");
      setStatus("error");
      if (err.response?.data?.errors) {
        setErrors2(err.response.data.errors.raw.map((error: any) => error.msg));
      }
      console.error("Error al guardar el curso:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit: SubmitHandler<ICourseFormData> = (data) => {
    handleSubmitCourse({
      ...data,
      categoryIds: data.categoryIds?.map(Number) ?? [],
      careerTypeId: data.careerTypeId ? Number(data.careerTypeId) : null,
      adminId: Number(data.adminId),
      price: data.price ? Number(data.price) : undefined,
    });
  };

  const handleCancel = () => {
    navigate(-1); // Go back to the previous page
  };

  // Clases dinámicas para el botón según el estado
  const getButtonClasses = () => {
    const baseClasses =
      "inline-flex items-center px-6 py-3 text-lg font-bold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 hover:scale-105 text-white gap-2";

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
    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-8 flex items-center gap-3 text-gray-800">
        <BookOpen className="w-8 h-8 text-blue-600" />
        {course ? "Editar Curso" : "Añadir Nuevo Curso"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Sección de información básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-gray-700 mb-4">
              <BookOpen className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Información Básica</h3>
            </div>

            <CustomInput
              name="title"
              register={register}
              type="text"
              error={errors["title"]?.message}
              labelText="Título del Curso"
            />

            <CustomInput
              name="image"
              register={register}
              type="text"
              error={errors["image"]?.message}
              labelText="URL de la imagen"
            />

            <CustomInput
              name="price"
              register={register}
              type="number"
              error={errors["price"]?.message}
              labelText="Precio del Curso"
              placeholder="0.00"
              step="1000"
              min="0"
            />
          </div>

          <div className="space-y-4">
            <ImagePreview watchContentImage={watch("image") || ""} />
          </div>
        </div>

        {/* Sección de categorización */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-gray-700 mb-4">
              <Tags className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Categorización</h3>
            </div>

            <MultiSelectInput
              name="categoryIds"
              labelText="Categorías"
              control={control}
              error={errors.categoryIds?.message}
              options={categories.map((category: any) => ({
                value: category.id,
                label: category.name,
              }))}
              placeholder="Seleccione categorías"
            />

            <SelectInput
              name="careerTypeId"
              labelText="Tipo de Carrera"
              register={register}
              error={errors["careerTypeId"]?.message}
              placeholder="Seleccione tipo de carrera"
              options={careerTypes.map((careerType: any) => ({
                value: careerType.id,
                label: careerType.name,
              }))}
            />
          </div>
        </div>

        {/* Sección de contenido del curso */}
        <div className="space-y-6 pt-6 border-t">
          <div className="flex items-center gap-2 text-gray-700 mb-4">
            <FileText className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Contenido del Curso</h3>
          </div>

          <TextAreaInput
            name="prerequisites"
            labelText="Prerequisitos"
            rows={3}
            register={register}
            error={errors["prerequisites"]?.message}
            arrayValue={true}
          />

          <TextAreaInput
            name="summary"
            labelText="Resumen"
            rows={3}
            register={register}
            error={errors["summary"]?.message}
          />

          <TextAreaInput
            name="about"
            labelText="Acerca del Curso"
            register={register}
            error={errors["about"]?.message}
            rows={4}
          />

          <TextAreaInput
            name="learningOutcomes"
            labelText="Resultados de Aprendizaje"
            register={register}
            arrayValue={true}
            error={errors["learningOutcomes"]?.message}
            rows={4}
          />
        </div>

        {/* Sección de estado del curso */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 pt-6 border-t">
          <div className="flex items-center gap-2 text-gray-700 mb-4">
            <GraduationCap className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Estado del Curso</h3>
          </div>

          <div className="flex items-center space-x-6">
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

        {/* Mensajes de error */}
        {errors.isActive?.message && (
          <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
            <XCircle className="w-4 h-4" />
            {errors.isActive?.message}
          </p>
        )}

        {errors2 && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
            <h3 className="font-semibold flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              Errores encontrados:
            </h3>
            <ul className="list-disc list-inside mt-2 space-y-1">
              {errors2.map((error, index) => (
                <li key={index} className="text-sm">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex justify-end gap-4 pt-8">
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center px-6 py-3 text-sm font-medium rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 hover:scale-105 text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-gray-500 gap-2"
          >
            <X className="w-5 h-5" />
            Cancelar
          </button>
          <button
            type="submit"
            className={getButtonClasses()}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Enviando...
              </>
            ) : status === "success" ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                {message || "Guardado con éxito"}
              </>
            ) : status === "error" ? (
              <>
                <XCircle className="w-5 h-5" />
                {message || "Error al guardar"}
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Guardar Curso
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
