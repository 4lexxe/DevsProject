import React, { useState, useEffect } from "react";
import { Outlet, useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { BookOpen, Folder, FileText, ChevronRight, Home } from "lucide-react";
import { getById } from "../services/courseServices";
import { getSectionsByCourse } from "../services/sectionServices";
import { CourseData, Section } from "../interfaces/CourseDetail";
import { getSectionUrl } from "../../shared/utils/sectionUrl";

const CourseLayout: React.FC = () => {
  const { slug, courseSlug } = useParams<{ slug?: string; courseSlug?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [course, setCourse] = useState<CourseData | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  const courseIdentifier = slug || courseSlug;

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseIdentifier) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const courseData = await getById(courseIdentifier);
        if (courseData) {
          setCourse(courseData);
          const courseSections = await getSectionsByCourse(courseData.id.toString());
          setSections(courseSections || []);
        }
      } catch (error) {
        console.error('Error loading course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseIdentifier]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando curso...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">Curso no encontrado</p>
          <Link
            to="/courses"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Volver a cursos
          </Link>
        </div>
      </div>
    );
  }

  // Determinar la sección actual basada en la URL
  const currentPath = location.pathname;
  const isSectionPage = currentPath.includes('/section/');
  const isContentPage = currentPath.includes('/content/');
  
  // Extraer sectionSlug de la URL si existe
  const sectionMatch = currentPath.match(/\/section\/([^/]+)/);
  const currentSectionSlug = sectionMatch ? sectionMatch[1] : null;
  const currentSection = currentSectionSlug 
    ? sections.find(s => (s.slug === currentSectionSlug) || (s.id.toString() === currentSectionSlug))
    : null;

  const navItems = [
    {
      label: 'Información',
      path: `/courses/${course.slug || course.id}`,
      icon: BookOpen,
      active: currentPath === `/courses/${course.slug || course.id}` || 
              (currentPath === `/courses/${course.slug || course.id}/edit`)
    },
    {
      label: 'Secciones',
      path: `/courses/${course.slug || course.id}/sections`,
      icon: Folder,
      active: isSectionPage || currentPath.includes('/sections'),
      count: sections.length
    },
    {
      label: 'Contenidos',
      path: `/courses/${course.slug || course.id}/contents`,
      icon: FileText,
      active: isContentPage || currentPath.includes('/contents'),
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link
              to="/courses"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              Cursos
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 dark:text-white font-medium truncate max-w-md">
              {course.title}
            </span>
            {currentSection && (
              <>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400 truncate max-w-md">
                  {currentSection.title}
                </span>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Course Header Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {course.image && (
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                />
              )}
              <div className="min-w-0 flex-1">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                  {course.title}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {course.summary || 'Sin descripción'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 border-t border-gray-200 dark:border-gray-700 -mb-px">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.active;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px
                    ${isActive
                      ? 'border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.count !== undefined && (
                    <span className={`
                      px-2 py-0.5 text-xs rounded-full
                      ${isActive
                        ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }
                    `}>
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet context={{ course, sections }} />
      </div>
    </div>
  );
};

export default CourseLayout;
