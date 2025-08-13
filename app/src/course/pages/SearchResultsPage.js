import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import CoursesList from '../components/Courses/CoursesList';
import { CourseSearchService } from '../services/searchService';
export default function SearchResultsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchResults, setSearchResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [smartSuggestion, setSmartSuggestion] = useState(null);
    const currentPage = parseInt(searchParams.get('page') || '1');
    const query = searchParams.get('q') || '';
    const findBestSuggestion = async (searchQuery) => {
        const query = searchQuery.toLowerCase().trim();
        // Generar sugerencias más inteligentes basadas en el contexto
        const possibleSuggestions = [];
        // Agregar variaciones generales solo si son relevantes
        if (query.length > 3) {
            possibleSuggestions.push(query + ' programming', query + ' development', query + ' curso', 'curso de ' + query);
        }
        // Buscar la mejor sugerencia
        let bestSuggestion = null;
        let maxResults = 0;
        for (const suggestion of possibleSuggestions) {
            if (suggestion === searchQuery || suggestion.length < 2)
                continue;
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
            }
            catch (err) {
                // Ignorar errores en sugerencias
            }
        }
        // Solo retornar si hay al menos 1 resultado
        return maxResults > 0 ? bestSuggestion : null;
    };
    const performSearch = async (searchQuery, page = 1) => {
        if (!searchQuery.trim())
            return;
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
        }
        catch (err) {
            setError('Error al realizar la búsqueda. Por favor, intenta de nuevo.');
            console.error('Error en búsqueda:', err);
        }
        finally {
            setLoading(false);
        }
    };
    const handleSearchChange = (searchQuery) => {
        const params = new URLSearchParams(searchParams);
        params.set('q', searchQuery);
        params.set('page', '1');
        setSearchParams(params);
    };
    const handlePageChange = (newPage) => {
        setSearchParams({ q: query, page: newPage.toString() });
    };
    const handleFuzzySearch = (suggestion, metadata) => {
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
    return (_jsx("div", { className: "min-h-screen bg-gray-50", children: _jsxs("div", { className: "max-w-5xl mx-auto", children: [_jsx("div", { className: "px-4 py-6 md:py-8 border-b border-gray-200 bg-white", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h1", { className: "text-xl md:text-2xl font-semibold text-gray-900", children: "Resultados de B\u00FAsqueda" }), _jsx(Link, { to: "/cursos", children: _jsx("button", { className: "inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors", children: "Ver todos los cursos" }) })] }), query && (_jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "flex items-center space-x-4 text-sm text-gray-600", children: _jsxs("span", { children: ["Buscando: ", _jsxs("strong", { children: ["\"", query, "\""] })] }) }), smartSuggestion && (_jsxs("div", { className: "text-sm text-blue-600", children: [_jsx("span", { children: "\u00BFQuiz\u00E1s quisiste decir " }), _jsx("button", { onClick: () => handleSearchChange(smartSuggestion), className: "font-medium underline hover:text-blue-800", children: smartSuggestion }), _jsx("span", { children: "?" })] }))] }))] }) }), _jsxs("div", { className: "px-4 py-6", children: [loading && (_jsxs("div", { className: "flex justify-center items-center py-12", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" }), _jsx("span", { className: "ml-2 text-gray-600", children: "Buscando cursos..." })] })), error && (_jsx("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4 mb-6", children: _jsx("p", { className: "text-red-800", children: error }) })), !loading && !error && searchResults && (_jsx(_Fragment, { children: searchResults.courses.length > 0 ? (_jsxs(_Fragment, { children: [_jsx(CoursesList, { courses: searchResults.courses }), searchResults.pagination.totalPages > 1 && (_jsxs("div", { className: "flex items-center justify-center space-x-2 mt-8", children: [_jsxs("button", { onClick: () => handlePageChange(currentPage - 1), disabled: !searchResults.pagination.hasPreviousPage, className: "inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed", children: [_jsx(ChevronLeft, { className: "h-4 w-4 mr-1" }), "Anterior"] }), _jsxs("span", { className: "px-4 py-2 text-sm text-gray-700", children: [currentPage, " de ", searchResults.pagination.totalPages] }), _jsxs("button", { onClick: () => handlePageChange(currentPage + 1), disabled: !searchResults.pagination.hasNextPage, className: "inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed", children: ["Siguiente", _jsx(ChevronRight, { className: "h-4 w-4 ml-1" })] })] }))] })) : (_jsxs("div", { className: "text-center py-12", children: [_jsx(Search, { className: "mx-auto h-12 w-12 text-gray-400" }), _jsx("h3", { className: "mt-2 text-sm font-medium text-gray-900", children: "No se encontraron cursos" }), _jsxs("p", { className: "mt-1 text-sm text-gray-500", children: ["No hay cursos que coincidan con tu b\u00FAsqueda \"", query, "\""] }), searchResults?.searchMetadata?.suggestions && searchResults.searchMetadata.suggestions.length > 0 && (_jsxs("div", { className: "mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg max-w-md mx-auto", children: [_jsxs("div", { className: "flex items-center justify-center mb-2", children: [_jsx(Zap, { className: "w-4 h-4 text-purple-600 mr-1" }), _jsx("span", { className: "text-sm font-medium text-purple-800", children: "\u00BFQuisiste decir?" })] }), _jsx("div", { className: "space-y-1", children: searchResults.searchMetadata.suggestions.slice(0, 3).map((suggestion, index) => (_jsxs("button", { onClick: () => handleFuzzySearch(suggestion, { id: 'fuzzy' }), className: "block w-full text-sm text-purple-700 hover:text-purple-900 hover:underline", children: ["\"", suggestion, "\""] }, index))) })] })), _jsx("div", { className: "mt-6", children: _jsx(Link, { to: "/cursos", className: "inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500", children: "Ver todos los cursos" }) })] })) })), !loading && !error && !searchResults && query && (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-gray-500", children: "Realiza una b\u00FAsqueda para ver los resultados" }) }))] })] }) }));
}
