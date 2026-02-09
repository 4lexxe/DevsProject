import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { getSectionsByCourse } from '../services/sectionServices';
import FontelloIcon from '../../shared/components/icons/FontelloIcon';
import toast from 'react-hot-toast';
import { getSectionUrl } from '../../shared/utils/sectionUrl';
import { CourseData } from '../interfaces/CourseDetail';
import { Section as SectionType } from '../interfaces/ViewnerCourse';

interface CourseLayoutContext {
  course: CourseData;
  sections: SectionType[];
}

const SectionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug?: string }>();
  const outletContext = useOutletContext<CourseLayoutContext>();
  
  const [sections, setSections] = useState<SectionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Si estamos dentro del CourseLayout, usar las secciones del contexto
  const course = outletContext?.course;
  const contextSections = outletContext?.sections || [];

  useEffect(() => {
    if (contextSections.length > 0) {
      setSections(contextSections);
      setLoading(false);
    } else if (course?.id) {
      fetchSections();
    } else if (slug) {
      // Si no hay contexto pero hay slug, intentar cargar
      fetchSections();
    } else {
      setLoading(false);
    }
  }, [contextSections, course, slug]);

  const fetchSections = async () => {
    if (!course?.id && !slug) return;
    
    try {
      setLoading(true);
      setError(null);
      const courseId = course?.id?.toString() || slug || '';
      const data = await getSectionsByCourse(courseId);
      setSections(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar las secciones';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && sections.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <FontelloIcon
            name="icon-spin6"
            className="text-2xl text-gray-600 dark:text-gray-400 animate-spin"
            fallback={
              <div className="h-8 w-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            }
          />
          <p className="text-gray-600 dark:text-gray-400">Cargando secciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Secciones del Curso
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {sections.length} {sections.length === 1 ? 'sección' : 'secciones'} en este curso
          </p>
        </div>
        {course?.id && (
          <button
            onClick={() => navigate(`/courses/${course.slug || course.id}/section/form`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FontelloIcon name="icon-plus" className="text-sm" />
            Nueva Sección
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <FontelloIcon name="icon-attention" className="text-lg text-red-600 dark:text-red-400" />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Error</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="relative">
          <FontelloIcon
            name="icon-search"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
          />
          <input
            type="text"
            placeholder="Buscar secciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {filteredSections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
              <FontelloIcon name="icon-folder" className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
              {searchTerm ? 'No se encontraron secciones' : 'No hay secciones disponibles'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
              {searchTerm ? 'Intenta con otro término de búsqueda' : 'Las secciones aparecerán aquí cuando se creen'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSections.map((section) => {
              const sectionUrl = course 
                ? getSectionUrl({ ...section, course: { slug: course.slug, id: course.id } })
                : getSectionUrl(section);
              
              return (
                <div
                  key={section.id}
                  onClick={() => navigate(sectionUrl)}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  {section.coverImage && (
                    <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${section.coverImage})` }} />
                  )}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">
                          {section.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                          {section.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <span
                            className="px-2 py-1 text-xs font-medium rounded"
                            style={{
                              backgroundColor: section.colorGradient?.[0] || '#000',
                              color: '#fff'
                            }}
                          >
                            {section.moduleType}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionsPage;
