import api from '../../shared/api/axios';
import { cacheService } from '../../shared/services/cacheService';

const SECTIONS_ENDPOINT = '/sections';

// Obtener todas las secciones de un curso
export const getSectionsByCourse = async (courseId: string) => {
  try {
    // Intentar obtener del caché primero
    const cachedSections = cacheService.getSections(courseId);
    if (cachedSections) {
      console.log(`Secciones del curso ${courseId} obtenidas del caché`);
      return cachedSections;
    }

    // Si no hay caché, hacer la petición a la API
    const response = await api.get(`${SECTIONS_ENDPOINT}/course/${courseId}`);
    const sections = response.data.data;
    
    // Guardar en caché
    cacheService.setSections(courseId, sections);
    console.log(`Secciones del curso ${courseId} guardadas en caché`);
    
    return sections;
  } catch (error) {
    console.error('Error al obtener las secciones del curso:', error);
    throw error;
  }
};

// Crear una nueva sección
export const createSection = async (sectionData: any) => {
  try {
    const response = await api.post(SECTIONS_ENDPOINT, sectionData);
    
    // Limpiar caché de secciones del curso afectado
    if (sectionData.courseId) {
      cacheService.clearCourseCache(sectionData.courseId);
      console.log(`Caché del curso ${sectionData.courseId} limpiado después de crear sección`);
    }
    
    return response.data.data;
  } catch (error) {
    console.error('Error al crear la sección:', error);
    throw error;
  }
};

// Obtener una sección por su ID
export const getSectionById = async (id: string) => {
  try {
    const response = await api.get(`${SECTIONS_ENDPOINT}/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener la sección:', error);
    throw error;
  }
};

// Actualizar una sección existente
export const updateSection = async (id: string, sectionData: any) => {
  try {
    const response = await api.put(`${SECTIONS_ENDPOINT}/${id}/contents`, sectionData);
    
    // Limpiar caché de secciones del curso afectado
    if (sectionData.courseId) {
      cacheService.clearCourseCache(sectionData.courseId);
      console.log(`Caché del curso ${sectionData.courseId} limpiado después de actualizar sección`);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error al actualizar la sección:', error);
    throw error;
  }
};

// Eliminar una sección por su ID
export const deleteSection = async (id: string, courseId?: string) => {
  try {
    const response = await api.delete(`${SECTIONS_ENDPOINT}/${id}`);
    
    // Limpiar caché de secciones del curso afectado
    if (courseId) {
      cacheService.clearCourseCache(courseId);
      console.log(`Caché del curso ${courseId} limpiado después de eliminar sección`);
    }
    
    return response.data.data;
  } catch (error) {
    console.error('Error al eliminar la sección:', error);
    throw error;
  }
};

// Obtener el conteo total de secciones
export const getSectionCount = async () => {
  try {
    const response = await api.get(`${SECTIONS_ENDPOINT}/count`);
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener el conteo de secciones:', error);
    throw error;
  }
};
