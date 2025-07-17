import api from '../../shared/api/axios';
import { type Section, type Content } from './contentServices';

const SECTIONS_ENDPOINT = '/sections';

// Interfaces específicas para secciones
export interface SectionWithContents extends Section {
  contents: Content[];
  contentsCount?: number;
}

export interface SectionInput {
  title: string;
  description: string;
  moduleType: string;
  coverImage: string;
  colorGradient: [string, string];
  courseId: string;
  order?: number;
}

export interface SectionFilters {
  courseId?: string;
  moduleType?: string;
  isActive?: boolean;
  search?: string;
}

export interface SectionStats {
  totalSections: number;
  activeSections: number;
  inactiveSections: number;
  averageContentsPerSection: number;
}

// Obtener todas las secciones de un curso
export const getSectionsByCourse = async (courseId: string): Promise<SectionWithContents[]> => {
  try {
    const response = await api.get(`${SECTIONS_ENDPOINT}/course/${courseId}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error al obtener las secciones del curso:', error);
    throw error;
  }
};

// Obtener todas las secciones con filtros (para dashboard admin)
export const getAllSections = async (filters?: SectionFilters): Promise<SectionWithContents[]> => {
  try {
    const params = new URLSearchParams();
    if (filters?.courseId) params.append('courseId', filters.courseId);
    if (filters?.moduleType) params.append('moduleType', filters.moduleType);
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());

    const endpoint = params.toString() ? `${SECTIONS_ENDPOINT}?${params.toString()}` : SECTIONS_ENDPOINT;
    const response = await api.get(endpoint);
    let sections = response.data.data || response.data;

    // Aplicar filtro de búsqueda del lado del cliente si es necesario
    if (filters?.search && sections) {
      const searchTerm = filters.search.toLowerCase();
      sections = sections.filter((section: SectionWithContents) => 
        section.title.toLowerCase().includes(searchTerm) ||
        section.description.toLowerCase().includes(searchTerm) ||
        section.moduleType.toLowerCase().includes(searchTerm)
      );
    }

    return sections || [];
  } catch (error) {
    console.error('Error al obtener todas las secciones:', error);
    throw error;
  }
};

// Obtener sección por ID
export const getSectionById = async (id: string): Promise<SectionWithContents> => {
  try {
    const response = await api.get(`${SECTIONS_ENDPOINT}/${id}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error al obtener la sección:', error);
    throw error;
  }
};

// Crear nueva sección
export const createSection = async (sectionData: SectionInput): Promise<Section> => {
  try {
    const response = await api.post(SECTIONS_ENDPOINT, sectionData);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error al crear la sección:', error);
    throw error;
  }
};

// Actualizar sección existente
export const updateSection = async (id: string, sectionData: Partial<SectionInput>): Promise<Section> => {
  try {
    const response = await api.put(`${SECTIONS_ENDPOINT}/${id}`, sectionData);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error al actualizar la sección:', error);
    throw error;
  }
};

// Actualizar sección con contenidos
export const updateSectionWithContents = async (id: string, sectionData: Partial<SectionInput> & { contents?: Partial<Content>[] }) => {
  try {
    const response = await api.put(`${SECTIONS_ENDPOINT}/${id}/contents`, sectionData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar la sección con contenidos:', error);
    throw error;
  }
};

// Eliminar sección
export const deleteSection = async (id: string): Promise<boolean> => {
  try {
    await api.delete(`${SECTIONS_ENDPOINT}/${id}`);
    return true;
  } catch (error) {
    console.error('Error al eliminar la sección:', error);
    throw error;
  }
};

// Reordenar secciones en un curso
export const reorderSections = async (courseId: string, sectionIds: string[]): Promise<boolean> => {
  try {
    await api.patch(`${SECTIONS_ENDPOINT}/reorder`, { courseId, sectionIds });
    return true;
  } catch (error) {
    console.error('Error al reordenar las secciones:', error);
    throw error;
  }
};

// Duplicar sección
export const duplicateSection = async (id: string): Promise<Section> => {
  try {
    const response = await api.post(`${SECTIONS_ENDPOINT}/${id}/duplicate`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error al duplicar la sección:', error);
    throw error;
  }
};

// Obtener conteo de secciones
export const getSectionCount = async (courseId?: string): Promise<number> => {
  try {
    const endpoint = courseId ? `${SECTIONS_ENDPOINT}/count?courseId=${courseId}` : `${SECTIONS_ENDPOINT}/count`;
    const response = await api.get(endpoint);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error al obtener el conteo de secciones:', error);
    throw error;
  }
};

// Obtener estadísticas de secciones
export const getSectionStats = async (courseId?: string): Promise<SectionStats> => {
  try {
    const endpoint = courseId ? `${SECTIONS_ENDPOINT}/stats?courseId=${courseId}` : `${SECTIONS_ENDPOINT}/stats`;
    const response = await api.get(endpoint);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error al obtener las estadísticas de secciones:', error);
    // Si el endpoint no existe, calculamos desde todas las secciones
    const sections = await getAllSections(courseId ? { courseId } : undefined);
    
    const totalContents = sections.reduce((total, section) => total + (section.contentsCount || section.contents?.length || 0), 0);
    
    return {
      totalSections: sections.length,
      activeSections: sections.filter(section => section.isActive).length,
      inactiveSections: sections.filter(section => !section.isActive).length,
      averageContentsPerSection: sections.length > 0 ? totalContents / sections.length : 0
    };
  }
};

// Activar/Desactivar sección
export const toggleSectionStatus = async (id: string, isActive: boolean): Promise<Section> => {
  try {
    const response = await api.patch(`${SECTIONS_ENDPOINT}/${id}/status`, { isActive });
    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error al cambiar el estado de la sección con id ${id}:`, error);
    throw error;
  }
};

// Obtener secciones más populares
export const getPopularSections = async (limit: number = 10): Promise<SectionWithContents[]> => {
  try {
    const response = await api.get(`${SECTIONS_ENDPOINT}/popular?limit=${limit}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error al obtener las secciones populares:', error);
    throw error;
  }
};
