import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllSections, getSectionCount } from '../services/sectionServices';
import FontelloIcon from '../../shared/components/icons/FontelloIcon';
import toast from 'react-hot-toast';
import { getSectionUrl } from '../../shared/utils/sectionUrl';

interface Section {
  id: string;
  slug?: string; // Slug para URLs SEO-friendly
  title: string;
  description: string;
  courseId: string;
  coverImage?: string;
  moduleType: string;
  colorGradient: string[];
  course?: {
    id: string;
    title: string;
  };
  createdAt: string;
  updatedAt: string;
}

const SectionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchSections();
    fetchCount();
  }, []);

  const fetchSections = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllSections();
      setSections(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar las secciones';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchCount = async () => {
    try {
      const count = await getSectionCount();
      setTotalCount(count || 0);
    } catch (err) {
      console.error('Error al obtener el conteo:', err);
    }
  };

  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.course?.title.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="py-8 lg:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <FontelloIcon
                  name="icon-folder"
                  className="text-xl text-gray-700 dark:text-gray-300"
                  fallback={
                    <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  }
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                  Gestión de Secciones
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Administra todas las secciones de los cursos
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
                  {totalCount} {totalCount === 1 ? 'sección' : 'secciones'}
                </div>
              </div>
              <div className="relative flex-1 sm:flex-initial sm:w-64">
                <FontelloIcon
                  name="icon-search"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
                />
                <input
                  type="text"
                  placeholder="Buscar secciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
                />
              </div>
            </div>

            {filteredSections.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
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
                {filteredSections.map((section) => (
                  <div
                    key={section.id}
                    onClick={() => navigate(getSectionUrl(section))}
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
                          {section.course && (
                            <div className="flex items-center gap-2 mb-3">
                              <FontelloIcon name="icon-book" className="text-xs text-gray-400" />
                              <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {section.course.title}
                              </span>
                            </div>
                          )}
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
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionsPage;
