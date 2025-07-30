import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CalendarDays, Clock, DollarSign, GraduationCap, Star, Tag, Edit, Eye } from "lucide-react";
import { getById } from "../services/courseServices";
import { getSectionsByCourse } from "../services/sectionServices";

interface Category {
  id: string;
  name: string;
  icon?: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  CourseCategory: {
    courseId: string;
    categoryId: string;
  };
}

interface CareerType {
  id: string;
  name: string;
  icon?: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DiscountEvent {
  id: string;
  event: string;
  description: string;
  value: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  CourseDiscountEventAssociation?: {
    courseId: string;
    discountEventId: string;
  };
}

interface Section {
  id: string;
  title: string;
  description: string;
  courseId: string;
  coverImage?: string;
  moduleType: string;
  colorGradient: [string, string];
  createdAt: string;
  updatedAt: string;
}

interface PricingInfo {
  originalPrice: number;
  finalPrice: number;
  hasDiscount: boolean;
  activeDiscount?: {
    id: string;
    event: string;
    description: string;
    percentage: number;
    amount: number;
    startDate: string;
    endDate: string;
  };
  savings: number;
}

interface CourseData {
  id: string;
  title: string;
  image: string;
  summary: string;
  about: string;
  careerTypeId: string;
  learningOutcomes: string[];
  prerequisites?: string[];
  isActive: boolean;
  isInDevelopment: boolean;
  adminId: string;
  price?: string;
  createdAt: string;
  updatedAt: string;
  categories: Category[];
  careerType: CareerType;
  sections?: Section[];
  discountEvents?: DiscountEvent[];
  pricing?: PricingInfo;
}

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
    navigate(`/courses/${id}/section/content/${sectionId}`);
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
    <div className="min-h-screen p-6" style={{ backgroundColor: "#eff6ff" }}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header del curso */}
        <div className="rounded-lg border shadow-sm overflow-hidden">
          <div
            className="flex flex-col space-y-1.5 p-6 text-white"
            style={{ background: "linear-gradient(to right, #0c154c, #1d4ed8)" }}
          >
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="relative w-24 h-24 bg-white rounded-lg p-2 flex-shrink-0 mx-auto md:mx-0">
                <img
                  src={courseData.image || "/placeholder.svg"}
                  alt={courseData.title}
                  className="object-contain"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h3 className="text-2xl font-bold leading-none tracking-tight">
                    {courseData.title} (ID: {courseData.id})
                  </h3>
                  <div
                    className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-white border-white"
                    style={{ backgroundColor: courseData.isActive ? "#42d7c7" : "#6b7280" }}
                  >
                    {courseData.isActive ? "Activo" : "Inactivo"}
                  </div>
                  {courseData.isInDevelopment && (
                    <div
                      className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-white text-white"
                      style={{ backgroundColor: "#02ffff", color: "#0c154c" }}
                    >
                      En Desarrollo
                    </div>
                  )}
                  <button 
                    onClick={handleEditCourse}
                    className="ml-auto flex items-center gap-2 px-3 py-1 bg-white text-blue-900 rounded text-sm hover:bg-gray-100"
                  >
                    <Edit className="w-4 h-4" />
                    Editar Curso
                  </button>
                </div>
                <p className="text-blue-100 text-lg mb-3">
                  Estado: {courseData.isActive ? "ACTIVO" : "INACTIVO"} | Desarrollo:{" "}
                  {courseData.isInDevelopment ? "EN DESARROLLO" : "COMPLETADO"} | Admin ID: {courseData.adminId}
                </p>
                <p className="text-blue-50">{courseData.about}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Información de precios */}
        {courseData.pricing && (
          <div className="rounded-lg border shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl font-semibold leading-none tracking-tight" style={{ color: "#0c154c" }}>
                <DollarSign className="h-5 w-5 inline-block mr-2" />
                Configuración de Precios
              </h3>
            </div>
            <div className="p-6 pt-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: "#eff6ff" }}>
                  <p className="text-sm" style={{ color: "#0c154c" }}>
                    Precio Base
                  </p>
                  <p className="text-2xl font-bold text-gray-400 line-through">${courseData.pricing.originalPrice}</p>
                </div>
                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: "#42d7c7", color: "white" }}>
                  <p className="text-sm text-white">Precio Actual</p>
                  <p className="text-3xl font-bold text-white">${courseData.pricing.finalPrice}</p>
                </div>
                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: "#1d4ed8", color: "white" }}>
                  <p className="text-sm text-white">% Descuento Aplicado</p>
                  <p className="text-2xl font-bold text-white">{courseData.pricing.activeDiscount?.percentage || 0}%</p>
                </div>
                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: "#02ffff", color: "#0c154c" }}>
                  <p className="text-sm" style={{ color: "#0c154c" }}>
                    Diferencia
                  </p>
                  <p className="text-2xl font-bold" style={{ color: "#0c154c" }}>
                    ${courseData.pricing.savings}
                  </p>
                </div>
              </div>
              {courseData.pricing.hasDiscount && courseData.pricing.activeDiscount && (
                <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: "#eff6ff", border: "1px solid #42d7c7" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="h-4 w-4 inline-block" style={{ color: "#1d4ed8" }} />
                    <span className="font-semibold" style={{ color: "#0c154c" }}>
                      Descuento Activo
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: "#0c154c" }}>
                    Válido desde {formatDate(courseData.pricing.activeDiscount.startDate)} hasta{" "}
                    {formatDate(courseData.pricing.activeDiscount.endDate)}
                  </p>
                </div>
              )}
              <div className="mt-4 flex justify-end">
                <button 
                  onClick={handleViewDiscounts}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  <Eye className="w-4 h-4" />
                  Ver Descuentos
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Categorías */}
          <div className="rounded-lg border shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl font-semibold leading-none tracking-tight" style={{ color: "#0c154c" }}>
                <Tag className="h-5 w-5 inline-block mr-2" />
                Categorías Asignadas ({courseData.categories.length})
              </h3>
            </div>
            <div className="p-6 pt-0">
              <div className="space-y-4">
                {courseData.categories.map((category) => (
                  <div
                    key={category.id}
                    className="border rounded-lg p-4"
                    style={{ backgroundColor: "#eff6ff", borderColor: "#1d4ed8" }}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <img
                          src={category.icon || "/placeholder.svg"}
                          alt={category.name}
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-lg" style={{ color: "#0c154c" }}>
                            {category.name}
                          </h4>
                          <div
                            className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-white"
                            style={{ backgroundColor: category.isActive ? "#42d7c7" : "#6b7280" }}
                          >
                            {category.isActive ? "Activa" : "Inactiva"}
                          </div>
                        </div>
                        <p className="text-gray-600 mb-2">{category.description}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-500">
                          <div>
                            <span className="font-medium">Categoría ID:</span> {category.id}
                          </div>
                          <div>
                            <span className="font-medium">Relación:</span> {category.CourseCategory.courseId}-
                            {category.CourseCategory.categoryId}
                          </div>
                          <div>
                            <span className="font-medium">Creada:</span> {formatDate(category.createdAt)}
                          </div>
                          <div>
                            <span className="font-medium">Actualizada:</span> {formatDate(category.updatedAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tipo de carrera */}
          <div className="rounded-lg border shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl font-semibold leading-none tracking-tight" style={{ color: "#0c154c" }}>
                <GraduationCap className="h-5 w-5 inline-block mr-2" />
                Carrera Asociada (ID: {courseData.careerTypeId})
              </h3>
            </div>
            <div className="p-6 pt-0">
              <div className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: "#eff6ff" }}>
                <div className="relative w-16 h-16">
                  <img
                    src={courseData.careerType.icon || "/placeholder.svg"}
                    alt={courseData.careerType.name}
                    className="object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold" style={{ color: "#0c154c" }}>
                    {courseData.careerType.name}
                  </h3>
                  <p style={{ color: "#1d4ed8" }}>{courseData.careerType.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resultados de aprendizaje */}
        <div className="rounded-lg border shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight" style={{ color: "#0c154c" }}>
              <Star className="h-5 w-5 inline-block mr-2" />
              Objetivos de Aprendizaje Configurados ({courseData.learningOutcomes.length})
            </h3>
          </div>
          <div className="p-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {courseData.learningOutcomes.map((outcome, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg"
                  style={{ backgroundColor: "#eff6ff" }}
                >
                  <div
                    className="w-6 h-6 text-white rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: "#1d4ed8" }}
                  >
                    {index + 1}
                  </div>
                  <span className="font-medium" style={{ color: "#0c154c" }}>
                    {outcome}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Secciones del curso */}
        <div className="rounded-lg border shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight" style={{ color: "#0c154c" }}>
              <Clock className="h-5 w-5 inline-block mr-2" />
              Módulos/Secciones Configuradas ({sections.length})
            </h3>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-4">
              {sections.map((section, index) => (
                <div
                  key={section.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  style={{ borderColor: "#1d4ed8" }}
                  onClick={() => handleSectionClick(section.id)}
                >
                  <div className="flex flex-col lg:flex-row gap-4 mb-3">
                    {/* Contenido principal */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                            style={{ backgroundColor: "#1d4ed8" }}
                          >
                            {index + 1}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-semibold text-lg break-words" style={{ color: "#0c154c" }}>
                              {section.title}
                            </h4>
                            <p className="text-gray-600 text-sm break-words">{section.description}</p>
                          </div>
                        </div>
                        <div
                          className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 flex-shrink-0 self-start text-white"
                          style={{ backgroundColor: getModuleTypeBg(section.moduleType) }}
                        >
                          {section.moduleType}
                        </div>
                      </div>

                      {/* Información de gradiente */}
                      {section.colorGradient && section.colorGradient.length >= 2 && (
                        <div className="mb-3">
                          <h5 className="text-sm font-medium mb-2" style={{ color: "#0c154c" }}>
                            Gradiente configurado:
                          </h5>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            {/* Preview del gradiente */}
                            <div
                              className="w-full sm:w-32 h-8 rounded border flex-shrink-0"
                              style={{
                                background: `linear-gradient(to right, ${section.colorGradient[0]}, ${section.colorGradient[1]})`,
                              }}
                            ></div>
                            {/* Colores individuales */}
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="flex items-center gap-1">
                                <div
                                  className="w-4 h-4 rounded border border-gray-300 flex-shrink-0"
                                  style={{ backgroundColor: section.colorGradient[0] }}
                                ></div>
                                <span className="text-xs font-mono text-gray-600">{section.colorGradient[0]}</span>
                              </div>
                              <span className="text-gray-400">→</span>
                              <div className="flex items-center gap-1">
                                <div
                                  className="w-4 h-4 rounded border border-gray-300 flex-shrink-0"
                                  style={{ backgroundColor: section.colorGradient[1] }}
                                ></div>
                                <span className="text-xs font-mono text-gray-600">{section.colorGradient[1]}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Metadatos técnicos */}
                      <div
                        className="text-xs text-gray-500 grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t"
                        style={{ borderColor: "#eff6ff" }}
                      >
                        <span>Sección ID: {section.id}</span>
                        <span>Curso ID: {section.courseId}</span>
                        <span>Creado: {formatDate(section.createdAt)}</span>
                        <span>Actualizado: {formatDate(section.updatedAt)}</span>
                        <span>Cover Image: {section.coverImage ? "Configurada" : "No definida"}</span>
                        <span>Gradiente: {section.colorGradient?.length || 0} colores</span>
                      </div>
                    </div>

                    {/* Imagen de cover si existe - posicionada a la derecha en desktop */}
                    {section.coverImage && (
                      <div className="relative w-full h-32 lg:w-32 lg:h-32 flex-shrink-0 rounded-lg overflow-hidden order-first lg:order-last">
                        <img
                          src={section.coverImage || "/placeholder.svg?height=128&width=128&query=section cover"}
                          alt={`Cover de ${section.title}`}
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Eventos de descuento */}
        {courseData.discountEvents && courseData.discountEvents.length > 0 && (
          <div className="rounded-lg border shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl font-semibold leading-none tracking-tight" style={{ color: "#0c154c" }}>
                <CalendarDays className="h-5 w-5 inline-block mr-2" />
                Descuentos Activos/Configurados ({courseData.discountEvents?.length || 0})
              </h3>
            </div>
            <div className="p-6 pt-0">
              <div className="space-y-4">
                {courseData.discountEvents.map((event) => (
                  <div
                    key={event.id}
                    className="border rounded-lg p-4"
                    style={{ backgroundColor: "#eff6ff", borderColor: "#42d7c7" }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold" style={{ color: "#0c154c" }}>
                        {event.event}
                      </h4>
                      <div
                        className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-white"
                        style={{ backgroundColor: event.isActive ? "#42d7c7" : "#6b7280" }}
                      >
                        {event.isActive ? "Activo" : "Inactivo"}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3">{event.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <span className="font-medium" style={{ color: "#0c154c" }}>
                          Descuento:
                        </span>{" "}
                        {event.value}%
                      </div>
                      <div>
                        <span className="font-medium" style={{ color: "#0c154c" }}>
                          Estado:
                        </span>{" "}
                        {event.isActive ? "Activo" : "Inactivo"}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <span className="font-medium" style={{ color: "#0c154c" }}>
                          Inicio del evento:
                        </span>{" "}
                        {formatDate(event.startDate)}
                      </div>
                      <div>
                        <span className="font-medium" style={{ color: "#0c154c" }}>
                          Fin del evento:
                        </span>{" "}
                        {formatDate(event.endDate)}
                      </div>
                    </div>
                    <div
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-gray-500 pt-2 border-t"
                      style={{ borderColor: "#1d4ed8" }}
                    >
                      <div>
                        <span className="font-medium">Evento ID:</span> {event.id}
                      </div>
                      <div>
                        <span className="font-medium">Deleted At:</span> {event.deletedAt || "No eliminado"}
                      </div>
                      <div>
                        <span className="font-medium">Creado:</span> {formatDate(event.createdAt)}
                      </div>
                      <div>
                        <span className="font-medium">Actualizado:</span> {formatDate(event.updatedAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Información adicional */}
        <div className="rounded-lg border shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight" style={{ color: "#0c154c" }}>
              Datos Técnicos y Metadatos
            </h3>
          </div>
          <div className="p-6 pt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2" style={{ color: "#0c154c" }}>
                  Identificadores
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Course ID:</span>
                    <span className="font-mono">{courseData.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Admin ID:</span>
                    <span className="font-mono">{courseData.adminId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Career Type ID:</span>
                    <span className="font-mono">{courseData.careerTypeId}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2" style={{ color: "#0c154c" }}>
                  Estados y Configuración
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Activo:</span>
                    <span style={{ color: courseData.isActive ? "#42d7c7" : "#ef4444" }}>
                      {courseData.isActive ? "SÍ" : "NO"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">En Desarrollo:</span>
                    <span style={{ color: courseData.isInDevelopment ? "#02ffff" : "#42d7c7" }}>
                      {courseData.isInDevelopment ? "SÍ" : "NO"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prerrequisitos:</span>
                    <span>{courseData.prerequisites || "No definidos"}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2" style={{ color: "#0c154c" }}>
                  Timestamps
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Creado:</span>
                    <span>{formatDate(courseData.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Última actualización:</span>
                    <span>{formatDate(courseData.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
