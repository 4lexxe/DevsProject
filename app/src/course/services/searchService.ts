import { API_BASE_URL } from '@/shared/config/api';

interface SearchOptions {
  q: string;
  page?: number;
  limit?: number;
  category?: number;
  careerType?: number;
  minPrice?: number;
  maxPrice?: number;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  itemsPerPage: number;
}

interface SearchResult {
  courses: any[];
  totalResults: number;
  searchTerm: string;
  appliedFilters: Partial<SearchOptions>;
  pagination: PaginationInfo;
}

interface SuggestionsResponse {
  suggestions: string[];
  query: string;
}

/**
 * Servicio para búsqueda de cursos
 */
export class CourseSearchService {
  
  /**
   * Búsqueda básica de cursos
   */
  static async searchCourses(options: SearchOptions): Promise<SearchResult> {
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
    } catch (error) {
      console.error('Error al buscar cursos:', error);
      throw error;
    }
  }

  /**
   * Búsqueda avanzada de cursos con filtros
   */
  static async advancedSearch(options: SearchOptions): Promise<SearchResult> {
    try {
      const params = new URLSearchParams({
        q: options.q,
        page: (options.page || 1).toString(),
        limit: (options.limit || 30).toString()
      });

      // Agregar filtros opcionales
      if (options.category) params.append('category', options.category.toString());
      if (options.careerType) params.append('careerType', options.careerType.toString());
      if (options.minPrice !== undefined) params.append('minPrice', options.minPrice.toString());
      if (options.maxPrice !== undefined) params.append('maxPrice', options.maxPrice.toString());

      const response = await fetch(`${API_BASE_URL}/search/courses/advanced?${params}`);
      
      if (!response.ok) {
        throw new Error(`Error en la búsqueda avanzada: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error al realizar búsqueda avanzada:', error);
      throw error;
    }
  }

  /**
   * Obtiene sugerencias de búsqueda
   */
  static async getSuggestions(query: string): Promise<string[]> {
    try {
      if (query.length < 2) return [];

      const params = new URLSearchParams({ q: query });
      const response = await fetch(`${API_BASE_URL}/search/courses/suggestions?${params}`);
      
      if (!response.ok) {
        throw new Error(`Error al obtener sugerencias: ${response.status}`);
      }

      const data = await response.json();
      return data.data.suggestions;
    } catch (error) {
      console.error('Error al obtener sugerencias:', error);
      return [];
    }
  }
}

export type { SearchOptions, SearchResult, PaginationInfo, SuggestionsResponse };