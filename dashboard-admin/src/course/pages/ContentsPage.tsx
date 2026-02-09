import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { getAllContents, getContentBySection } from '../services/contentServices';
import FontelloIcon from '../../shared/components/icons/FontelloIcon';
import toast from 'react-hot-toast';
import { getSectionUrl } from '../../shared/utils/sectionUrl';
import { CourseData } from '../interfaces/CourseDetail';
import { Section as SectionType } from '../interfaces/ViewnerCourse';

interface CourseLayoutContext {
  course: CourseData;
  sections: SectionType[];
}

interface Content {
  id: string;
  title: string;
  text: string;
  markdown?: string;
  sectionId: string;
  duration: number;
  position: number;
  section?: {
    id: string;
    slug?: string; // Slug para URLs SEO-friendly
    title: string;
    courseId: string;
    course?: {
      id: string;
      title: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

const ContentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug?: string }>();
  const outletContext = useOutletContext<CourseLayoutContext>();
  
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const course = outletContext?.course;
  const sections = outletContext?.sections || [];

  useEffect(() => {
    if (course && sections.length > 0) {
      fetchContentsByCourse();
    } else if (slug) {
      // Si no hay contexto pero hay slug, cargar todos los contenidos
      fetchContents();
    } else {
      fetchContents();
    }
  }, [course, sections, slug]);

  const fetchContentsByCourse = async () => {
    if (!sections.length) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Obtener contenidos de todas las secciones del curso
      const allContentsPromises = sections.map(section => 
        getContentBySection(section.id.toString()).catch(() => [])
      );
      
      const contentsArrays = await Promise.all(allContentsPromises);
      const allContents = contentsArrays.flat();
      
      // Agregar información de sección y curso a cada contenido
      const contentsWithContext = allContents.map(content => {
        const section = sections.find(s => s.id.toString() === content.sectionId);
        return {
          ...content,
          section: section ? {
            ...section,
            course: course ? { id: course.id.toString(), title: course.title } : undefined
          } : undefined
        };
      });
      
      setContents(contentsWithContext);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los contenidos';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchContents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllContents();
      // Si hay curso, filtrar solo los contenidos de ese curso
      if (course) {
        const filtered = data.filter((content: Content) => 
          sections.some(s => s.id.toString() === content.sectionId)
        );
        setContents(filtered || []);
      } else {
        setContents(data || []);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los contenidos';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const filteredContents = contents.filter(content =>
    content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    content.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    content.section?.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && contents.length === 0) {
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
          <p className="text-gray-600 dark:text-gray-400">Cargando contenidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Contenidos del Curso
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {contents.length} {contents.length === 1 ? 'contenido' : 'contenidos'} en este curso
          </p>
        </div>
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
            placeholder="Buscar contenidos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {filteredContents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
              <FontelloIcon name="icon-doc-text" className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
              {searchTerm ? 'No se encontraron contenidos' : 'No hay contenidos disponibles'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
              {searchTerm ? 'Intenta con otro término de búsqueda' : 'Los contenidos aparecerán aquí cuando se creen'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredContents.map((content) => {
              const sectionUrl = content.section && course
                ? getSectionUrl({ ...content.section, course: { slug: course.slug, id: course.id } })
                : content.section
                ? getSectionUrl(content.section)
                : content.sectionId
                ? `/sections/${content.sectionId}`
                : '#';
              
              return (
                <div
                  key={content.id}
                  onClick={() => navigate(sectionUrl)}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {content.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-3">
                          {content.text}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          {content.section && (
                            <div className="flex items-center gap-2">
                              <FontelloIcon name="icon-folder" className="text-xs" />
                              <span className="truncate">{content.section.title}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <FontelloIcon name="icon-clock" className="text-xs" />
                            <span>{content.duration} min</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FontelloIcon name="icon-list" className="text-xs" />
                            <span>Posición: {content.position}</span>
                          </div>
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

export default ContentsPage;
