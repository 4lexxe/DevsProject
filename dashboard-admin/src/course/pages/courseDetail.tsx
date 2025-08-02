import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getById } from "../services/courseServices";
import { getSectionsByCourse } from "../services/sectionServices";

import { CourseData, Section } from "../interfaces/CourseDetail";

// Importar componentes
import {
  CourseHeader,
  PricingSection,
  CategoriesAndCareer,
  LearningOutcomes,
  SectionsGrid,
  DiscountEvents,
  TechnicalInfo
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

  const handleSectionClick = (sectionId: string) => {
    navigate(`/sections/${sectionId}`);
  };

  const handleEditSection = (e: React.MouseEvent, sectionId: string) => {
    e.stopPropagation();
    navigate(`/courses/${id}/section/${sectionId}/edit`);
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
      </div>
    </div>
  );
}
