import api from '../../shared/api/axios';

// Obtiene el contenido por sección
const CONTENT = "/contents"

export const getContentBySection = async (sectionId: string) => {
  try {
    console.log(`Obteniendo contenido para la sección ID: ${sectionId}`);
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

// Obtiene un contenido específico por ID y su navegacion
export const getContentById = async (contentId: string) => {
  try {
    console.log(`Obteniendo contenido con ID: ${contentId}`);
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
    console.log(`Obteniendo quiz para el contenido con ID: ${contentId}`);
    const response = await api.get(`${CONTENT}/${contentId}/quiz`);
    return response.data.data;
  } catch (error: any) {
    console.error(
      `Error al obtener el quiz (ID: ${contentId}):`,
      error.response?.data || error.message
    );
    throw error;
  }
};

export const saveContentQuiz = async (contentId: string, quiz: any) => {
  try {
    console.log(`Guardando quiz para el contenido ID: ${contentId}`);
    const response = await api.put(`${CONTENT}/${contentId}/quiz`, quiz);
    return response.data.data;
  } catch (error: any) {
    console.error(
      `Error al guardar el quiz para el contenido (ID: ${contentId}):`,
      error.response?.data || error.message
    );
    throw error;
  }
}

export const deleteContentQuiz = async (contentId: string) => {
  try {
    console.log(`Eliminando quiz del contenido ID: ${contentId}`);
    const response = await api.delete(`${CONTENT}/${contentId}/quiz`);
    return response.data.data;
  } catch (error: any) {
    console.error(
      `Error al eliminar el quiz del contenido (ID: ${contentId}):`,
      error.response?.data || error.message
    );
    throw error;
  }
}

// Obtener un contenido por ID (sin navegación)
export const getContentByIdSimple = async (contentId: string) => {
  try {
    const response = await api.get(`${CONTENT}/${contentId}`);
    return response.data.data;
  } catch (error: any) {
    console.error(`Error al obtener el contenido (ID: ${contentId}):`, error.response?.data || error.message);
    throw error;
  }
};

// Crear un nuevo contenido
export const createContent = async (contentData: any) => {
  try {
    const response = await api.post(CONTENT, contentData);
    return response.data.data;
  } catch (error: any) {
    console.error('Error al crear el contenido:', error.response?.data || error.message);
    throw error;
  }
};

// Actualizar un contenido
export const updateContent = async (contentId: string, contentData: any) => {
  try {
    const response = await api.put(`${CONTENT}/${contentId}`, contentData);
    return response.data.data;
  } catch (error: any) {
    console.error(`Error al actualizar el contenido (ID: ${contentId}):`, error.response?.data || error.message);
    throw error;
  }
};

// Eliminar un contenido
export const deleteContent = async (contentId: string) => {
  try {
    const response = await api.delete(`${CONTENT}/${contentId}`);
    return response.data.data;
  } catch (error: any) {
    console.error(`Error al eliminar el contenido (ID: ${contentId}):`, error.response?.data || error.message);
    throw error;
  }
};

// Obtener todos los contenidos
export const getAllContents = async () => {
  try {
    const response = await api.get(CONTENT);
    return response.data.data || [];
  } catch (error: any) {
    console.error('Error al obtener todos los contenidos:', error.response?.data || error.message);
    throw error;
  }
};