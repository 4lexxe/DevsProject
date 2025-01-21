import api from '../api/axios';

// Obtiene el contenido por sección
export const getContentBySection = async (sectionId: string) => {
  try {
    console.log(`Obteniendo contenido para la sección ID: ${sectionId}`);
    const response = await api.get(`/content/section/${sectionId}`);
    return response.data;
  } catch (error: any) {
    console.error(
      `Error al obtener el contenido de la sección (ID: ${sectionId}):`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// Obtiene un contenido específico por ID
export const getContentById = async (contentId: string) => {
  try {
    console.log(`Obteniendo contenido con ID: ${contentId}`);
    const response = await api.get(`/content/${contentId}`);
    return response.data;
  } catch (error: any) {
    console.error(
      `Error al obtener el contenido (ID: ${contentId}):`,
      error.response?.data || error.message
    );
    throw error;
  }
};