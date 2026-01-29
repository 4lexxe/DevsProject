import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getById, getCourseCompleteInfo } from "../services/courseServices";
import { getSectionsByCourse, deleteSection } from "../services/sectionServices";
import { getSectionUrl } from "../../shared/utils/sectionUrl";

import { CourseData, Section } from "../interfaces/CourseDetail";

// Importar componentes
import {
  CourseHeader,
  PricingSection,
  CategoriesAndCareer,
  LearningOutcomes,
  SectionsGrid,
  DiscountEvents,
  TechnicalInfo,
  CourseInfo
} from "../components/CourseDetail";

export default function CourseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completeInfo, setCompleteInfo] = useState<any>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        // Obtener información completa del curso usando slug
        const course = await getById(slug);
        
        if (!course) {
          setError('Curso no encontrado');
          setLoading(false);
          return;
        }
        
        // Usar el ID del curso para obtener las secciones
        const [courseSections, complete] = await Promise.all([
          getSectionsByCourse(course.id.toString()),
          getCourseCompleteInfo(slug).catch(() => null) // Si falla, continuar sin esta info
        ]);
        
        setCourseData(course);
        setSections(courseSections || []);
        setCompleteInfo(complete);
      } catch (error) {
        console.error('Error loading course data:', error);
        setError('Error al cargar los datos del curso');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getModuleTypeBg = (type: string) => {
    switch (type.toLowerCase()) {
      case "introductorio":
        return "#1d4ed8";
      case "principiante":
        return "#42d7c7";
      case "intermedio":
        return "#0c154c";
      case "avanzado":
        return "#02ffff";
      default:
        return "#1d4ed8";
    }
  };

  const handleSectionClick = (section: Section) => {
    navigate(getSectionUrl(section));
  };

  const handleEditSection = (e: React.MouseEvent, section: Section) => {
    e.stopPropagation();
    if (courseData?.id) {
      const sectionIdentifier = section.slug || section.id;
      navigate(`/courses/${courseData.id}/section/${sectionIdentifier}/edit`);
    }
  };

  const handleDeleteSection = async (e: React.MouseEvent, sectionId: string) => {
    e.stopPropagation();
    
    // Encontrar la sección para mostrar información en la confirmación
    const section = sections.find(s => s.id === sectionId);
    const sectionTitle = section?.title || 'esta sección';
    
    const confirmMessage = `¿Estás seguro de que quieres eliminar "${sectionTitle}"?\n\n` +
      `Esto eliminará:\n` +
      `• La sección completa\n` +
      `• Todos sus contenidos\n` +
      `• Todos los archivos asociados\n` +
      `• Todas las carpetas de Google Drive\n\n` +
      `Esta acción NO SE PUEDE DESHACER.`;

    if (window.confirm(confirmMessage)) {
      try {
        setLoading(true);
        await deleteSection(sectionId);
        
        // Actualizar la lista de secciones después de eliminar
        if (courseData?.id) {
          const updatedSections = await getSectionsByCourse(courseData.id.toString());
          setSections(updatedSections || []);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error deleting section:', err);
        setError('Error al eliminar la sección');
        setLoading(false);
      }
    }
  };

  const handleCreateSection = () => {
    if (courseData?.id) {
      navigate(`/courses/${courseData.id}/section/form`);
    }
  };

  const handleEditCourse = () => {
    if (courseData?.slug) {
      navigate(`/courses/${courseData.slug}/edit`);
    } else if (courseData?.id) {
      navigate(`/courses/${courseData.id}/edit`);
    }
  };

  const handleViewDiscounts = () => {
    navigate('/courses/discount-events');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando curso...</p>
        </div>
      </div>
    );
  }

  if (error || !courseData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Curso no encontrado'}</p>
          <button 
            onClick={() => navigate('/courses')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Volver a cursos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header del curso */}
        <CourseHeader 
          courseData={courseData} 
          onEditCourse={handleEditCourse} 
        />

        {/* Información de precios */}
        <PricingSection 
          courseData={courseData}
          onViewDiscounts={handleViewDiscounts}
          formatDate={formatDate}
        />

        {/* Categorías y Carrera */}
        <CategoriesAndCareer 
          courseData={courseData}
          formatDate={formatDate}
        />

        {/* Resultados de aprendizaje */}
        <LearningOutcomes 
          learningOutcomes={courseData.learningOutcomes}
        />

        {/* Secciones del curso */}
        <SectionsGrid 
          sections={sections}
          onCreateSection={handleCreateSection}
          onSectionClick={handleSectionClick}
          onEditSection={handleEditSection}
          onDeleteSection={handleDeleteSection}
          formatDate={formatDate}
          getModuleTypeBg={getModuleTypeBg}
        />

        {/* Eventos de descuento */}
        <DiscountEvents 
          discountEvents={courseData.discountEvents}
          formatDate={formatDate}
        />

        {/* Información adicional */}
        <TechnicalInfo 
          courseData={courseData}
          formatDate={formatDate}
        />

        {/* Información completa del curso (creador, instructor, usuarios inscritos) */}
        {completeInfo && (
          <CourseInfo
            creator={completeInfo.creator}
            instructor={completeInfo.instructor}
            enrolledUsers={completeInfo.enrolledUsers || []}
            enrollmentStats={completeInfo.enrollmentStats || { total: 0, active: 0, revoked: 0 }}
            sectionsCount={completeInfo.sections?.length || 0}
            contentsCount={completeInfo.contentsCount || 0}
            courseId={courseData?.id ? Number(courseData.id) : undefined}
            courseTitle={courseData?.title}
          />
        )}
      </div>
    </div>
  );
}
