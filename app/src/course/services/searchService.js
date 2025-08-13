import { API_BASE_URL } from '@/shared/config/api';
/**
 * Servicio para búsqueda de cursos
 */
export class CourseSearchService {
    /**
     * Búsqueda básica de cursos
     */
    static async searchCourses(options) {
        try {
            const params = new URLSearchParams({
                q: options.q,
                page: (options.page || 1).toString(),
                limit: (options.limit || 30).toString()
            });
            const response = await fetch(`${API_BASE_URL}/search/courses?${params}`);
            if (!response.ok) {
                throw new Error(`Error en la búsqueda: ${response.status}`);
            }
            const data = await response.json();
            return data.data;
        }
        catch (error) {
            console.error('Error al buscar cursos:', error);
            throw error;
        }
    }
    /**
     * Búsqueda unificada que combina automáticamente búsqueda tradicional, inteligente y fuzzy
     */
    static async advancedSearch(options) {
        try {
            const params = new URLSearchParams({
                q: options.q,
                page: (options.page || 1).toString(),
                limit: (options.limit || 30).toString()
            });
            // Agregar filtros opcionales
            if (options.category)
                params.append('category', options.category.toString());
            if (options.careerType)
                params.append('careerType', options.careerType.toString());
            if (options.minPrice !== undefined)
                params.append('minPrice', options.minPrice.toString());
            if (options.maxPrice !== undefined)
                params.append('maxPrice', options.maxPrice.toString());
            const response = await fetch(`${API_BASE_URL}/search/courses/advanced?${params}`);
            if (!response.ok) {
                throw new Error(`Error en la búsqueda: ${response.status}`);
            }
            const data = await response.json();
            return data.data;
        }
        catch (error) {
            console.error('Error al realizar búsqueda:', error);
            throw error;
        }
    }
    /**
     * Búsqueda fuzzy específica con corrección de errores tipográficos
     */
    static async fuzzySearch(query, threshold = 0.3, page = 1, limit = 30) {
        try {
            const params = new URLSearchParams({
                q: query,
                threshold: threshold.toString(),
                page: page.toString(),
                limit: limit.toString()
            });
            const response = await fetch(`${API_BASE_URL}/search/courses/fuzzy?${params}`);
            if (!response.ok) {
                throw new Error(`Error en la búsqueda fuzzy: ${response.status}`);
            }
            const data = await response.json();
            return data.data;
        }
        catch (error) {
            console.error('Error al realizar búsqueda fuzzy:', error);
            throw error;
        }
    }
    /**
     * Obtiene sugerencias fuzzy mejoradas
     */
    static async getFuzzySuggestions(query, limit = 10) {
        try {
            if (query.length < 2)
                return [];
            // Usar el endpoint fuzzy para obtener sugerencias con corrección
            const fuzzyResult = await this.fuzzySearch(query, 0.3, 1, limit);
            // Extraer sugerencias de los metadatos o usar títulos de cursos
            if (fuzzyResult.searchMetadata?.suggestions) {
                return fuzzyResult.searchMetadata.suggestions;
            }
            // Fallback: usar títulos de cursos encontrados
            return fuzzyResult.courses.slice(0, limit).map(course => course.title);
        }
        catch (error) {
            console.error('Error al obtener sugerencias fuzzy:', error);
            // Fallback a sugerencias tradicionales
            return this.getSuggestions(query);
        }
    }
    /**
     * Obtiene estadísticas de rendimiento de búsqueda
     */
    static async getStatistics() {
        try {
            const response = await fetch(`${API_BASE_URL}/search/courses/statistics`);
            if (!response.ok) {
                throw new Error(`Error al obtener estadísticas: ${response.status}`);
            }
            const data = await response.json();
            return data.data;
        }
        catch (error) {
            console.error('Error al obtener estadísticas:', error);
            return {
                totalSearches: 0,
                avgSearchTime: 0,
                fuzzySearches: 0,
                intelligentSearches: 0
            };
        }
    }
    /**
     * Obtiene sugerencias de búsqueda
     */
    static async getSuggestions(query) {
        try {
            if (query.length < 2)
                return [];
            const params = new URLSearchParams({ q: query });
            const response = await fetch(`${API_BASE_URL}/search/courses/suggestions?${params}`);
            if (!response.ok) {
                throw new Error(`Error al obtener sugerencias: ${response.status}`);
            }
            const data = await response.json();
            return data.data.suggestions;
        }
        catch (error) {
            console.error('Error al obtener sugerencias:', error);
            return [];
        }
    }
}
