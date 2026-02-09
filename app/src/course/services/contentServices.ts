import api from '../../shared/api/axios';

// Obtiene el contenido por sección
const CONTENT = "/contents"

export const getContentBySection = async (sectionId: string) => {
  try {    
    const response = await api.get(`${CONTENT}/section/${sectionId}`);
    return response.data.data;
  } catch (error: any) {
    console.error(
      `Error al obtener el contenido de la sección (ID: ${sectionId}):`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// Obtiene un contenido específico por courseSlug, sectionSlug y contentSlug
export const getContentBySlugs = async (courseSlug: string, sectionSlug: string, contentSlug: string) => {
  try {
    const response = await api.get(`${CONTENT}/course/${courseSlug}/section/${sectionSlug}/content/${contentSlug}`);
    return response.data.data;
  } catch (error: any) {
    console.error(
      `Error al obtener el contenido (slugs: ${courseSlug}/${sectionSlug}/${contentSlug}):`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// Obtiene un contenido específico por ID y su navegacion (fallback para rutas antiguas)
export const getContentById = async (contentId: string) => {
  try {
    const response = await api.get(`${CONTENT}/navigate/${contentId}`);
    return response.data.data;
  } catch (error: any) {
    console.error(
      `Error al obtener el contenido (ID: ${contentId}):`,
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getQuizByContentId = async (contentId: string) => {
  try {
    const response = await api.get(`${CONTENT}/${contentId}/quiz`);
    return response.data.data;
  } catch (error: any) {
    console.error(
      `Error al obtener el contenido (ID: ${contentId}):`,
      error.response?.data || error.message
    );
    throw error;
  }
};