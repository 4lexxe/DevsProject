import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2, AlertCircle, BookOpen } from "lucide-react";
import CourseForm from "../components/CourseForm/CourseForm";
import { getById } from "../services/courseServices";

function CourseFormPage() {
  // Estados para manejar el curso y estados de carga/error
  const { id } = useParams();
  const [course, setCourse] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Efecto para cargar los datos del curso si estamos en modo edición
  useEffect(() => {
    const getCourse = async () => {
      if (id) {
        setIsLoading(true);
        setError(null);
        try {
          const c = await getById(id);
          setCourse(transformCourseData(c));
        } catch (err) {
          console.error("Error al cargar el curso:", err);
          setError("No se pudo cargar la información del curso. Por favor, intente nuevamente.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    getCourse();
  }, [id]);

  // Función para transformar los datos del curso al formato requerido
  const transformCourseData = (course: any) => {
    return {
      ...course,
      categoryIds: course.categories.map((category: any) => category.id),
      careerTypeId: course.careerTypeId || "",
      learningOutcomes: Array.isArray(course.learningOutcomes)
        ? course.learningOutcomes.length > 0
          ? course.learningOutcomes.join("\n")
          : ""
        : "",
      prerequisites: Array.isArray(course.prerequisites)
        ? course.prerequisites.length > 0
          ? course.prerequisites.join("\n")
          : ""
        : "",
    };
  };

  // Renderizado condicional basado en el estado de carga y error
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-gray-600">
          <Loader2 className="w-12 h-12 animate-spin mb-4" />
          <p className="text-lg font-medium">Cargando información del curso...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-red-600">
          <AlertCircle className="w-12 h-12 mb-4" />
          <p className="text-lg font-medium text-center">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            Reintentar
          </button>
        </div>
      );
    }

    return id ? <CourseForm course={course} /> : <CourseForm />;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Contenedor del formulario */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default CourseFormPage;