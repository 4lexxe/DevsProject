import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Course } from "@/course/interfaces/ViewnerCourse";
import HeroCourse from "@/course/components/CourseDetail/HeroCourse";
import CourseOverview from "@/course/components/CourseDetail/CourseOverview";
import LearningOutcomes from "@/course/components/CourseDetail/LearningOutcomes";
import Prerequisites from "@/course/components/CourseDetail/Prerequisites";
import SectionList from "@/course/components/CourseDetail/SectionList";
import PurchaseButtons from "@/course/components/CourseDetail/PurchaseButtons";
import PricingCard from "@/course/components/CourseDetail/PricingCard";

import { getById } from "@/course/services/courseServices";
import { checkCourseAccess } from "@/course/services/directPurchaseService";

const CourseDetails: React.FC = () => {
  const params = useParams<{ id: string }>();
  const { id } = params;
  const navigate = useNavigate();
  console.log('🔍 CourseDetails - Params completos:', params);
  console.log('🔍 CourseDetails - ID de URL:', id, 'tipo:', typeof id);
  console.log('🔍 CourseDetails - window.location.pathname:', window.location.pathname);
  
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [moduleCount, setModuleCount] = useState<number>(0);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!id) {
        setError("ID del curso no válido.");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Verificar si el usuario ya tiene acceso al curso
        try {
          const accessResponse = await checkCourseAccess(id);
          if (accessResponse.hasAccess) {
            console.log('🔄 Usuario ya tiene acceso al curso, redirigiendo a my-course...');
            navigate(`/my-course/${id}`);
            return;
          }
        } catch (accessError) {
          // Si hay error verificando acceso (ej: usuario no autenticado), continuar mostrando el curso
          console.log('ℹ️ No se pudo verificar acceso (posiblemente usuario no autenticado), mostrando curso normal');
        }
        
        const course = await getById(id);
        if (course) {
          setCourse(course);
          const count = course.sections.length;
          setModuleCount(count);
        } else {
          setError("Curso no encontrado.");
        }
      } catch (err) {
        console.error("Error al cargar el curso:", err);
        setError("Hubo un error al cargar los datos del curso.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [id, navigate]);

  if (loading) {
    return <p className="p-6 text-blue-500">Cargando curso...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>;
  }

  if (!course) {
    return <p className="p-6 text-red-500">Curso no encontrado.</p>;
  }

  return (
    <div>
      {/* Hero section with full width */}
      <div className="w-full">
        <HeroCourse
          title={course.title}
          description={course.summary}
          image={course.image}
          categories={course.categories}
          courseId={id}
        />
      </div>

      {/* Content section with constrained width */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Mobile-first sidebar content */}
          <div className="lg:col-span-1 lg:order-2 flex flex-col space-y-6">
            {course.prerequisites && course.prerequisites.length > 0 && (
              <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                <Prerequisites prerequisites={course.prerequisites} />
              </div>
            )}
            <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
              <LearningOutcomes outcomes={course.learningOutcomes} />
            </div>

            <PricingCard pricing={course.pricing} />
            {id && (
              <div className="mt-6">
                {console.log('📋 CourseDetail pasando a PurchaseButtons - course.id:', id, 'tipo:', typeof id, 'toString():', id.toString())}
                <PurchaseButtons 
                  courseId={id} 
                  pricing={course.pricing}
                  className="shadow-lg" 
                />
              </div>
            )}
          </div>

          {/* Main content */}
          <div className="lg:col-span-2 lg:order-1">
            <CourseOverview
              about={course.about}
              careerType={course.careerType?.name || 'Sin categoría'}
              numberOfModules={moduleCount}
              createdAt={course.createdAt}
            />

            {/* Sections header */}
            <div className="flex items-center justify-between mb-6 mt-8">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Módulos del Curso
                </h2>
              </div>
            </div>

            {/* Sections List */}
            <div className="mt-6">
              <SectionList courseId={id || ""} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
