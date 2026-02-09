import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Clock } from "lucide-react";
import { getSectionByCourseAndSectionSlug, getSectionById } from "../services/sectionServices";
import { Section } from "../interfaces/ViewnerCourse";
import { getCourseUrl, getSectionUrl } from "@/shared/utils/courseUrl";
import ContentViewer from "../components/CourseDetail/ContentViewer";

const SectionPage: React.FC = () => {
  const { courseSlug, sectionSlug, id } = useParams<{ 
    courseSlug?: string; 
    sectionSlug?: string;
    id?: string;
  }>();
  const navigate = useNavigate();
  const [section, setSection] = useState<Section | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSection = async () => {
      // Si hay id (ruta antigua /sections/:id), redirigir a la nueva ruta
      if (id && !courseSlug && !sectionSlug) {
        try {
          setLoading(true);
          const sectionData = await getSectionById(id);
          if (sectionData && sectionData.course) {
            const newUrl = getSectionUrl(sectionData);
            navigate(newUrl, { replace: true });
            return;
          }
        } catch (err) {
          console.error('Error fetching section for redirect:', err);
          setError('Error al cargar la sección');
          setLoading(false);
          return;
        }
      }

      if (!courseSlug || !sectionSlug) {
        setError("Parámetros de URL inválidos");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const sectionData = await getSectionByCourseAndSectionSlug(courseSlug, sectionSlug);
        setSection(sectionData);
      } catch (err: any) {
        console.error('Error fetching section:', err);
        setError(err.response?.data?.message || 'Error al cargar la sección');
      } finally {
        setLoading(false);
      }
    };

    fetchSection();
  }, [courseSlug, sectionSlug, id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
            <div className="space-y-4">
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !section) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
            <p className="text-gray-600 mb-6">{error || "Sección no encontrada"}</p>
            <Link
              to="/cursos"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-900 text-white px-6 py-2 rounded-lg hover:from-cyan-700 hover:to-blue-950 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a Cursos</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const course = section.course;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to={course ? getCourseUrl(course) : "/cursos"}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al curso</span>
          </Link>
          
          {course && (
            <div className="mb-4">
              <Link
                to={getCourseUrl(course)}
                className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
              >
                {course.title}
              </Link>
            </div>
          )}
        </div>

        {/* Section Header */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
          <div
            className="relative h-48 bg-cover bg-center"
            style={{
              backgroundImage: `url(${
                section.coverImage ||
                "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070"
              })`,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to right, 
                ${section.colorGradient[0]}cc, 
                ${section.colorGradient[1]}cc)`,
              }}
            />
            <div className="relative z-10 p-8 text-white">
              <div className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-white/20 backdrop-blur-sm mb-4">
                {section.moduleType}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{section.title}</h1>
              <p className="text-lg opacity-90 mb-4">{section.description}</p>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>{section.lessonsCount} lecciones</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{section.duration} minutos</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contents */}
        {section.contents && section.contents.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contenido de la Sección</h2>
            {section.contents.map((content) => (
              <div key={content.id}>
                <ContentViewer courseId={section.courseId} content={content} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600">Esta sección aún no tiene contenido disponible.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionPage;
