import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getById } from "../services/courseServices";
import { getSectionsByCourse, deleteSection } from "../services/sectionServices";

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
  CourseUsers
} from "../components/CourseDetail";

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const [course, courseSections] = await Promise.all([
          getById(id),
          getSectionsByCourse(id)
        ]);
        
        setCourseData(course);
        setSections(courseSections || []);
      } catch (error) {
        console.error('Error loading course data:', error);
        setError('Error al cargar los datos del curso');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

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
        return "#3b82f6"; // blue-500
      case "principiante":
        return "#10b981"; // emerald-500
      case "intermedio":
        return "#f59e0b"; // amber-500
      case "avanzado":
        return "#8b5cf6"; // violet-500
      default:
        return "#3b82f6";
    }
  };

  const handleSectionClick = (sectionId: string) => {
    navigate(`/sections/${sectionId}`);
  };

  const handleEditSection = (e: React.MouseEvent, sectionId: string) => {
    e.stopPropagation();
    navigate(`/courses/${id}/section/${sectionId}/edit`);
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
        if (id) {
          const updatedSections = await getSectionsByCourse(id);
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
    navigate(`/courses/${id}/section/form`);
  };

  const handleEditCourse = () => {
    navigate(`/courses/${id}/edit`);
  };

  const handleViewDiscounts = () => {
    navigate('/courses/discount-events');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium text-lg">Cargando curso...</p>
        </div>
      </div>
    );
  }

  if (error || !courseData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <div className="mb-4">
            <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-red-600 font-semibold text-lg mb-6">{error || 'Curso no encontrado'}</p>
          <button 
            onClick={() => navigate('/courses')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg font-medium"
          >
            Volver a cursos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
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

        {/* Usuarios con acceso al curso */}
        <CourseUsers courseId={parseInt(id!)} />

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
      </div>
    </div>
  );
}
