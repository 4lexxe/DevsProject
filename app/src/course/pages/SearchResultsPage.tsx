import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import CoursesList from '../components/courses/CoursesList';
import { CourseSearchService, SearchResult } from '../services/searchService';

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentPage = parseInt(searchParams.get('page') || '1');
  const query = searchParams.get('q') || '';

  const performSearch = async (searchQuery: string, page: number = 1) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const results = await CourseSearchService.searchCourses({
        q: searchQuery,
        page,
        limit: 30
      });
      setSearchResults(results);
    } catch (err) {
      setError('Error al realizar la búsqueda. Por favor, intenta de nuevo.');
      console.error('Error en búsqueda:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ q: query, page: newPage.toString() });
  };

  useEffect(() => {
    if (query) {
      performSearch(query, currentPage);
    }
  }, [query, currentPage]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {/* Header section */}
        <div className="px-4 py-6 md:py-8 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
              Resultados de Búsqueda "{query}"
            </h1>
            <Link to="/cursos">
              <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                Ver todos los cursos
              </button>
            </Link>
          </div>
        </div>

        {/* Content section */}
        <div className="px-4 py-6">
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Buscando cursos...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {!loading && !error && searchResults && (
            <>
              {searchResults.courses.length > 0 ? (
                <>
                  <CoursesList courses={searchResults.courses} />
                  
                  {/* Pagination */}
                  {searchResults.pagination.totalPages > 1 && (
                    <div className="flex items-center justify-center space-x-2 mt-8">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!searchResults.pagination.hasPreviousPage}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Anterior
                      </button>
                      
                      <span className="px-4 py-2 text-sm text-gray-700">
                        {currentPage} de {searchResults.pagination.totalPages}
                      </span>
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!searchResults.pagination.hasNextPage}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Siguiente
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <Search className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron cursos</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No hay cursos que coincidan con tu búsqueda "{query}"
                  </p>
                  <div className="mt-6">
                    <Link
                      to="/cursos"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Ver todos los cursos
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}

          {!loading && !error && !searchResults && query && (
            <div className="text-center py-12">
              <p className="text-gray-500">Realiza una búsqueda para ver los resultados</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}