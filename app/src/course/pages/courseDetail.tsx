import React, { useEffect, useState, useMemo, useCallback, Suspense, lazy } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Course } from "@/course/interfaces/ViewnerCourse";
import HeroCourse from "@/course/components/CourseDetail/HeroCourse";
import CourseOverview from "@/course/components/CourseDetail/CourseOverview";
import LearningOutcomes from "@/course/components/CourseDetail/LearningOutcomes";
import Prerequisites from "@/course/components/CourseDetail/Prerequisites";
import AddToCartButton from "@/course/components/CourseDetail/AddToCartButton";
import PricingCard from "@/course/components/CourseDetail/PricingCard";

import { getById } from "@/course/services/courseServices";
import { useAuth } from "@/user/contexts/AuthContext";
import courseAccessService from "@/payment/services/courseAccessService";
import { BookOpen, ArrowRight } from "lucide-react";
import { useCacheManager } from "@/shared/hooks/useCacheManager";
import { useUserConfig } from "@/shared/hooks/useUserConfig";

// Lazy loading para componentes pesados
const SectionList = lazy(() => import("@/course/components/CourseDetail/SectionList"));

// Componente de loading para Suspense
const SectionListSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((n) => (
      <div key={n} className="animate-pulse">
        <div className="h-24 bg-gray-200 rounded-t-lg"></div>
        <div className="p-6 bg-white rounded-b-lg border border-gray-100">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    ))}
  </div>
);

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasCourseInCache, preloadCourseData } = useCacheManager();
  const { config } = useUserConfig();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [checkingAccess, setCheckingAccess] = useState<boolean>(false);

  // Memoizar el conteo de módulos para evitar recálculos
  const moduleCount = useMemo(() => course?.sections?.length || 0, [course?.sections]);

  // Memoizar la función de fetch del curso
  const fetchCourseData = useCallback(async () => {
    if (id) {
      try {
        setLoading(true);
        
        // Verificar si hay datos en caché
        const cacheStatus = hasCourseInCache(id);
        console.log(`Estado del caché para curso ${id}:`, cacheStatus);
        
        const course = await getById(id);
        if (course) {
          setCourse(course);
          
          // Verificar acceso del usuario si está autenticado
          if (user) {
            setCheckingAccess(true);
            try {
              const accessResponse = await courseAccessService.checkCourseAccess(user.id, id);
              setHasAccess(accessResponse.hasAccess);
            } catch (accessError) {
              console.error("Error verificando acceso:", accessError);
              setHasAccess(false);
            } finally {
              setCheckingAccess(false);
            }
          }
          
          // Precargar datos relacionados en segundo plano si no están en caché
          if (!cacheStatus.hasSections) {
            console.log(`Precargando secciones para curso ${id}`);
            // Las secciones se cargarán automáticamente cuando se renderice SectionList
          }
        } else {
          setError("Curso no encontrado.");
        }
      } catch (err) {
        console.error("Error al cargar el curso:", err);
        setError("Hubo un error al cargar los datos del curso.");
      } finally {
        setLoading(false);
      }
    }
  }, [id, user, hasCourseInCache]);

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  const handleAccessCourse = useCallback(() => {
    if (hasAccess && id) {
      navigate(`/my-course/${id}`);
    }
  }, [hasAccess, id, navigate]);

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

            {/* Mostrar diferentes opciones según el acceso del usuario */}
            {user && hasAccess ? (
              // Usuario tiene acceso - mostrar botón para acceder al curso
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    ¡Ya tienes este curso!
                  </h3>
                  <p className="text-sm text-green-600 mb-4">
                    Puedes acceder a todo el contenido del curso
                  </p>
                </div>
                <button 
                  onClick={handleAccessCourse}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={checkingAccess}
                >
                  {checkingAccess ? (
                    "Verificando acceso..."
                  ) : (
                    <>
                      Acceder al curso
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            ) : (
              // Usuario no tiene acceso - mostrar opciones de compra
              <>
                <PricingCard pricing={course.pricing} />
                {id && (
                  <div className="mt-6">
                    <AddToCartButton courseId={id} className="shadow-lg" />
                  </div>
                )}
              </>
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
              <Suspense fallback={<SectionListSkeleton />}>
                <SectionList courseId={id || ""} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
