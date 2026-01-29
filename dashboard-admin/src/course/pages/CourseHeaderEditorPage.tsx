import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Edit, Eye, Code, Layout, Plus } from "lucide-react";
import { getAll } from "../services/courseServices";

interface Course {
  id: number;
  title: string;
  slug: string;
  image: string;
  headerType?: 'default' | 'programming' | 'hacking' | 'custom' | 'iframe';
  headerTitle?: string;
  headerSubtitle?: string;
  headerDescription?: string;
  headerButtonText?: string;
  headerButtonLink?: string;
  techStack?: string[];
  customHeaderContent?: string;
}

export default function CourseHeaderEditorPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await getAll();
        // La respuesta tiene estructura: { status: 'success', data: [...], message: '...' }
        if (response && response.data && Array.isArray(response.data)) {
          setCourses(response.data);
        } else if (response && Array.isArray(response)) {
          // Por si acaso la respuesta es directamente un array
          setCourses(response);
        }
      } catch (error) {
        console.error("Error al cargar los cursos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getHeaderTypeBadge = (type?: string) => {
    const badges: Record<string, { label: string; color: string }> = {
      default: { label: "Por Defecto", color: "bg-gray-100 text-gray-700" },
      programming: { label: "Programación", color: "bg-blue-100 text-blue-700" },
      hacking: { label: "Hacking", color: "bg-green-100 text-green-700" },
      custom: { label: "Personalizado", color: "bg-purple-100 text-purple-700" },
      iframe: { label: "Iframe", color: "bg-orange-100 text-orange-700" },
    };

    const badge = badges[type || "default"];
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Layout className="w-8 h-8 text-blue-600" />
                Editor de Headers de Cursos
              </h1>
              <p className="text-gray-600 mt-2">
                Gestiona y personaliza los headers dinámicos de tus cursos
              </p>
            </div>
            <button
              onClick={() => navigate("/courses/new")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Nuevo Curso
            </button>
          </div>

          {/* Buscador */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar cursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Lista de cursos */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchTerm ? "No se encontraron cursos" : "No hay cursos disponibles"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Imagen del curso */}
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/400x200?text=Sin+Imagen";
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    {getHeaderTypeBadge(course.headerType)}
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {course.title}
                  </h3>

                  {/* Información del header */}
                  <div className="space-y-2 mb-4">
                    {course.headerSubtitle && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Subtítulo:</span> {course.headerSubtitle}
                      </p>
                    )}
                    {course.techStack && course.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {course.techStack.slice(0, 3).map((tech, index) => (
                          <span
                            key={index}
                            className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded"
                          >
                            {tech}
                          </span>
                        ))}
                        {course.techStack.length > 3 && (
                          <span className="px-2 py-0.5 text-xs text-gray-500">
                            +{course.techStack.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Botones de acción */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/courses/${course.slug}/edit`)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      <Edit className="w-4 h-4" />
                      Editar Header
                    </button>
                    <button
                      onClick={() => navigate(`/courses/${course.slug}`)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      title="Ver detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
