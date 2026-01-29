import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllContents } from '../services/contentServices';
import FontelloIcon from '../../shared/components/icons/FontelloIcon';
import toast from 'react-hot-toast';
import { getSectionUrl } from '../../shared/utils/sectionUrl';

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
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllContents();
      setContents(data || []);
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
    content.section?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    content.section?.course?.title.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="py-8 lg:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <FontelloIcon
                  name="icon-doc-text"
                  className="text-xl text-gray-700 dark:text-gray-300"
                  fallback={
                    <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  }
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                  Gestión de Contenidos
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Administra todos los contenidos de las secciones
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-900/30 rounded-lg p-4 shadow-sm mb-6">
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {contents.length} {contents.length === 1 ? 'contenido' : 'contenidos'}
                </div>
              </div>
              <div className="relative flex-1 sm:flex-initial sm:w-64">
                <FontelloIcon
                  name="icon-search"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
                />
                <input
                  type="text"
                  placeholder="Buscar contenidos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
                />
              </div>
            </div>

            {filteredContents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
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
                {filteredContents.map((content) => (
                  <div
                    key={content.id}
                    onClick={() => {
                      if (content.section) {
                        navigate(getSectionUrl(content.section));
                      } else if (content.sectionId) {
                        navigate(`/sections/${content.sectionId}`);
                      }
                    }}
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
                            {content.section?.course && (
                              <div className="flex items-center gap-2">
                                <FontelloIcon name="icon-book" className="text-xs" />
                                <span className="truncate">{content.section.course.title}</span>
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
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentsPage;
