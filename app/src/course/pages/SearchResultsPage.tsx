import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, Zap, Clock, AlertCircle, Brain } from 'lucide-react';
import CoursesList from '../components/Courses/CoursesList';
import { CourseSearchService, SearchResult } from '../services/searchService';

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [smartSuggestion, setSmartSuggestion] = useState<string | null>(null);

  const currentPage = parseInt(searchParams.get('page') || '1');
  const query = searchParams.get('q') || '';

  const findBestSuggestion = async (searchQuery: string): Promise<string | null> => {
    const query = searchQuery.toLowerCase().trim();
    
    // Generar sugerencias más inteligentes basadas en el contexto
    const possibleSuggestions: string[] = [];
    
    // Agregar variaciones generales solo si son relevantes
    if (query.length > 3) {
      possibleSuggestions.push(
        query + ' programming',
        query + ' development',
        query + ' curso',
        'curso de ' + query
      );
    }
    
    // Buscar la mejor sugerencia
    let bestSuggestion = null;
    let maxResults = 0;

    for (const suggestion of possibleSuggestions) {
      if (suggestion === searchQuery || suggestion.length < 2) continue;
      
      try {
        const results = await CourseSearchService.advancedSearch({
          q: suggestion,
          page: 1,
          limit: 1
        });
        
        if (results.totalResults > maxResults) {
          maxResults = results.totalResults;
          bestSuggestion = suggestion;
        }
      } catch (err) {
        // Ignorar errores en sugerencias
      }
    }

    // Solo retornar si hay al menos 1 resultado
    return maxResults > 0 ? bestSuggestion : null;
  };

  const performSearch = async (searchQuery: string, page: number = 1) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setSmartSuggestion(null);

    try {
      const results = await CourseSearchService.advancedSearch({
        q: searchQuery,
        page,
        limit: 30
      });
      setSearchResults(results);
      
      // Si no hay resultados, buscar sugerencia inteligente
      if (results.totalResults === 0) {
        const suggestion = await findBestSuggestion(searchQuery);
        setSmartSuggestion(suggestion);
      }
    } catch (err) {
      setError('Error al realizar la búsqueda. Por favor, intenta de nuevo.');
      console.error('Error en búsqueda:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (searchQuery: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('q', searchQuery);
    params.set('page', '1');
    setSearchParams(params);
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ q: query, page: newPage.toString() });
  };

  const handleFuzzySearch = (suggestion: string, metadata?: { id: string }) => {
    const params = new URLSearchParams(searchParams);
    params.set('q', suggestion);
    params.set('page', '1');
    setSearchParams(params);
  };

  useEffect(() => {
    if (query && query.trim().length > 0) {
      performSearch(query, currentPage);
    }
  }, [query, currentPage]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {/* Header section */}
        <div className="px-4 py-6 md:py-8 border-b border-gray-200 bg-white">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                Resultados de Búsqueda
              </h1>
              <Link to="/cursos">
                <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                  Ver todos los cursos
                </button>
              </Link>
            </div>
            

            
            {/* Información de la búsqueda actual */}
            {query && (
              <div className="space-y-2">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Buscando: <strong>"{query}"</strong></span>
                </div>
                
                {/* Sugerencia inteligente basada en resultados */}
                {smartSuggestion && (
                  <div className="text-sm text-blue-600">
                    <span>¿Quizás quisiste decir </span>
                    <button 
                      onClick={() => handleSearchChange(smartSuggestion)}
                      className="font-medium underline hover:text-blue-800"
                    >
                      {smartSuggestion}
                    </button>
                    <span>?</span>
                  </div>
                )}
              </div>
            )}
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
                  
                  {/* Sugerencias fuzzy */}
                  {searchResults?.searchMetadata?.suggestions && searchResults.searchMetadata.suggestions.length > 0 && (
                    <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg max-w-md mx-auto">
                      <div className="flex items-center justify-center mb-2">
                        <Zap className="w-4 h-4 text-purple-600 mr-1" />
                        <span className="text-sm font-medium text-purple-800">¿Quisiste decir?</span>
                      </div>
                      <div className="space-y-1">
                        {searchResults.searchMetadata.suggestions.slice(0, 3).map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleFuzzySearch(suggestion, { id: 'fuzzy' })}
                            className="block w-full text-sm text-purple-700 hover:text-purple-900 hover:underline"
                          >
                            "{suggestion}"
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Opciones de búsqueda alternativas */}
                  <div className="mt-6">
                    <Link
                      to="/cursos"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
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