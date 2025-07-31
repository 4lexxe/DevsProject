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

export const deleteContentQuiz = async (contentId: string, quizId: string) => {
  try {
    console.log(`Eliminando quiz ID: ${quizId} del contenido ID: ${contentId}`);
    const response = await api.delete(`${CONTENT}/${contentId}/quiz`);
    return response.data.data;
  } catch (error: any) {
    console.error(
      `Error al eliminar el quiz (ID: ${quizId}) del contenido (ID: ${contentId}):`,
      error.response?.data || error.message
    );
    throw error;
  }
}