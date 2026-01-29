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
import { getCourseUrl } from "@/shared/utils/courseUrl";

const CourseDetails: React.FC = () => {
  const params = useParams<{ slug: string }>();
  const { slug } = params; // Slug del curso
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [moduleCount, setModuleCount] = useState<number>(0);

  // Actualizar meta tags SEO cuando se carga el curso
  useEffect(() => {
    if (course) {
      // Actualizar título
      document.title = `${course.title} | DevsProject`;
      
      // Actualizar meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', course.summary || course.about.substring(0, 160));
      
      // Open Graph tags
      const ogTags = [
        { property: 'og:title', content: course.title },
        { property: 'og:description', content: course.summary || course.about.substring(0, 160) },
        { property: 'og:image', content: course.image },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: window.location.href },
      ];
      
      ogTags.forEach(tag => {
        let meta = document.querySelector(`meta[property="${tag.property}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('property', tag.property);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', tag.content);
      });

      // Canonical URL
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', window.location.href);
    }
  }, [course]);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!slug) {
        setError("Slug del curso no válido.");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        const course = await getById(slug);
        if (course) {
          setCourse(course);
          const count = course.sections?.length || 0;
          setModuleCount(count);
          
          // Si el curso tiene slug pero la URL no coincide, redirigir a la URL correcta
          if (course.slug && course.slug !== slug) {
            const slugUrl = getCourseUrl(course);
            navigate(slugUrl, { replace: true });
            return;
          }
          
          // Verificar si el usuario ya tiene acceso al curso
          try {
            const accessResponse = await checkCourseAccess(course.id.toString());
            if (accessResponse.hasAccess) {
              navigate(`/my-course/${course.id}`);
              return;
            }
          } catch {
            // Si hay error verificando acceso (ej: usuario no autenticado), continuar mostrando el curso
            console.log('ℹ️ No se pudo verificar acceso (posiblemente usuario no autenticado), mostrando curso normal');
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
    };
    fetchCourseData();
  }, [slug, navigate]);

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
          courseId={course.id.toString()}
          headerType={course.headerType}
          headerTitle={course.headerTitle}
          headerSubtitle={course.headerSubtitle}
          headerDescription={course.headerDescription}
          headerButtonText={course.headerButtonText}
          headerButtonLink={course.headerButtonLink}
          techStack={course.techStack}
          customHeaderContent={course.customHeaderContent}
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
            {course.id && (
              <div className="mt-6">
                <PurchaseButtons 
                  courseId={course.id.toString()} 
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
              <SectionList courseId={course.id.toString()} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
