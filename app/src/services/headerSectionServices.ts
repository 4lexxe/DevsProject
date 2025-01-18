import api from '../api/axios';

const HEADER_SECTION_ENDPOINT = '/header-sections';

// Obtener todas las secciones de encabezado
export const getHeaderSections = async () => {
  try {
    const response = await api.get(HEADER_SECTION_ENDPOINT);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las secciones de encabezado:', error);
    throw error;
  }
};

// Obtener una sección de encabezado por ID
export const getHeaderSectionById = async (id: string) => {
  try {
    const response = await api.get(`${HEADER_SECTION_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener la sección de encabezado:', error);
    throw error;
  }
};

// Crear una nueva sección de encabezado
export const createHeaderSection = async (headerSectionData: any) => {
  try {
    const response = await api.post(HEADER_SECTION_ENDPOINT, headerSectionData);
    return response.data;
  } catch (error) {
    console.error('Error al crear la sección de encabezado:', error);
    throw error;
  }
};

// Actualizar una sección de encabezado
export const updateHeaderSection = async (id: string, headerSectionData: any) => {
  try {
    const response = await api.put(`${HEADER_SECTION_ENDPOINT}/${id}`, headerSectionData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar la sección de encabezado:', error);
    throw error;
  }
};

// Eliminar una sección de encabezado
export const deleteHeaderSection = async (id: string) => {
  try {
    const response = await api.delete(`${HEADER_SECTION_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar la sección de encabezado:', error);
    throw error;
  }
};