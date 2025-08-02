import api from '../../shared/api/axios';

const SECTIONS_ENDPOINT = '/sections';

// Obtener todas las secciones de un curso
export const getSectionsByCourse = async (courseId: string) => {
  try {
    const response = await api.get(`${SECTIONS_ENDPOINT}/course/${courseId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener las secciones del curso:', error);
    throw error;
  }
};

export const getSectionByIdWithContents = async (sectionId: string) => {
  try {
    const response = await api.get(`${SECTIONS_ENDPOINT}/${sectionId}/contents`);
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener la sección con contenidos:', error);
    throw error;
  }
}

// Crear una nueva sección
export const createSection = async (sectionData: any) => {
  try {
    const response = await api.post(SECTIONS_ENDPOINT, sectionData);
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
    return response.data;
  } catch (error) {
    console.error('Error al actualizar la sección:', error);
    throw error;
  }
};

// Eliminar una sección por su ID
export const deleteSection = async (id: string) => {
  try {
    const response = await api.delete(`${SECTIONS_ENDPOINT}/${id}`);
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
